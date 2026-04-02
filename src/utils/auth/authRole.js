import { jwtDecode } from 'jwt-decode'

/**
 * Lấy role từ envelope `data` của API Auth (login / refresh).
 */
export function extractRoleFromAuthPayload(payload) {
    if (!payload || typeof payload !== 'object') return null
    const raw =
        payload.role ??
        payload.userRole ??
        payload.user?.role ??
        (Array.isArray(payload.roles) ? payload.roles[0] : null)
    if (raw == null || raw === '') return null
    return typeof raw === 'string' ? raw.trim() : String(raw)
}

/** Claim `role` trong JWT (payload) — chỉ đọc phía client. */
export function getRoleFromAccessToken(accessToken) {
    if (!accessToken) return null
    try {
        const { role } = jwtDecode(accessToken)
        if (role == null || role === '') return null
        return typeof role === 'string' ? role.trim() : String(role)
    } catch {
        return null
    }
}

/** Ưu tiên role trong JSON API; không có thì đọc từ accessToken. */
export function resolveRoleFromAuth(payload, accessToken) {
    return (
        extractRoleFromAuthPayload(payload) ??
        getRoleFromAccessToken(accessToken)
    )
}
