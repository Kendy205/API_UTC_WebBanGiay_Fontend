import { useState } from 'react'
import { MOCK_REPORTS } from '../adminMockData'
import { PageHeader, Table, fmt } from '../adminShared'

export default function ReportsPage() {
    const [groupBy, setGroupBy] = useState('week')
    const { summary, data } = MOCK_REPORTS

    const sumCards = [
        { label: 'Tổng doanh thu', value: fmt(summary.totalRevenue), color: '#6366f1' },
        { label: 'Tổng đơn hàng', value: summary.totalOrders.toLocaleString(), color: '#10b981' },
        { label: 'Giá trị TB / đơn', value: fmt(summary.avgOrderValue), color: '#f59e0b' },
        { label: 'Tỉ lệ hoàn trả', value: `${summary.returnRate}%`, color: '#ef4444' },
    ]

    const cols = [
        { key: 'period', label: 'Kỳ', render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span> },
        { key: 'revenue', label: 'Doanh thu', render: (v) => <span style={{ fontWeight: '700', color: '#6366f1' }}>{fmt(v)}</span> },
        { key: 'orders', label: 'Đơn hàng' },
        { key: 'avgValue', label: 'Giá trị TB', render: (v) => fmt(v) },
    ]

    return (
        <div>
            <PageHeader title="Báo cáo doanh số" subtitle="Thống kê theo kỳ" />

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', marginBottom: '20px' }}>
                {sumCards.map((c) => (
                    <div key={c.label} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '18px' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{c.label}</div>
                        <div style={{ fontSize: '22px', fontWeight: '700', color: c.color, marginTop: '4px', letterSpacing: '-0.5px' }}>{c.value}</div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[{ label: 'Theo ngày', v: 'day' }, { label: 'Theo tuần', v: 'week' }, { label: 'Theo tháng', v: 'month' }].map((t) => (
                    <button key={t.v} onClick={() => setGroupBy(t.v)} style={{ padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: groupBy === t.v ? '#6366f1' : '#f1f5f9', color: groupBy === t.v ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
                        {t.label}
                    </button>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="date" style={{ padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>→</span>
                    <input type="date" style={{ padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <Table columns={cols} data={data} keyField="period" />
            </div>

            {/* Export button */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📥 Xuất Excel
                </button>
            </div>
        </div>
    )
}
