import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardSummaryThunk } from '../../redux/actions/admin/adminAnalyticsAction'

const StatCard = ({ label, value, change, positive, icon, color, loading }) => (
    <div
        style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        className="stat-card"
    >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>{label}</span>
            <div
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: color + '15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                }}
            >
                {icon}
            </div>
        </div>
        <div>
            {loading ? (
                <div style={{
                    height: '32px', borderRadius: '8px',
                    background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.4s infinite',
                    marginBottom: '8px',
                }} />
            ) : (
                <>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', letterSpacing: '-1px' }}>
                        {value}
                    </div>
                    {change && (
                        <div style={{ fontSize: '12px', color: positive ? '#10b981' : '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <span>{positive ? '▲' : '▼'}</span>
                            <span>{change} so với tháng trước</span>
                        </div>
                    )}
                </>
            )}
        </div>
        <div
            style={{
                height: '3px',
                borderRadius: '2px',
                background: `linear-gradient(90deg, ${color}, ${color}40)`,
            }}
        />
    </div>
)

const RECENT_ORDERS = [
    { id: '#ORD-1024', customer: 'Nguyễn Văn A', product: 'Nike Air Max 270', amount: '₫1,890,000', status: 'Hoàn thành', statusColor: '#10b981' },
    { id: '#ORD-1023', customer: 'Trần Thị B', product: 'Adidas Ultraboost 22', amount: '₫2,450,000', status: 'Đang giao', statusColor: '#f59e0b' },
    { id: '#ORD-1022', customer: 'Lê Minh C', product: 'Puma RS-X3', amount: '₫1,250,000', status: 'Chờ xác nhận', statusColor: '#6366f1' },
    { id: '#ORD-1021', customer: 'Phạm Thị D', product: 'New Balance 574', amount: '₫1,590,000', status: 'Hoàn thành', statusColor: '#10b981' },
    { id: '#ORD-1020', customer: 'Hoàng Văn E', product: 'Converse Chuck 70', amount: '₫980,000', status: 'Đã huỷ', statusColor: '#ef4444' },
]

const TOP_PRODUCTS = [
    { name: 'Nike Air Max 270', sales: 84, pct: 84 },
    { name: 'Adidas Ultraboost 22', sales: 67, pct: 67 },
    { name: 'Puma RS-X3', sales: 52, pct: 52 },
    { name: 'New Balance 574', sales: 41, pct: 41 },
    { name: 'Converse Chuck 70', sales: 28, pct: 28 },
]

const formatCurrency = (value) => {
    if (value == null) return '—'
    if (value >= 1_000_000) return `₫${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `₫${(value / 1_000).toFixed(0)}K`
    return `₫${value.toLocaleString('vi-VN')}`
}

const formatPct = (value) => {
    if (value == null) return '—'
    return `${Number(value).toFixed(1)}%`
}

export default function AdminDashboardPage() {
    const dispatch = useDispatch()
    const { dashboardSummary, summaryLoading } = useSelector((state) => state.adminAnalytics)

    useEffect(() => {
        dispatch(fetchDashboardSummaryThunk())
    }, [dispatch])

    const stats = [
        {
            label: 'Doanh thu tháng',
            value: formatCurrency(dashboardSummary?.totalRevenue),
            icon: '💰',
            color: '#6366f1',
        },
        {
            label: 'Tổng đơn hàng',
            value: dashboardSummary?.totalOrders?.toLocaleString('vi-VN') ?? '—',
            icon: '📦',
            color: '#10b981',
        },
        {
            label: 'Giá trị đơn TB',
            value: formatCurrency(dashboardSummary?.avgOrderValue),
            icon: '📊',
            color: '#f59e0b',
        },
        {
            label: 'Tỉ lệ hoàn trả',
            value: formatPct(dashboardSummary?.returnRate),
            positive: false,
            icon: '↩️',
            color: '#ef4444',
        },
    ]

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
                }
                .order-row:hover { background: #f8fafc !important; }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Page heading */}
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                        Dashboard
                    </h1>
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>
                        Chào mừng trở lại! Đây là tổng quan hoạt động cửa hàng.
                    </p>
                </div>

                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {stats.map((s) => (
                        <StatCard key={s.label} {...s} loading={summaryLoading} />
                    ))}
                </div>

            </div>
        </>
    )
}

