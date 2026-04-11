import { useState } from 'react'
import { MOCK_CUSTOMERS } from '../adminMockData'
import { PageHeader, Table, SearchBar, useMockState, badge, STATUS_COLOR, fmt, fmtDate, Toggle } from '../adminShared'

export default function CustomersPage() {
    const [items, setItems] = useMockState(MOCK_CUSTOMERS)
    const [search, setSearch] = useState('')

    const filtered = items.filter((c) =>
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )

    const toggleActive = (id) => {
        setItems((p) => p.map((x) => x.id === id ? { ...x, isActive: !x.isActive } : x))
    }

    const cols = [
        { key: 'id', label: '#', render: (v) => <span style={{ color: '#94a3b8' }}>#{v}</span> },
        {
            key: 'fullName', label: 'Khách hàng',
            render: (v, row) => (
                <div>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{v}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{row.email}</div>
                </div>
            )
        },
        { key: 'phone', label: 'Điện thoại' },
        { key: 'totalOrders', label: 'Đơn hàng', render: (v) => <span style={{ fontWeight: '600', color: '#6366f1' }}>{v}</span> },
        { key: 'totalSpent', label: 'Tổng chi tiêu', render: (v) => <span style={{ fontWeight: '700', color: '#0f172a' }}>{fmt(v)}</span> },
        { key: 'createdAt', label: 'Ngày đăng ký', render: (v) => fmtDate(v) },
        {
            key: 'isActive', label: 'Trạng thái',
            render: (v, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Toggle checked={v} onChange={() => toggleActive(row.id)} />
                    <span style={{ fontSize: '12px', color: v ? '#10b981' : '#ef4444' }}>{v ? 'Hoạt động' : 'Bị khóa'}</span>
                </div>
            )
        },
    ]

    return (
        <div>
            <PageHeader title="Khách hàng" subtitle={`${items.length} khách hàng`} />
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <SearchBar value={search} onChange={setSearch} placeholder="Tìm tên, email..." />
                </div>
                <Table columns={cols} data={filtered} />
            </div>
        </div>
    )
}
