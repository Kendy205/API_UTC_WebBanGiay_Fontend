import { useState } from 'react'
import { MOCK_CATEGORIES } from '../adminMockData'
import { PageHeader, Btn, Table, Modal, FormField, Input, useMockState, badge, Toggle } from '../adminShared'

const EMPTY = { name: '', description: '', isActive: true }

export default function CategoriesPage() {
    const [items, setItems] = useMockState(MOCK_CATEGORIES)
    const [modal, setModal] = useState(null)
    const [form, setForm] = useState(EMPTY)

    const openAdd = () => { setForm(EMPTY); setModal('add') }
    const openEdit = (c) => { setForm({ ...c }); setModal('edit') }
    const handleSave = () => {
        const item = { ...form, id: form.id ?? Date.now(), productCount: form.productCount ?? 0 }
        if (modal === 'add') setItems((p) => [...p, item])
        else setItems((p) => p.map((x) => x.id === item.id ? item : x))
        setModal(null)
    }
    const handleDelete = (id) => { if (confirm('Xóa danh mục?')) setItems((p) => p.filter((x) => x.id !== id)) }
    const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }))

    const cols = [
        { key: 'id', label: '#', render: (v) => <span style={{ color: '#94a3b8' }}>#{v}</span> },
        { key: 'name', label: 'Tên danh mục', render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span> },
        { key: 'description', label: 'Mô tả' },
        { key: 'productCount', label: 'Số SP', render: (v) => <span style={{ fontWeight: '600', color: '#6366f1' }}>{v}</span> },
        { key: 'isActive', label: 'Trạng thái', render: (v) => <span style={badge(v ? '#10b981' : '#94a3b8')}>{v ? 'Hoạt động' : 'Ẩn'}</span> },
        {
            key: '_a', label: 'Thao tác', render: (_, row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <Btn small variant="secondary" onClick={() => openEdit(row)}>Sửa</Btn>
                    <Btn small variant="danger" onClick={() => handleDelete(row.id)}>Xóa</Btn>
                </div>
            )
        },
    ]

    return (
        <div>
            <PageHeader title="Quản lý danh mục" subtitle={`${items.length} danh mục`} action={<Btn onClick={openAdd}>+ Thêm danh mục</Btn>} />
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <Table columns={cols} data={items} />
            </div>
            <Modal open={!!modal} title={modal === 'add' ? 'Thêm danh mục' : 'Sửa danh mục'} onClose={() => setModal(null)}>
                <FormField label="Tên danh mục"><Input value={form.name} onChange={f('name')} placeholder="Running, Lifestyle..." /></FormField>
                <FormField label="Mô tả"><Input value={form.description} onChange={f('description')} placeholder="Mô tả ngắn..." /></FormField>
                <FormField label="Trạng thái">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Toggle checked={form.isActive} onChange={f('isActive')} />
                        <span style={{ fontSize: '13px', color: '#374151' }}>{form.isActive ? 'Hoạt động' : 'Ẩn'}</span>
                    </div>
                </FormField>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                    <Btn variant="secondary" onClick={() => setModal(null)}>Hủy</Btn>
                    <Btn onClick={handleSave}>Lưu</Btn>
                </div>
            </Modal>
        </div>
    )
}
