import { createSlice } from '@reduxjs/toolkit'
import { login, refreshAuth, register } from '../actions/authAction'
import {
    clearAuthStorage,
    readAuthFromStorage,
    saveFullAuth,
    writeAuthToStorage,
} from '../../utils/auth/authStorage'

const stored = readAuthFromStorage()

const initialState = {
    accessToken: stored.accessToken,
    refreshToken: stored.refreshToken,
    role: stored.role,
    isAuthenticated: Boolean(stored.accessToken),
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.accessToken = null
            state.refreshToken = null
            state.role = null
            state.isAuthenticated = false
            state.error = null
            clearAuthStorage()
        },
        clearAuthError: (state) => {
            state.error = null
        },
        hydrateTokens: (state, action) => {
            const { accessToken, refreshToken, role } = action.payload
            state.accessToken = accessToken
            state.refreshToken = refreshToken
            state.isAuthenticated = Boolean(accessToken)
            const patch = { accessToken, refreshToken }
            if (role !== undefined) {
                state.role = role ?? null
                patch.role = role ?? null
            }
            writeAuthToStorage(patch)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken
                state.refreshToken = action.payload.refreshToken
                state.role = action.payload.role ?? null
                state.isAuthenticated = true
                saveFullAuth({
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                    role: state.role,
                })
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload ?? 'Đăng nhập thất bại'
            })
            .addCase(register.pending, (state) => {
                state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.error = null

                const accessToken = action.payload.accessToken ?? null
                const refreshToken = action.payload.refreshToken ?? null
                const role = action.payload.role ?? null

                if (accessToken) {
                    state.accessToken = accessToken
                    state.refreshToken = refreshToken
                    state.role = role
                    state.isAuthenticated = true

                    saveFullAuth({ accessToken, refreshToken, role })
                } else {
                    // API có thể không trả token; lúc này giữ user chưa auth
                    state.accessToken = null
                    state.refreshToken = null
                    state.role = role
                    state.isAuthenticated = false
                }
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload ?? 'Đăng ký thất bại'
            })
            .addCase(refreshAuth.pending, (state) => {
                state.error = null
            })
            .addCase(refreshAuth.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken
                state.refreshToken = action.payload.refreshToken
                state.isAuthenticated = true
                writeAuthToStorage({
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                })
                if (action.payload.role != null) {
                    state.role = action.payload.role
                    writeAuthToStorage({ role: action.payload.role })
                }
            })
            .addCase(refreshAuth.rejected, (state, action) => {
                state.error = action.payload ?? 'Phiên hết hạn'
                state.accessToken = null
                state.refreshToken = null
                state.role = null
                state.isAuthenticated = false
                clearAuthStorage()
            })
    },
})

export const { logout, clearAuthError, hydrateTokens } = authSlice.actions
export default authSlice.reducer
