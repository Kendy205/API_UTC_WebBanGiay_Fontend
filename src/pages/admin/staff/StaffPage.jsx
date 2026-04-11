import { useState } from 'react'
import { MOCK_STAFF, STAFF_ROLES } from '../adminMockData'
import { PageHeader, Btn, Table, Modal, FormField, Input, Select, useMockState, badge, STATUS_COLOR, Toggle, fmtDate } from '../adminShared'

const EMPTY = { fullName: '', email: '', password: '', role: 'STAFF', isActive: true }

export default function StaffPage() {
    const [items, setItems] = useMockState(MOCK_STAFF)
    const [modal, setModal] = useState(null)
    const [form, setForm] = useState(EMPTY)

    const openAdd = () => { setForm(EMPTY); setModal('add') }
    const openEdit = (s) => { setForm({ ...s }); setModal('edit') }
    const handleSave = () => {
        const item = { ...form, id: form.id ?? Date.now() }
        if (modal === 'add') setItems((p) => [...p, item])
        else setItems((p) => p.map((x) => x.id === item.id ? item : x))
        setModal(null)
    }
    const handleDelete = (id) => { if (confirm('Xóa nhân viên?')) setItems((p) => p.filter((x) => x.id !== id)) }
    const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }))

    const cols = [
        {
            key: 'fullName', label: 'Nhân viên',
            render: (v, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                        {v[0]}
                    </div>
                    <div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{v}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{row.email}</div>
                    </div>
                </div>
            )
        },
        { key: 'role', label: 'Vai trò', render: (v) => <span style={badge(STATUS_COLOR[v] ?? '#94a3b8')}>{v}</span> },
        { key: 'createdAt', label: 'Ngày tạo', render: (v) => fmtDate(v) },
        { key: 'isActive', label: 'Trạng thái', render: (v) => <span style={badge(v ? '#10b981' : '#94a3b8')}>{v ? 'Hoạt động' : 'Vô hiệu'}</span> },
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
            <PageHeader title="Nhân viên" subtitle={`${items.length} tài khoản`} action={<Btn onClick={openAdd}>+ Thêm nhân viên</Btn>} />
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <Table columns={cols} data={items} />
            </div>
            <Modal open={!!modal} title={modal === 'add' ? 'Thêm nhân viên' : 'Sửa nhân viên'} onClose={() => setModal(null)}>
                <FormField label="Họ tên"><Input value={form.fullName} onChange={f('fullName')} placeholder="Nguyễn Văn A" /></FormField>
                <FormField label="Email"><Input type="email" value={form.email} onChange={f('email')} placeholder="email@shop.com" /></FormField>
                {modal === 'add' && <FormField label="Mật khẩu"><Input type="password" value={form.password} onChange={f('password')} placeholder="••••••••" /></FormField>}
                <FormField label="Vai trò">
                    <Select value={form.role} onChange={f('role')} options={STAFF_ROLES.map((r) => ({ value: r, label: r }))} />
                </FormField>
                <FormField label="Trạng thái">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Toggle checked={form.isActive} onChange={f('isActive')} />
                        <span style={{ fontSize: '13px' }}>{form.isActive ? 'Hoạt động' : 'Vô hiệu'}</span>
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
