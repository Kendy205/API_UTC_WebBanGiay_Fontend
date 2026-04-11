import { useState } from 'react'
import { MOCK_ORDERS, ORDER_STATUSES } from '../adminMockData'
import { PageHeader, Btn, Table, SearchBar, Select, useMockState, badge, STATUS_COLOR, fmt, fmtDate } from '../adminShared'

export default function OrdersAdminPage() {
    const [items, setItems] = useMockState(MOCK_ORDERS)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const filtered = items.filter((o) => {
        const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || String(o.id).includes(search)
        const matchStatus = statusFilter ? o.status === statusFilter : true
        return matchSearch && matchStatus
    })

    const handleStatus = (id, status) => {
        setItems((p) => p.map((x) => x.id === id ? { ...x, status } : x))
    }

    const cols = [
        { key: 'id', label: 'Mã đơn', render: (v) => <span style={{ fontWeight: '700', color: '#6366f1' }}>#{v}</span> },
        { key: 'customerName', label: 'Khách hàng', render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span> },
        { key: 'itemCount', label: 'SP', render: (v) => `${v} sản phẩm` },
        { key: 'total', label: 'Tổng tiền', render: (v) => <span style={{ fontWeight: '700', color: '#0f172a' }}>{fmt(v)}</span> },
        { key: 'paymentMethod', label: 'Thanh toán', render: (v) => <span style={badge('#6366f1')}>{v}</span> },
        { key: 'createdAt', label: 'Ngày đặt', render: (v) => fmtDate(v) },
        { key: 'status', label: 'Trạng thái', render: (v) => <span style={badge(STATUS_COLOR[v] ?? '#94a3b8')}>{v}</span> },
        {
            key: '_a', label: 'Cập nhật', render: (_, row) => (
                <select
                    value={row.status}
                    onChange={(e) => handleStatus(row.id, e.target.value)}
                    style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', background: '#f8fafc', cursor: 'pointer' }}
                >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            )
        },
    ]

    const statusCounts = ORDER_STATUSES.reduce((acc, s) => {
        acc[s] = items.filter((x) => x.status === s).length
        return acc
    }, {})

    return (
        <div>
            <PageHeader title="Quản lý đơn hàng" subtitle={`${items.length} đơn hàng`} />

            {/* Status tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {[{ label: 'Tất cả', value: '' }, ...ORDER_STATUSES.map((s) => ({ label: s, value: s }))].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setStatusFilter(tab.value)}
                        style={{
                            padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                            background: statusFilter === tab.value ? (STATUS_COLOR[tab.value] ?? '#6366f1') : '#f1f5f9',
                            color: statusFilter === tab.value ? '#fff' : '#64748b',
                            transition: 'all 0.15s',
                        }}
                    >
                        {tab.label} {tab.value ? `(${statusCounts[tab.value]})` : `(${items.length})`}
                    </button>
                ))}
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên / mã đơn..." />
                </div>
                <Table columns={cols} data={filtered} />
            </div>
        </div>
    )
}
