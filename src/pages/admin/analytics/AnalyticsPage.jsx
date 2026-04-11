import { useState } from 'react'
import { MOCK_ANALYTICS_OVERVIEW, MOCK_REVENUE_CHART } from '../adminMockData'
import { PageHeader, badge, fmt } from '../adminShared'

const STATUS_COLORS_MAP = {
    Pending: '#f59e0b', Confirmed: '#6366f1', Shipping: '#3b82f6', Completed: '#10b981', Cancelled: '#ef4444'
}

const BarChart = ({ data }) => {
    const max = Math.max(...data.map((d) => d.revenue), 1)
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '140px', padding: '0 4px' }}>
            {data.map((d) => (
                <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>
                        {d.revenue > 0 ? `${Math.round(d.revenue / 1000000)}M` : ''}
                    </div>
                    <div
                        style={{
                            width: '100%', background: 'linear-gradient(180deg,#6366f1,#a855f7)',
                            borderRadius: '4px 4px 0 0', flex: 'none',
                            height: `${Math.max(4, (d.revenue / max) * 110)}px`,
                            transition: 'height 0.4s ease',
                        }}
                    />
                    <div style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center', whiteSpace: 'nowrap' }}>{d.date}</div>
                </div>
            ))}
        </div>
    )
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
    const ov = MOCK_ANALYTICS_OVERVIEW

    const stats = [
        { label: 'Doanh thu', value: fmt(ov.totalRevenue), color: '#6366f1', icon: '💰' },
        { label: 'Đơn hàng', value: ov.totalOrders.toLocaleString(), color: '#10b981', icon: '📦' },
        { label: 'KH mới', value: ov.newCustomers, color: '#f59e0b', icon: '👥' },
        { label: 'Giá trị TB', value: fmt(ov.avgOrderValue), color: '#3b82f6', icon: '📊' },
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
                    <BarChart data={MOCK_REVENUE_CHART} />
                </div>

                {/* Order by status donut-like */}
                <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Trạng thái đơn hàng</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {Object.entries(ov.ordersByStatus).map(([status, count]) => {
                            const total = Object.values(ov.ordersByStatus).reduce((a, b) => a + b, 0)
                            const pct = Math.round((count / total) * 100)
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
                <MonthChart data={ov.revenueByMonth} />
            </div>
        </div>
    )
}
