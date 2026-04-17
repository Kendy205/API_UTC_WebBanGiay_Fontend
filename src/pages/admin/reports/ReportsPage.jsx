import { useState, useEffect } from 'react'
import { message } from 'antd'
import { adminReportService } from '../../../services/admin/AdminReportService'
import { PageHeader, Table, fmt } from '../adminShared'

const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)
const fmt_date = (d) => d.toISOString().slice(0, 10)

export default function ReportsPage() {
    const [groupBy, setGroupBy] = useState('day')
    const [fromDate, setFromDate] = useState(fmt_date(thirtyDaysAgo))
    const [toDate, setToDate] = useState(fmt_date(today))
    const [reportData, setReportData] = useState({ summary: {}, data: [] })
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const fetchReports = async () => {
            if (!fromDate || !toDate) return;
            setLoading(true)
            try {
                const response = await adminReportService.getSalesReport({
                    from: fromDate,
                    to: toDate,
                    groupBy: groupBy
                })
                if (response.data && response.data.success) {
                    setReportData(response.data.data)
                }
            } catch (error) {
                console.error("Failed to fetch reports:", error)
                const errMsg = error.response?.data?.message || "Có lỗi xảy ra khi lấy dữ liệu báo cáo"
                message.error(errMsg)
                setReportData({ summary: {}, data: [] })
            } finally {
                setLoading(false)
            }
        }
        fetchReports()
    }, [groupBy, fromDate, toDate])

    const { summary, data } = reportData

    const sumCards = [
        { label: 'Tổng doanh thu', value: fmt(summary?.totalRevenue || 0), color: '#6366f1' },
        { label: 'Tổng đơn hàng', value: (summary?.totalOrders || 0).toLocaleString(), color: '#10b981' },
        { label: 'Giá trị TB / đơn', value: fmt(summary?.avgOrderValue || 0), color: '#f59e0b' },
        { label: 'Tỉ lệ hoàn trả', value: `${summary?.returnRate || 0}%`, color: '#ef4444' },
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
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>→</span>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Đang tải dữ liệu...</div>
                ) : (
                    <Table columns={cols} data={data || []} keyField="period" />
                )}
            </div>

            {/* Export button */}
            {/* <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📥 Xuất Excel
                </button>
            </div> */}
        </div>
    )
}