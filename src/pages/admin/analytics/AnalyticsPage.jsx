import { useEffect } from 'react'
import { PageHeader, fmt } from '../adminShared'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminAnalyticsOverviewThunk, fetchAdminRevenueChartThunk } from '../../../redux/actions/admin/adminAnalyticsAction'
import { STATUS_COLORS_MAP, BarChart, MonthChart } from './AnalyticsShared'

export default function AnalyticsPage() {
    const dispatch = useDispatch()
    const { ov, revenueChart, loading } = useSelector((s) => s.adminAnalytics)

    useEffect(() => {
        const to = new Date().toISOString()
        const from = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        console.log(from, to)
        dispatch(fetchAdminAnalyticsOverviewThunk())
        dispatch(fetchAdminRevenueChartThunk({ from, to }))
    }, [dispatch])

    if (loading && !ov) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Đang tải dữ liệu phân tích...</div>
            </div>
        )
    }

    if (!ov) return null

    const stats = [
        { label: 'Doanh thu', value: fmt(ov.totalRevenue || 0), color: '#6366f1', icon: '💰' },
        { label: 'Đơn hàng', value: (ov.totalOrders || 0).toLocaleString(), color: '#10b981', icon: '📦' },
        { label: 'KH mới', value: ov.newCustomers || 0, color: '#f59e0b', icon: '👥' },
        { label: 'Giá trị TB', value: fmt(ov.avgOrderValue || 0), color: '#3b82f6', icon: '📊' },
    ]

    return (
        <div>
            <PageHeader title="Phân tích" subtitle="Tổng quan hiệu suất kinh doanh" />

            {/* KPI cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px', marginBottom: '20px' }}>
                {stats.map((s) => (
                    <div key={s.label} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>{s.label}</div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>
                {/* Revenue chart */}
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Doanh thu 14 ngày gần nhất</div>
                    <BarChart data={revenueChart || []} />
                </div>

                {/* Order by status donut-like */}
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Trạng thái đơn hàng</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {ov.ordersByStatus && Object.entries(ov.ordersByStatus).map(([status, count]) => {
                            const total = Object.values(ov.ordersByStatus).reduce((a, b) => a + b, 0)
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0
                            const color = STATUS_COLORS_MAP[status] ?? '#94a3b8'
                            return (
                                <div key={status}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '12px', color: '#374151' }}>{status}</span>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color }}>{count} ({pct}%)</span>
                                    </div>
                                    <div style={{ height: '5px', borderRadius: '3px', background: '#f1f5f9' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.5s' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Monthly revenue */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px', marginTop: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Doanh thu theo tháng</div>
                <MonthChart data={ov.revenueByMonth || []} />
            </div>
        </div>
    )
}
