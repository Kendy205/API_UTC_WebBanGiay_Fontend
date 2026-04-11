import { useState } from 'react'
import { MOCK_PAYMENTS } from '../adminMockData'
import { PageHeader, Table, SearchBar, useMockState, badge, STATUS_COLOR, fmt, fmtDate } from '../adminShared'

export default function PaymentsPage() {
    const [items] = useMockState(MOCK_PAYMENTS)
    const [search, setSearch] = useState('')

    const filtered = items.filter((p) =>
        p.customerName.toLowerCase().includes(search.toLowerCase()) ||
        String(p.orderId).includes(search) ||
        p.id.toLowerCase().includes(search.toLowerCase())
    )

    const totalPaid = items.filter((x) => x.status === 'Paid').reduce((s, x) => s + x.amount, 0)

    const cols = [
        { key: 'id', label: 'Mã TT', render: (v) => <span style={{ fontFamily: 'monospace', fontWeight: '600', color: '#6366f1' }}>{v}</span> },
        { key: 'orderId', label: 'Mã đơn', render: (v) => <span style={{ color: '#6366f1' }}>#{v}</span> },
        { key: 'customerName', label: 'Khách hàng' },
        { key: 'amount', label: 'Số tiền', render: (v) => <span style={{ fontWeight: '700', color: '#0f172a' }}>{fmt(v)}</span> },
        { key: 'method', label: 'Phương thức', render: (v) => <span style={badge('#6366f1')}>{v}</span> },
        { key: 'status', label: 'Trạng thái', render: (v) => <span style={badge(STATUS_COLOR[v] ?? '#94a3b8')}>{v}</span> },
        { key: 'createdAt', label: 'Ngày', render: (v) => fmtDate(v) },
    ]

    return (
        <div>
            <PageHeader title="Thanh toán" subtitle={`Tổng thu: ${fmt(totalPaid)}`} />
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <SearchBar value={search} onChange={setSearch} placeholder="Tìm khách / mã đơn..." />
                </div>
                <Table columns={cols} data={filtered} />
            </div>
        </div>
    )
}
