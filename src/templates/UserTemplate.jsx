import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { ROLE_ADMIN } from '../utils/constants/System'
import LoadingLink from '../components/loading/LoadingLink'
import { navigateWithRouteLoading } from '../utils/route/navigateWithRouteLoading'
import { fetchCartThunk } from '../redux/actions/cartAction'
import { useEffect, useState } from 'react'
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

    const [searchKeyword, setSearchKeyword] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchKeyword.trim()) {
            navigateWithRouteLoading({
                dispatch,
                navigate,
                to: `/search?keyword=${encodeURIComponent(searchKeyword.trim())}`
            })
        }
    }

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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 pb-3 pt-3 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
                    {/* Brand */}
                    <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/home')}>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 font-bold text-white shadow-lg shadow-indigo-200">
                            S
                        </div>
                        <div className="text-sm">
                            <div className="font-extrabold tracking-tight text-slate-800 text-xl hidden sm:block">
                                ShopApp
                            </div>
                        </div>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8 hidden md:block group">
                        <div className="relative">
                            <input 
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Bạn muốn tìm gì hôm nay?"
                                className="w-full rounded-full border border-slate-200 bg-slate-100/80 px-5 py-2.5 text-sm transition-all duration-300 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50" 
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors bg-transparent border-0 p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Right Nav */}
                    <nav className="flex items-center gap-3 shrink-0">
                        <LoadingLink
                            to="/home"
                            className="flex items-center justify-center rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                            title="Trang chủ"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
                              <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"/>
                            </svg>
                        </LoadingLink>

                        {isAuthenticated && (
                            <LoadingLink
                                to="/order-history"
                                className="flex items-center justify-center rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                                title="Lịch sử đơn hàng"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                                </svg>
                            </LoadingLink>
                        )}

                        <LoadingLink
                            to="/cart"
                            className="relative flex items-center justify-center rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 mx-1"
                            title="Giỏ hàng"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-0 flex h-4.5 w-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </LoadingLink>

                        <div className="mx-1 h-6 w-px bg-slate-200"></div>

                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={onLogout}
                                title="Đăng xuất"
                                className="flex items-center justify-center rounded-full p-2.5 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                </svg>
                            </button>
                        ) : (
                            <LoadingLink
                                to="/login"
                                title="Đăng nhập"
                                className="flex items-center justify-center rounded-full bg-slate-100 p-2.5 text-slate-700 transition hover:bg-indigo-600 hover:text-white shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                </svg>
                            </LoadingLink>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    )
}

