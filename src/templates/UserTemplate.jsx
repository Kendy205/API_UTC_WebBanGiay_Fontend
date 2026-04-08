import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { ROLE_ADMIN } from '../utils/constants/System'
import LoadingLink from '../components/loading/LoadingLink'
import { navigateWithRouteLoading } from '../utils/route/navigateWithRouteLoading'
import { fetchCartThunk } from '../redux/actions/cartAction'
import { useEffect } from 'react'
import { clearCartLocal } from '../redux/slices/cartSlice'

function normalizeRole(r) {
    if (r == null) return null
    return String(r).trim().toUpperCase()
}

export default function UserTemplate() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { role, isAuthenticated } = useSelector((s) => s.auth)
    const cartCount = useSelector((s) =>
        (s.cart.items ?? []).reduce((sum, x) => sum + (x.quantity || 0), 0)
    )
    const r = normalizeRole(role)
    const canAdmin = isAuthenticated && (r === ROLE_ADMIN || r === 'ADMINISTRATOR')

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCartThunk())
        }
    }, [isAuthenticated, dispatch])

    const onLogout = () => {
        dispatch(clearCartLocal())
        dispatch(logout())
        navigateWithRouteLoading({
            dispatch,
            navigate,
            to: '/home',
            options: { replace: true },
        })
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <header className="sticky top-0 z-10 border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded bg-neutral-900" />
                        <div className="text-sm">
                            <div className="font-semibold text-neutral-900">
                                Shop App
                            </div>
                            <div className="text-neutral-600">
                                Chế độ: USER
                            </div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3">
                        <LoadingLink
                            to="/home"
                            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
                        >
                            Home
                        </LoadingLink>
                        <LoadingLink
                            to="/cart"
                            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
                        >
                            Giỏ hàng
                            {cartCount > 0 ? ` (${cartCount})` : ''}
                        </LoadingLink>
                        {isAuthenticated && (
                            <LoadingLink
                                to="/order-history"
                                className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
                            >
                                Lịch sử đơn hàng
                            </LoadingLink>
                        )}
                        {canAdmin && (
                            <LoadingLink
                                to="/admin"
                                className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
                            >
                                Admin
                            </LoadingLink>
                        )}
                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={onLogout}
                                className="rounded bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
                            >
                                Đăng xuất
                            </button>
                        ) : (
                            <>
                                <LoadingLink
                                    to="/login"
                                    className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
                                >
                                    Đăng nhập
                                </LoadingLink>
                                <LoadingLink
                                    to="/register"
                                    className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
                                >
                                    Đăng ký
                                </LoadingLink>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    )
}

