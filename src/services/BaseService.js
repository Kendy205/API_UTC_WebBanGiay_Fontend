import axios from 'axios'
import { DOMAN, REFRESH_TOKEN, TOKEN } from '../utils/constants/System'
import { resolveRoleFromAuth } from '../utils/auth/authRole'
import {
    startGlobalLoading,
    stopGlobalLoading,
} from '../redux/slices/uiSlice'

/** Instance dùng chung: baseURL + JSON + interceptors */
export const http = axios.create({
    baseURL: DOMAN,
    headers: {
        'Content-Type': 'application/json',
    },
})

function isPublicAuthPath(url) {
    const u = String(url || '')
    return (
        u.includes('Auth/login') ||
        u.includes('Auth/register') ||
        u.includes('Auth/refresh-token')
    )
}

let storePromise = null
function getStore() {
    if (!storePromise) {
        storePromise = import('../redux/store').then((m) => m.store)
    }
    return storePromise
}

async function dispatchStartLoading() {
    const store = await getStore()
    store.dispatch(startGlobalLoading())
}

async function dispatchStopLoading() {
    const store = await getStore()
    store.dispatch(stopGlobalLoading())
}

http.interceptors.request.use(async (config) => {
    if (!config.__skipGlobalLoading) {
        config.__globalLoadingCountered = true
        await dispatchStartLoading()
    }

    if (!isPublicAuthPath(config.url)) {
        const token = localStorage.getItem(TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token) {
    failedQueue.forEach((p) => {
        if (error) p.reject(error)
        else p.resolve(token)
    })
    failedQueue = []
}

async function dispatchLogout() {
    const { store } = await import('../redux/store')
    const { logout } = await import('../redux/slices/authSlice')
    store.dispatch(logout())
}

http.interceptors.response.use(
    async (response) => {
        if (response?.config?.__globalLoadingCountered) {
            await dispatchStopLoading()
        }
        return response
    },
    async (error) => {
        const originalRequest = error.config
        const status = error.response?.status
        const shouldStopLoading = Boolean(
            originalRequest?.__globalLoadingCountered
        )

        if (status !== 401 || !originalRequest) {
            if (shouldStopLoading) await dispatchStopLoading()
            return Promise.reject(error)
        }

        if (isPublicAuthPath(originalRequest.url)) {
            if (shouldStopLoading) await dispatchStopLoading()
            return Promise.reject(error)
        }

        if (originalRequest._retry) {
            await dispatchLogout()
            if (shouldStopLoading) await dispatchStopLoading()
            return Promise.reject(error)
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    originalRequest.__skipGlobalLoading = true
                    originalRequest.__globalLoadingCountered = false
                    originalRequest._retry = true
                    return http(originalRequest).finally(async () => {
                        if (shouldStopLoading) await dispatchStopLoading()
                    })
                })
                .catch(async (err) => {
                    if (shouldStopLoading) await dispatchStopLoading()
                    return Promise.reject(err)
                })
        }

        const accessToken = localStorage.getItem(TOKEN)
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        if (!accessToken || !refreshToken) {
            await dispatchLogout()
            if (shouldStopLoading) await dispatchStopLoading()
            return Promise.reject(error)
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            /** Gọi refresh bằng axios thuần để không kích hoạt lại interceptor của `http` */
            const { data: body } = await axios.post(
                `${DOMAN}/api/Auth/refresh-token`,
                { accessToken, refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (body.success === false || !body.data?.accessToken) {
                throw new Error(body.message || 'Refresh token thất bại')
            }

            const newAccess = body.data.accessToken
            const newRefresh = body.data.refreshToken
            const newRole = resolveRoleFromAuth(body.data, newAccess)

            const { store } = await import('../redux/store')
            const { hydrateTokens } = await import('../redux/slices/authSlice')
            store.dispatch(
                hydrateTokens({
                    accessToken: newAccess,
                    refreshToken: newRefresh,
                    ...(newRole != null ? { role: newRole } : {}),
                })
            )

            processQueue(null, newAccess)
            isRefreshing = false

            originalRequest.headers.Authorization = `Bearer ${newAccess}`
            originalRequest.__skipGlobalLoading = true
            originalRequest.__globalLoadingCountered = false
            originalRequest._retry = true

            return http(originalRequest).finally(async () => {
                if (shouldStopLoading) await dispatchStopLoading()
            })
        } catch (refreshErr) {
            processQueue(refreshErr, null)
            isRefreshing = false
            await dispatchLogout()
            if (shouldStopLoading) await dispatchStopLoading()
            return Promise.reject(refreshErr)
        }
    }
)

export class BaseServices {
    get = (ur, config = {}) => http.get(ur, config)

    post = (ur, model, config = {}) => http.post(ur, model, config)

    put = (ur, model, config = {}) => http.put(ur, model, config)

    delete = (ur, config = {}) => http.delete(ur, config)
}

export const baseServices = new BaseServices()
