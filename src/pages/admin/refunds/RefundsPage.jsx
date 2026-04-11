import { useState } from 'react'
import { MOCK_REFUNDS } from '../adminMockData'
import { PageHeader, Btn, Table, useMockState, badge, STATUS_COLOR, fmt, fmtDate } from '../adminShared'

export default function RefundsPage() {
    const [items, setItems] = useMockState(MOCK_REFUNDS)
    const [filter, setFilter] = useState('')

    const updateStatus = (id, status) => {
        setItems((p) => p.map((x) => x.id === id ? { ...x, status } : x))
    }

    const filtered = filter ? items.filter((x) => x.status === filter) : items

    const cols = [
        { key: 'id', label: '#', render: (v) => <span style={{ color: '#94a3b8' }}>#{v}</span> },
        { key: 'orderId', label: 'Mã đơn', render: (v) => <span style={{ color: '#6366f1', fontWeight: '600' }}>#{v}</span> },
        { key: 'customerName', label: 'Khách hàng' },
        { key: 'amount', label: 'Số tiền', render: (v) => <span style={{ fontWeight: '700' }}>{fmt(v)}</span> },
        { key: 'reason', label: 'Lý do', render: (v) => <span style={{ color: '#64748b', fontSize: '12px' }}>{v}</span> },
        { key: 'createdAt', label: 'Ngày', render: (v) => fmtDate(v) },
        { key: 'status', label: 'Trạng thái', render: (v) => <span style={badge(STATUS_COLOR[v] ?? '#f59e0b')}>{v}</span> },
        {
            key: '_a', label: 'Xử lý', render: (_, row) => row.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <Btn small variant="success" onClick={() => updateStatus(row.id, 'Approved')}>Duyệt</Btn>
                    <Btn small variant="danger" onClick={() => updateStatus(row.id, 'Rejected')}>Từ chối</Btn>
                </div>
            ) : <span style={{ fontSize: '12px', color: '#94a3b8' }}>Đã xử lý</span>
        },
    ]

    return (
        <div>
            <PageHeader title="Hoàn trả" subtitle={`${items.filter((x) => x.status === 'Pending').length} yêu cầu chờ xử lý`} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[{ label: 'Tất cả', v: '' }, { label: 'Chờ xử lý', v: 'Pending' }, { label: 'Đã duyệt', v: 'Approved' }, { label: 'Từ chối', v: 'Rejected' }].map((t) => (
                    <button key={t.v} onClick={() => setFilter(t.v)} style={{ padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: filter === t.v ? '#6366f1' : '#f1f5f9', color: filter === t.v ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
                        {t.label}
                    </button>
                ))}
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <Table columns={cols} data={filtered} />
            </div>
        </div>
    )
}
