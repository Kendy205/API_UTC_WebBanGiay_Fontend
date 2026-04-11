import { useState } from 'react'
import {
    MOCK_PRODUCTS, MOCK_CATEGORIES,
} from '../adminMockData'
import {
    PageHeader, Btn, Table, SearchBar, Modal, FormField, Input, Select,
    useMockState, badge, STATUS_COLOR, fmt,
} from '../adminShared'

const EMPTY = { name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '', isActive: true }

export default function ProductsAdminPage() {
    const [items, setItems] = useMockState(MOCK_PRODUCTS)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null) // null | 'add' | 'edit'
    const [form, setForm] = useState(EMPTY)

    const filtered = items.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const openAdd = () => { setForm(EMPTY); setModal('add') }
    const openEdit = (p) => {
        setForm({ ...p, price: String(p.price), stock: String(p.stock), categoryId: String(p.categoryId) })
        setModal('edit')
    }
    const handleSave = () => {
        const item = { ...form, id: form.id ?? Date.now(), price: Number(form.price), stock: Number(form.stock), categoryId: Number(form.categoryId) }
        if (modal === 'add') setItems((prev) => [item, ...prev])
        else setItems((prev) => prev.map((x) => x.id === item.id ? item : x))
        setModal(null)
    }
    const handleDelete = (id) => { if (confirm('Xóa sản phẩm này?')) setItems((prev) => prev.filter((x) => x.id !== id)) }

    const f = (k) => (v) => setForm((prev) => ({ ...prev, [k]: v }))

    const cols = [
        { key: 'id', label: '#', render: (v) => <span style={{ color: '#94a3b8', fontWeight: '600' }}>#{v}</span> },
        { key: 'name', label: 'Tên sản phẩm', render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span> },
        { key: 'categoryName', label: 'Danh mục' },
        { key: 'price', label: 'Giá', render: (v) => <span style={{ fontWeight: '600', color: '#6366f1' }}>{fmt(v)}</span> },
        { key: 'stock', label: 'Tồn kho', render: (v) => <span style={{ color: v < 5 ? '#ef4444' : '#10b981', fontWeight: '600' }}>{v}</span> },
        { key: 'sold', label: 'Đã bán', render: (v) => v ?? 0 },
        {
            key: 'isActive', label: 'Trạng thái',
            render: (v) => <span style={badge(v ? '#10b981' : '#94a3b8')}>{v ? 'Hoạt động' : 'Ẩn'}</span>
        },
        {
            key: '_actions', label: 'Thao tác',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <Btn small variant="secondary" onClick={() => openEdit(row)}>Sửa</Btn>
                    <Btn small variant="danger" onClick={() => handleDelete(row.id)}>Xóa</Btn>
                </div>
            )
        },
    ]

    return (
        <div>
            <PageHeader
                title="Quản lý sản phẩm"
                subtitle={`${items.length} sản phẩm`}
                action={<Btn onClick={openAdd}>+ Thêm sản phẩm</Btn>}
            />

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <SearchBar value={search} onChange={setSearch} placeholder="Tìm sản phẩm..." />
                </div>
                <Table columns={cols} data={filtered} />
            </div>

            <Modal open={!!modal} title={modal === 'add' ? 'Thêm sản phẩm' : 'Sửa sản phẩm'} onClose={() => setModal(null)}>
                <FormField label="Tên sản phẩm"><Input value={form.name} onChange={f('name')} placeholder="Nike Air Max..." /></FormField>
                <FormField label="Danh mục">
                    <Select value={String(form.categoryId)} onChange={f('categoryId')} options={[{ value: '', label: '-- Chọn --' }, ...MOCK_CATEGORIES.map((c) => ({ value: String(c.id), label: c.name }))]} />
                </FormField>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Giá (VND)"><Input type="number" value={form.price} onChange={f('price')} placeholder="0" /></FormField>
                    <FormField label="Tồn kho"><Input type="number" value={form.stock} onChange={f('stock')} placeholder="0" /></FormField>
                </div>
                <FormField label="URL ảnh"><Input value={form.imageUrl} onChange={f('imageUrl')} placeholder="https://..." /></FormField>
                <FormField label="Mô tả"><Input value={form.description} onChange={f('description')} placeholder="Mô tả ngắn..." /></FormField>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                    <Btn variant="secondary" onClick={() => setModal(null)}>Hủy</Btn>
                    <Btn onClick={handleSave}>Lưu</Btn>
                </div>
            </Modal>
        </div>
    )
}
