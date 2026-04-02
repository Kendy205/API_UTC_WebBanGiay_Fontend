import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function normalizeRole(r) {
    if (r == null) return null
    return String(r).trim().toUpperCase()
}

/**
 * Bọc route để:
 * - Require đăng nhập
 * - Optionally require role thuộc `allowedRoles`
 */
export default function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, role } = useSelector((s) => s.auth)
    const isLoading = useSelector((s) => s.ui.loadingCount > 0)

    // if (isLoading) {
    //     return (
    //         <div className="flex min-h-[30vh] items-center justify-center p-6">
    //             Đang xử lý...
    //         </div>
    //     )
    // }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const current = normalizeRole(role)
        const allow = allowedRoles.map(normalizeRole)
        if (!current || !allow.includes(current)) {
            return <Navigate to="/home" replace />
        }
    }

    return <Outlet />
}

