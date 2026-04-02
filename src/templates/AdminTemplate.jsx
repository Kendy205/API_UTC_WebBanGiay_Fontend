import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { ROLE_ADMIN } from '../utils/constants/System'
import LoadingLink from '../components/loading/LoadingLink'
import { navigateWithRouteLoading } from '../utils/route/navigateWithRouteLoading'

export default function AdminTemplate() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { role } = useSelector((s) => s.auth)

    const onLogout = () => {
        dispatch(logout())
        navigateWithRouteLoading({
            dispatch,
            navigate,
            to: '/',
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
                                Admin Panel
                            </div>
                            <div className="text-neutral-600">
                                Vai trò: {role ?? ROLE_ADMIN}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <LoadingLink
                            to="/home"
                            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
                        >
                            Về Home
                        </LoadingLink>
                        <button
                            type="button"
                            onClick={onLogout}
                            className="rounded bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
                <aside className="w-60 shrink-0">
                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="mb-3 text-sm font-semibold text-neutral-900">
                            Menu Admin
                        </div>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li className="rounded bg-neutral-100 px-3 py-2 font-medium text-neutral-900">
                                Dashboard
                            </li>
                            <li className="rounded px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                                Quản lý sản phẩm
                            </li>
                            <li className="rounded px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                                Quản lý người dùng
                            </li>
                            <li className="rounded px-3 py-2 text-neutral-700 hover:bg-neutral-100">
                                Đơn hàng
                            </li>
                        </ul>
                    </div>
                </aside>

                <section className="flex-1">
                    <Outlet />
                </section>
            </div>
        </div>
    )
}

