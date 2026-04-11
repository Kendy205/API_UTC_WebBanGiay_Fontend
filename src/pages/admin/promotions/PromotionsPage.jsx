import { useState } from 'react'
import { MOCK_PROMOTIONS } from '../adminMockData'
import { PageHeader, Btn, Table, Modal, FormField, Input, Select, useMockState, badge, Toggle, fmtDate, fmt } from '../adminShared'

const EMPTY = { code: '', discountType: 'Percent', discountValue: '', minOrderValue: '', maxUsage: '', startDate: '', endDate: '', isActive: true }

export default function PromotionsPage() {
    const [items, setItems] = useMockState(MOCK_PROMOTIONS)
    const [modal, setModal] = useState(null)
    const [form, setForm] = useState(EMPTY)

    const openAdd = () => { setForm(EMPTY); setModal('add') }
    const openEdit = (p) => { setForm({ ...p, discountValue: String(p.discountValue), minOrderValue: String(p.minOrderValue), maxUsage: String(p.maxUsage) }); setModal('edit') }
    const handleSave = () => {
        const item = { ...form, id: form.id ?? Date.now(), discountValue: Number(form.discountValue), minOrderValue: Number(form.minOrderValue), maxUsage: Number(form.maxUsage), usedCount: form.usedCount ?? 0 }
        if (modal === 'add') setItems((p) => [item, ...p])
        else setItems((p) => p.map((x) => x.id === item.id ? item : x))
        setModal(null)
    }
    const handleDelete = (id) => { if (confirm('Xóa mã này?')) setItems((p) => p.filter((x) => x.id !== id)) }
    const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }))

    const cols = [
        { key: 'code', label: 'Mã', render: (v) => <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#6366f1', fontSize: '13px' }}>{v}</span> },
        { key: 'discountType', label: 'Loại', render: (v) => <span style={badge(v === 'Percent' ? '#6366f1' : '#f59e0b')}>{v === 'Percent' ? 'Phần trăm' : 'Cố định'}</span> },
        { key: 'discountValue', label: 'Giá trị', render: (v, row) => row.discountType === 'Percent' ? `${v}%` : fmt(v) },
        { key: 'minOrderValue', label: 'Đơn tối thiểu', render: (v) => fmt(v) },
        { key: 'usedCount', label: 'Đã dùng', render: (v, row) => `${v}/${row.maxUsage}` },
        { key: 'endDate', label: 'Hết hạn', render: (v) => fmtDate(v) },
        { key: 'isActive', label: 'Trạng thái', render: (v) => <span style={badge(v ? '#10b981' : '#94a3b8')}>{v ? 'Đang chạy' : 'Dừng'}</span> },
        {
            key: '_a', label: '', render: (_, row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <Btn small variant="secondary" onClick={() => openEdit(row)}>Sửa</Btn>
                    <Btn small variant="danger" onClick={() => handleDelete(row.id)}>Xóa</Btn>
                </div>
            )
        },
    ]

    return (
        <div>
            <PageHeader title="Khuyến mãi" subtitle={`${items.filter((x) => x.isActive).length} mã đang chạy`} action={<Btn onClick={openAdd}>+ Tạo mã</Btn>} />
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <Table columns={cols} data={items} />
            </div>
            <Modal open={!!modal} title={modal === 'add' ? 'Tạo mã khuyến mãi' : 'Sửa mã'} onClose={() => setModal(null)} width={520}>
                <FormField label="Mã giảm giá"><Input value={form.code} onChange={f('code')} placeholder="SUMMER20" /></FormField>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Loại">
                        <Select value={form.discountType} onChange={f('discountType')} options={[{ value: 'Percent', label: 'Phần trăm (%)' }, { value: 'Fixed', label: 'Cố định (VND)' }]} />
                    </FormField>
                    <FormField label="Giá trị"><Input type="number" value={form.discountValue} onChange={f('discountValue')} /></FormField>
                    <FormField label="Đơn tối thiểu"><Input type="number" value={form.minOrderValue} onChange={f('minOrderValue')} /></FormField>
                    <FormField label="Max lượt dùng"><Input type="number" value={form.maxUsage} onChange={f('maxUsage')} /></FormField>
                    <FormField label="Ngày bắt đầu"><Input type="date" value={form.startDate} onChange={f('startDate')} /></FormField>
                    <FormField label="Ngày kết thúc"><Input type="date" value={form.endDate} onChange={f('endDate')} /></FormField>
                </div>
                <FormField label="Kích hoạt">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Toggle checked={form.isActive} onChange={f('isActive')} />
                        <span style={{ fontSize: '13px' }}>{form.isActive ? 'Đang chạy' : 'Tắt'}</span>
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
