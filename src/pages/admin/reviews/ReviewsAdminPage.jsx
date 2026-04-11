import { useState } from 'react'
import { MOCK_REVIEWS } from '../adminMockData'
import { PageHeader, Btn, Table, useMockState, badge, fmtDate, Toggle } from '../adminShared'

export default function ReviewsAdminPage() {
    const [items, setItems] = useMockState(MOCK_REVIEWS)
    const [filter, setFilter] = useState('')

    const toggleVisible = (id) => {
        setItems((p) => p.map((x) => x.id === id ? { ...x, isVisible: !x.isVisible } : x))
    }
    const handleDelete = (id) => { if (confirm('Xóa đánh giá này?')) setItems((p) => p.filter((x) => x.id !== id)) }

    const filtered = filter ? items.filter((x) => String(x.rating) === filter) : items

    const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

    const cols = [
        { key: 'id', label: '#', render: (v) => <span style={{ color: '#94a3b8' }}>#{v}</span> },
        { key: 'productName', label: 'Sản phẩm', render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span> },
        { key: 'customerName', label: 'Khách hàng' },
        { key: 'rating', label: 'Sao', render: (v) => <span style={{ color: '#f59e0b', fontSize: '14px', letterSpacing: '1px' }}>{stars(v)}</span> },
        { key: 'comment', label: 'Nội dung', render: (v) => <span style={{ color: '#64748b', fontSize: '12px', maxWidth: '220px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span> },
        { key: 'createdAt', label: 'Ngày', render: (v) => fmtDate(v) },
        {
            key: 'isVisible', label: 'Hiển thị',
            render: (v, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Toggle checked={v} onChange={() => toggleVisible(row.id)} />
                    <span style={{ fontSize: '12px', color: v ? '#10b981' : '#94a3b8' }}>{v ? 'Hiện' : 'Ẩn'}</span>
                </div>
            )
        },
        {
            key: '_a', label: '', render: (_, row) => (
                <Btn small variant="danger" onClick={() => handleDelete(row.id)}>Xóa</Btn>
            )
        },
    ]

    return (
        <div>
            <PageHeader title="Đánh giá sản phẩm" subtitle={`${items.length} đánh giá`} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[{ label: 'Tất cả', v: '' }, ...[5, 4, 3, 2, 1].map((n) => ({ label: `${n}★`, v: String(n) }))].map((t) => (
                    <button key={t.v} onClick={() => setFilter(t.v)} style={{ padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: filter === t.v ? '#f59e0b' : '#f1f5f9', color: filter === t.v ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
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
