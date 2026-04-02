import { REFRESH_TOKEN, TOKEN, USER_ROLE } from '../constants/System'

/** Đọc toàn bộ auth đã lưu (F5 / khởi động app). */
export function readAuthFromStorage() {
    try {
        return {
            accessToken: localStorage.getItem(TOKEN),
            refreshToken: localStorage.getItem(REFRESH_TOKEN),
            role: localStorage.getItem(USER_ROLE),
        }
    } catch {
        return { accessToken: null, refreshToken: null, role: null }
    }
}

/**
 * Ghi vào localStorage. Chỉ các field có trong object mới được cập nhật
 * (dùng `in` để phân biệt `undefined` và thiếu key).
 */
export function writeAuthToStorage(partial) {
    try {
        if ('accessToken' in partial) {
            if (partial.accessToken)
                localStorage.setItem(TOKEN, partial.accessToken)
            else localStorage.removeItem(TOKEN)
        }
        if ('refreshToken' in partial) {
            if (partial.refreshToken)
                localStorage.setItem(REFRESH_TOKEN, partial.refreshToken)
            else localStorage.removeItem(REFRESH_TOKEN)
        }
        if ('role' in partial) {
            const r = partial.role
            if (r == null || r === '') localStorage.removeItem(USER_ROLE)
            else localStorage.setItem(USER_ROLE, String(r))
        }
    } catch {
        /* ignore quota / private mode */
    }
}

/** Lưu đủ accessToken, refreshToken, role (sau login / đồng bộ). */
export function saveFullAuth({ accessToken, refreshToken, role }) {
    writeAuthToStorage({ accessToken, refreshToken, role })
}

export function clearAuthStorage() {
    try {
        localStorage.removeItem(TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
        localStorage.removeItem(USER_ROLE)
    } catch {
        /* ignore */
    }
}
