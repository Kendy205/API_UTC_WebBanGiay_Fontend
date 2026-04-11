const StatCard = ({ label, value, change, positive, icon, color }) => (
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
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', letterSpacing: '-1px' }}>
                {value}
            </div>
            <div style={{ fontSize: '12px', color: positive ? '#10b981' : '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>{positive ? '▲' : '▼'}</span>
                <span>{change} so với tháng trước</span>
            </div>
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

const STATS = [
    { label: 'Doanh thu tháng', value: '₫48.2M', change: '+12.5%', positive: true, icon: '💰', color: '#6366f1' },
    { label: 'Tổng đơn hàng', value: '1,284', change: '+8.1%', positive: true, icon: '📦', color: '#10b981' },
    { label: 'Khách hàng mới', value: '312', change: '+24.3%', positive: true, icon: '👥', color: '#f59e0b' },
    { label: 'Tỉ lệ hoàn trả', value: '2.4%', change: '-0.3%', positive: false, icon: '↩️', color: '#ef4444' },
]

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

export default function AdminDashboardPage() {
    return (
        <>
            <style>{`
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
                    {STATS.map((s) => <StatCard key={s.label} {...s} />)}
                </div>

                {/* Main content row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>

                    {/* Recent orders */}
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: '16px',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                padding: '16px 20px',
                                borderBottom: '1px solid #f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                                Đơn hàng gần đây
                            </div>
                            <button
                                style={{
                                    fontSize: '12px',
                                    color: '#6366f1',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}
                            >
                                Xem tất cả →
                            </button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                    {['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Số tiền', 'Trạng thái'].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: '10px 20px',
                                                textAlign: 'left',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                color: '#94a3b8',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {RECENT_ORDERS.map((o) => (
                                    <tr
                                        key={o.id}
                                        className="order-row"
                                        style={{
                                            borderTop: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            transition: 'background 0.12s ease',
                                        }}
                                    >
                                        <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: '600', color: '#6366f1' }}>{o.id}</td>
                                        <td style={{ padding: '12px 20px', fontSize: '13px', color: '#1e293b' }}>{o.customer}</td>
                                        <td style={{ padding: '12px 20px', fontSize: '13px', color: '#64748b' }}>{o.product}</td>
                                        <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{o.amount}</td>
                                        <td style={{ padding: '12px 20px' }}>
                                            <span
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    color: o.statusColor,
                                                    background: o.statusColor + '18',
                                                    borderRadius: '999px',
                                                    padding: '3px 10px',
                                                }}
                                            >
                                                {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Top products */}
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: '16px',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0',
                        }}
                    >
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
                            Sản phẩm bán chạy
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {TOP_PRODUCTS.map((p, i) => (
                                <div key={p.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '6px',
                                                    background: i === 0
                                                        ? 'linear-gradient(135deg,#f59e0b,#f97316)'
                                                        : i === 1
                                                        ? 'linear-gradient(135deg,#94a3b8,#cbd5e1)'
                                                        : 'linear-gradient(135deg,#a78bfa,#c4b5fd)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '10px',
                                                    fontWeight: '700',
                                                    color: '#fff',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {i + 1}
                                            </span>
                                            <span style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: '500' }}>
                                                {p.name}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1' }}>
                                            {p.sales}
                                        </span>
                                    </div>
                                    <div style={{ height: '5px', borderRadius: '3px', background: '#f1f5f9', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                height: '100%',
                                                width: `${p.pct}%`,
                                                background: 'linear-gradient(90deg,#6366f1,#a855f7)',
                                                borderRadius: '3px',
                                                transition: 'width 0.6s ease',
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick summary */}
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '14px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #6366f110, #a855f710)',
                                border: '1px solid #6366f120',
                            }}
                        >
                            <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Tổng sản phẩm đã bán
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5', marginTop: '4px', letterSpacing: '-0.5px' }}>
                                272
                                <span style={{ fontSize: '12px', fontWeight: '400', color: '#94a3b8', marginLeft: '4px' }}>
                                    sản phẩm
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity feed */}
                <div
                    style={{
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        padding: '20px',
                    }}
                >
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
                        Hoạt động gần đây
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {[
                            { time: '5 phút trước', text: 'Đơn hàng #ORD-1024 đã được xác nhận', dot: '#10b981' },
                            { time: '18 phút trước', text: 'Khách hàng mới đăng ký: Nguyễn Văn F', dot: '#6366f1' },
                            { time: '1 giờ trước', text: 'Sản phẩm "Nike Air Force 1" sắp hết hàng (còn 3)', dot: '#f59e0b' },
                            { time: '2 giờ trước', text: 'Đơn hàng #ORD-1020 đã bị huỷ bởi khách', dot: '#ef4444' },
                            { time: '3 giờ trước', text: 'Mã giảm giá SUMMER20 đã được kích hoạt', dot: '#a855f7' },
                        ].map((a, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '14px',
                                    padding: '12px 0',
                                    borderBottom: i < 4 ? '1px solid #f8fafc' : 'none',
                                }}
                            >
                                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                    <div
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            background: a.dot,
                                            marginTop: '3px',
                                            boxShadow: `0 0 0 3px ${a.dot}25`,
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', color: '#1e293b' }}>{a.text}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{a.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    )
}
