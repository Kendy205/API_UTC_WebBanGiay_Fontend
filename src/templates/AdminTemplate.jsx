import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import LoadingLink from '../components/loading/LoadingLink'
import { navigateWithRouteLoading } from '../utils/route/navigateWithRouteLoading'
import { useState } from 'react'

/* ─── Icons (inline SVG helpers) ─────────────────────────────────────────── */
const Icon = ({ d, size = 20, viewBox = '0 0 24 24' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
)

/* ─── Nav items config ───────────────────────────────────────────────────── */
const NAV_GROUPS = [
    {
        label: 'Tổng quan',
        items: [
            // {
            //     label: 'Dashboard',
            //     to: '/admin',
            //     icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
            // },
            {
                label: 'Dashboard',
                to: '/admin/analytics',
                icon: 'M18 20V10 M12 20V4 M6 20v-6',
            },
            {
                label: 'Báo cáo',
                to: '/admin/reports',
                icon: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
            },
        ],
    },
    {
        label: 'Cửa hàng',
        items: [
            {
                label: 'Sản phẩm',
                to: '/admin/products',
                icon: ['M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'],
            },
            {
                label: 'Danh mục',
                to: '/admin/categories',
                icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
            },
            {
                label: 'Thương hiệu',
                to: '/admin/brands',
                icon: ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'],
            },
            {
                label: 'Tồn kho',
                to: '/admin/inventory',
                icon: ['M5 8h14', 'M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M19 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M5 8v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8', 'M10 12h4'],
            },
            // {
            //     label: 'Khuyến mãi',
            //     to: '/admin/promotions',
            //     icon: ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'],
            // },
        ],
    },
    {
        label: 'Giao dịch',
        items: [
            {
                label: 'Đơn hàng',
                to: '/admin/orders',
                icon: ['M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'],
                badge: 12,
            },
            {
                label: 'Thanh toán',
                to: '/admin/payments',
                icon: ['M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z', 'M1 10h22'],
            },
            // {
            //     label: 'Hoàn trả',
            //     to: '/admin/refunds',
            //     icon: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5'],
            // },
        ],
    },
    {
        label: 'Người dùng',
        items: [
            {
                label: 'Khách hàng',
                to: '/admin/customers',
                icon: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
            },

            {
                label: 'Đánh giá',
                to: '/admin/reviews',
                icon: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
            },
        ],
    },
    {
        label: 'Hệ thống',
        items: [
            {
                label: 'Cài đặt',
                to: '/admin/settings',
                icon: ['M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M12 2v2', 'M12 20v2', 'M4.93 4.93l1.41 1.41', 'M17.66 17.66l1.41 1.41', 'M2 12h2', 'M20 12h2', 'M6.34 17.66l-1.41 1.41', 'M19.07 4.93l-1.41 1.41'],
            },
            // {
            //     label: 'Nhật ký',
            //     to: '/admin/logs',
            //     icon: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h8', 'M8 9h1'],
            // },
        ],
    },
]

/* ─── Single nav item ─────────────────────────────────────────────────────── */
function NavItem({ item, collapsed }) {
    const location = useLocation()
    const isActive =
        item.to === '/admin'
            ? location.pathname === '/admin' || location.pathname === '/admin/'
            : location.pathname.startsWith(item.to)

    return (
        <LoadingLink
            to={item.to}
            title={collapsed ? item.label : undefined}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : '10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '10px' : '9px 12px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#fff' : 'rgba(203,213,225,0.85)',
                background: isActive
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    : 'transparent',
                boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.35)' : 'none',
                transition: 'all 0.18s ease',
                textDecoration: 'none',
                position: 'relative',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            }}
            className="admin-nav-item"
        >
            <span style={{ flexShrink: 0 }}>
                <Icon d={item.icon} size={18} />
            </span>
            {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
            {!collapsed && item.badge ? (
                <span
                    style={{
                        background: '#ef4444',
                        color: '#fff',
                        borderRadius: '999px',
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '1px 6px',
                        flexShrink: 0,
                    }}
                >
                    {item.badge}
                </span>
            ) : null}
        </LoadingLink>
    )
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ collapsed, onToggle, onLogout, navigate, dispatch }) {
    return (
        <aside
            style={{
                width: collapsed ? '64px' : '240px',
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
                position: 'sticky',
                top: 0,
                flexShrink: 0,
                overflow: 'hidden',
                zIndex: 40,
                borderRight: '1px solid rgba(255,255,255,0.05)',
            }}
        >
            {/* Logo */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: collapsed ? '20px 0' : '20px 16px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    minHeight: '72px',
                }}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '16px',
                        color: '#fff',
                        flexShrink: 0,
                        boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                    }}
                >
                    A
                </div>
                {!collapsed && (
                    <div>
                        <div
                            style={{
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#fff',
                                letterSpacing: '-0.3px',
                            }}
                        >
                            AdminPanel
                        </div>
                        <div
                            style={{
                                fontSize: '11px',
                                color: 'rgba(148,163,184,0.8)',
                                marginTop: '1px',
                            }}
                        >
                            Management System
                        </div>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav
                style={{
                    flex: 1,
                    padding: collapsed ? '12px 8px' : '12px 10px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                }}
            >
                {NAV_GROUPS.map((group) => (
                    <div key={group.label} style={{ marginBottom: '8px' }}>
                        {!collapsed && (
                            <div
                                style={{
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    color: 'rgba(100,116,139,0.9)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    padding: '6px 12px 4px',
                                }}
                            >
                                {group.label}
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {group.items.map((item) => (
                                <NavItem key={item.to} item={item} collapsed={collapsed} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom actions */}
            <div
                style={{
                    padding: collapsed ? '12px 8px' : '12px 10px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                }}
            >
                {/* Go to store */}
                <button
                    onClick={() =>
                        navigateWithRouteLoading({ dispatch, navigate, to: '/home' })
                    }
                    title="Về trang chủ"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: collapsed ? 0 : '10px',
                        padding: collapsed ? '10px' : '9px 12px',
                        borderRadius: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(148,163,184,0.8)',
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                    }}
                    className="admin-nav-item"
                >
                    <Icon
                        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"
                        size={18}
                    />
                    {!collapsed && <span>Về trang chủ</span>}
                </button>

                {/* Logout */}
                <button
                    onClick={onLogout}
                    title="Đăng xuất"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: collapsed ? 0 : '10px',
                        padding: collapsed ? '10px' : '9px 12px',
                        borderRadius: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(248,113,113,0.85)',
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                    }}
                    className="admin-nav-item admin-logout"
                >
                    <Icon
                        d={[
                            'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
                            'M16 17l5-5-5-5',
                            'M21 12H9',
                        ]}
                        size={18}
                    />
                    {!collapsed && <span>Đăng xuất</span>}
                </button>
            </div>

            {/* Collapse toggle */}
            <button
                onClick={onToggle}
                title={collapsed ? 'Mở rộng' : 'Thu gọn'}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '40px',
                    background: 'rgba(255,255,255,0.03)',
                    border: 'none',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(100,116,139,0.8)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontSize: '12px',
                    gap: '6px',
                }}
                className="admin-nav-item"
            >
                <Icon
                    d={
                        collapsed
                            ? 'M9 18l6-6-6-6'
                            : 'M15 18l-6-6 6-6'
                    }
                    size={16}
                />
                {!collapsed && <span style={{ fontSize: '11px' }}>Thu gọn</span>}
            </button>
        </aside>
    )
}

/* ─── Top Header ──────────────────────────────────────────────────────────── */
function TopBar({ role, collapsed }) {
    const location = useLocation()

    // Resolve page title from current path
    const allItems = NAV_GROUPS.flatMap((g) => g.items)
    const current = allItems.find((i) =>
        i.to === '/admin'
            ? location.pathname === '/admin' || location.pathname === '/admin/'
            : location.pathname.startsWith(i.to)
    )
    const pageTitle = current?.label ?? 'Admin Panel'

    return (
        <header
            style={{
                height: '60px',
                background: '#fff',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                position: 'sticky',
                top: 0,
                zIndex: 30,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
        >
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                    style={{
                        fontSize: '12px',
                        color: '#94a3b8',
                    }}
                >
                    Admin
                </span>
                <span style={{ color: '#cbd5e1', fontSize: '13px' }}>/</span>
                <span
                    style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1e293b',
                    }}
                >
                    {pageTitle}
                </span>
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Notification bell */}
                <button
                    style={{
                        position: 'relative',
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                    }}
                    className="topbar-btn"
                    title="Thông báo"
                >
                    <Icon
                        d={[
                            'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9',
                            'M13.73 21a2 2 0 0 1-3.46 0',
                        ]}
                        size={16}
                    />
                    <span
                        style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            border: '1.5px solid #fff',
                        }}
                    />
                </button>

                {/* Avatar / role badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 10px 4px 4px',
                        borderRadius: '999px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                    }}
                >
                    <div
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#fff',
                        }}
                    >
                        A
                    </div>
                    <div>
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#1e293b',
                                lineHeight: 1.2,
                            }}
                        >
                            Admin
                        </div>
                        <div
                            style={{
                                fontSize: '10px',
                                color: '#94a3b8',
                                lineHeight: 1.2,
                            }}
                        >
                            {role ?? 'ADMIN'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

/* ─── Root ────────────────────────────────────────────────────────────────── */
export default function AdminTemplate() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { role } = useSelector((s) => s.auth)
    const [collapsed, setCollapsed] = useState(false)

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
        <>
            {/* Global style for hover effects */}
            <style>{`
                .admin-nav-item:hover {
                    background: rgba(99,102,241,0.12) !important;
                    color: #fff !important;
                }
                .admin-logout:hover {
                    background: rgba(239,68,68,0.12) !important;
                    color: #f87171 !important;
                }
                .topbar-btn:hover {
                    background: #f1f5f9 !important;
                    color: #6366f1 !important;
                }
                .admin-content::-webkit-scrollbar { width: 6px; }
                .admin-content::-webkit-scrollbar-track { background: transparent; }
                .admin-content::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }
                nav::-webkit-scrollbar { width: 3px; }
                nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
            `}</style>

            <div
                style={{
                    display: 'flex',
                    minHeight: '100vh',
                    background: '#f8fafc',
                    fontFamily:
                        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
            >
                <Sidebar
                    collapsed={collapsed}
                    onToggle={() => setCollapsed((c) => !c)}
                    onLogout={onLogout}
                    navigate={navigate}
                    dispatch={dispatch}
                />

                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        overflow: 'hidden',
                    }}
                >
                    <TopBar role={role} collapsed={collapsed} />

                    <main
                        className="admin-content"
                        style={{
                            flex: 1,
                            padding: '24px',
                            overflowY: 'auto',
                        }}
                    >
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    )
}
