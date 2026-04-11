import { createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/user/AuthService'
import { resolveRoleFromAuth } from '../../utils/auth/authRole'

function pickErrorMessage(error) {
    const data = error.response?.data
    if (typeof data?.message === 'string') return data.message
    if (Array.isArray(data?.errors) && data.errors[0]) return String(data.errors[0])
    return error.message || 'Có lỗi xảy ra'
}

/** POST /api/Auth/login — body: { email, password } */
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await authService.login({ email, password })
            const body = response.data

            if (body.success === false) {
                return rejectWithValue(body.message || 'Đăng nhập thất bại')
            }

            const payload = body.data
            if (!payload?.accessToken) {
                return rejectWithValue(
                    body.message || 'Không nhận được access token từ server'
                )
            }

            return {
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
                message: payload.message ?? body.message,
                role: resolveRoleFromAuth(payload, payload.accessToken),
            }
        } catch (error) {
            return rejectWithValue(pickErrorMessage(error))
        }
    }
)

/** POST /api/Auth/refresh-token — body: { accessToken, refreshToken } */
export const refreshAuth = createAsyncThunk(
    'auth/refreshAuth',
    async (_, { getState, rejectWithValue }) => {
        const { accessToken, refreshToken } = getState().auth
        if (!accessToken || !refreshToken) {
            return rejectWithValue('Thiếu token để làm mới phiên')
        }
        try {
            const response = await authService.refreshTokens({
                accessToken,
                refreshToken,
            })
            const body = response.data

            if (body.success === false) {
                return rejectWithValue(body.message || 'Làm mới token thất bại')
            }

            const payload = body.data
            if (!payload?.accessToken) {
                return rejectWithValue(
                    body.message || 'Không nhận được access token mới'
                )
            }

            return {
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
                message: payload.message ?? body.message,
                role: resolveRoleFromAuth(payload, payload.accessToken),
            }
        } catch (error) {
            return rejectWithValue(pickErrorMessage(error))
        }
    }
)

/** POST /api/Auth/register — body: { email, phone, password } */
export const register = createAsyncThunk(
    'auth/register',
    async ({ email, phone, password }, { rejectWithValue }) => {
        try {
            const response = await authService.register({ email, phone, password })
            const body = response.data

            if (body.success === false) {
                return rejectWithValue(body.message || 'Đăng ký thất bại')
            }

            const payload = body.data
            const accessToken = payload?.accessToken ?? null
            const refreshToken = payload?.refreshToken ?? null

            return {
                accessToken,
                refreshToken,
                message: payload?.message ?? body.message,
                role: resolveRoleFromAuth(payload, accessToken),
            }
        } catch (error) {
            return rejectWithValue(pickErrorMessage(error))
        }
    }
)
