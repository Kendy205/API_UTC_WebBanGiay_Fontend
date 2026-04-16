import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminAnalyticsOverviewThunk, fetchOrderStatusDistributionThunk } from '../../../redux/actions/admin/adminAnalyticsAction'
import { PageHeader, fmt } from '../adminShared'

const STATUS_COLORS_MAP = {
    pending: '#f59e0b', confirmed: '#6366f1', shipping: '#3b82f6', delivered: '#10b981', completed: '#10b981', cancelled: '#ef4444'
}

function getStatusColor(status) {
    if (!status) return '#94a3b8';
    return STATUS_COLORS_MAP[status.toLowerCase()] || '#94a3b8';
}

const MonthChart = ({ data }) => {
    const max = Math.max(...data.map((d) => d.revenue), 1)
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px' }}>
            {data.map((d) => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{d.revenue > 0 ? `${Math.round(d.revenue / 1000000)}M` : ''}</div>
                    <div style={{ width: '100%', background: d.revenue > 0 ? 'linear-gradient(180deg,#10b981,#34d399)' : '#f1f5f9', borderRadius: '4px 4px 0 0', height: `${Math.max(4, (d.revenue / max) * 90)}px` }} />
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{d.month}</div>
                </div>
            ))}
        </div>
    )
}

export default function AnalyticsPage() {
    const [year, setYear] = useState(new Date().getFullYear())
    const dispatch = useDispatch()
    const { overview, statusDistribution, loading } = useSelector((state) => state.adminAnalytics)

    useEffect(() => {
        dispatch(fetchAdminAnalyticsOverviewThunk(year))
        dispatch(fetchOrderStatusDistributionThunk(year))
    }, [dispatch, year])

    const ov = overview || {
        totalRevenue: 0,
        totalOrders: 0,
        newCustomers: 0,
        avgOrderValue: 0,
        revenueByMonth: []
    }

    const stats = [
        { label: 'Doanh thu', value: fmt(ov.totalRevenue || 0), color: '#6366f1', icon: '💰' },
        { label: 'Đơn hàng', value: (ov.totalOrders || 0).toLocaleString(), color: '#10b981', icon: '📦' },
        { label: 'KH mới', value: ov.newCustomers || 0, color: '#f59e0b', icon: '👥' },
        { label: 'Giá trị TB', value: fmt(ov.avgOrderValue || 0), color: '#3b82f6', icon: '📊' },
    ]

    const onYearChange = (e) => {
        setYear(Number(e.target.value))
    }

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <PageHeader title="Phân tích" subtitle="Tổng quan hiệu suất kinh doanh" />
                <div style={{ marginTop: '20px' }}>
                    <select
                        value={year}
                        onChange={onYearChange}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', outline: 'none', background: '#fff', fontSize: '14px', fontWeight: '500' }}
                    >
                        {years.map(y => (
                            <option key={y} value={y}>Năm {y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
            ) : (
                <>
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
                        {/* Monthly revenue */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Doanh thu theo tháng (Năm {year})</div>
                            <MonthChart data={ov.revenueByMonth || []} />
                        </div>

                        {/* Order by status donut-like */}
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Trạng thái đơn hàng</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {(statusDistribution || []).map((item) => {
                                    const status = item.status
                                    const count = item.count
                                    const pct = Math.round(item.percentage)
                                    const color = getStatusColor(status)
                                    return (
                                        <div key={status}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '12px', color: '#374151', textTransform: 'capitalize' }}>{status}</span>
                                                <span style={{ fontSize: '12px', fontWeight: '600', color }}>{count} ({pct}%)</span>
                                            </div>
                                            <div style={{ height: '5px', borderRadius: '3px', background: '#f1f5f9' }}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.5s' }} />
                                            </div>
                                        </div>
                                    )
                                })}
                                {(!statusDistribution || statusDistribution.length === 0) && (
                                    <div style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '20px' }}>Không có dữ liệu</div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
