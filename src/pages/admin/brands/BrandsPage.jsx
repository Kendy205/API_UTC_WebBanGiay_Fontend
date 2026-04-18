import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { PageHeader, Btn, Table, Modal, FormField, Input, badge, Toggle } from '../adminShared'
import {
    fetchAdminBrandsThunk,
    createAdminBrandThunk,
    updateAdminBrandThunk,
} from '../../../redux/actions/admin/adminBrandAction'

const EMPTY = { brandId: 0, brandName: '', slug: '', isActive: true }

export default function BrandsPage() {
    const dispatch = useDispatch()
    const { items, loading } = useSelector((s) => s.adminBrand)

    const [modal, setModal] = useState(null)         // null | 'add' | 'edit'
    const [form, setForm] = useState(EMPTY)
    const [confirmModal, setConfirmModal] = useState(null) // { brand, onOk }
    const [search, setSearch] = useState('')

    useEffect(() => {
        dispatch(fetchAdminBrandsThunk())
    }, [dispatch])

    const openAdd = () => { setForm(EMPTY); setModal('add') }
    const openEdit = (b) => { setForm({ ...b }); setModal('edit') }

    const handleSave = async () => {
        if (!form.brandName?.trim()) return message.warning('Vui lòng nhập tên thương hiệu!')

        try {
            const payload = {
                brandId: form.brandId || 0,
                brandName: form.brandName.trim(),
                slug: form.slug?.trim() || form.brandName.trim().toLowerCase().replace(/\s+/g, '-'),
                isActive: form.isActive !== false,
                createdAt: form.createdAt || new Date().toISOString(),
            }

            if (modal === 'add') {
                await dispatch(createAdminBrandThunk(payload)).unwrap()
                message.success('Thêm thương hiệu thành công!')
            } else {
                await dispatch(updateAdminBrandThunk({ id: form.brandId, data: payload })).unwrap()
                message.success('Cập nhật thương hiệu thành công!')
            }
            setModal(null)
            dispatch(fetchAdminBrandsThunk())
        } catch (error) {
            message.error(error || 'Lỗi khi lưu thương hiệu')
        }
    }

    // Soft-delete: gọi update với isActive = false
    const handleDelete = (brand) => {
        setConfirmModal({
            brand,
            onOk: async () => {
                try {
                    const payload = {
                        brandId: brand.brandId,
                        brandName: brand.brandName,
                        slug: brand.slug,
                        isActive: false,
                        createdAt: brand.createdAt || new Date().toISOString(),
                    }
                    await dispatch(updateAdminBrandThunk({ id: brand.brandId, data: payload })).unwrap()
                    message.success(`Đã ẩn thương hiệu "${brand.brandName}"!`)
                    dispatch(fetchAdminBrandsThunk())
                } catch (error) {
                    message.error(error || 'Lỗi khi ẩn thương hiệu')
                } finally {
                    setConfirmModal(null)
                }
            }
        })
    }

    const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }))

    const filtered = items.filter(b =>
        (b.brandName || '').toLowerCase().includes(search.toLowerCase())
    )

    const cols = [
        { key: 'brandId', label: '#', render: (v) => <span style={{ color: '#94a3b8', fontWeight: '600' }}>#{v}</span> },
        {
            key: 'brandName', label: 'Tên thương hiệu',
            render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span>
        },
        { key: 'slug', label: 'Slug', render: (v) => <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '12px' }}>{v}</span> },
        {
            key: 'createdAt', label: 'Ngày tạo',
            render: (v) => <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {v ? new Date(v).toLocaleDateString('vi-VN') : '—'}
            </span>
        },
        {
            key: 'isActive', label: 'Trạng thái',
            render: (v) => <span style={badge(v ? '#10b981' : '#94a3b8')}>{v ? 'Hoạt động' : 'Ẩn'}</span>
        },
        {
            key: '_a', label: 'Thao tác',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <Btn small variant="secondary" onClick={() => openEdit(row)}>Sửa</Btn>
                    {row.isActive && (
                        <Btn small variant="danger" onClick={() => handleDelete(row)}>Ẩn</Btn>
                    )}
                    {!row.isActive && (
                        <Btn small variant="success" onClick={() => {
                            dispatch(updateAdminBrandThunk({
                                id: row.brandId,
                                data: { ...row, isActive: true }
                            })).then(() => {
                                message.success('Đã kích hoạt lại thương hiệu!')
                                dispatch(fetchAdminBrandsThunk())
                            })
                        }}>Kích hoạt</Btn>
                    )}
                </div>
            )
        },
    ]

    return (
        <div>
            <PageHeader
                title="Quản lý Thương hiệu"
                subtitle={loading ? 'Đang tải...' : `${items.length} thương hiệu`}
                action={<Btn onClick={openAdd}>+ Thêm thương hiệu</Btn>}
            />

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                {/* Search bar */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="🔍 Tìm thương hiệu..."
                        style={{
                            width: '280px', padding: '8px 12px', border: '1px solid #e2e8f0',
                            borderRadius: '8px', fontSize: '13px', outline: 'none',
                        }}
                    />
                </div>
                <Table columns={cols} data={filtered} keyField="brandId" />
            </div>

            {/* ── MODAL THÊM / SỬA ── */}
            <Modal
                open={!!modal}
                title={modal === 'add' ? '+ Thêm thương hiệu' : '✏️ Sửa thương hiệu'}
                onClose={() => setModal(null)}
            >
                <FormField label="Tên thương hiệu *">
                    <Input value={form.brandName} onChange={f('brandName')} placeholder="Nike, Adidas, Puma..." />
                </FormField>
                <FormField label="Đường dẫn (Slug)">
                    <Input value={form.slug} onChange={f('slug')} placeholder="nike (tự động nếu bỏ trống)" />
                </FormField>
                <FormField label="Trạng thái">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Toggle checked={form.isActive !== false} onChange={f('isActive')} />
                        <span style={{ fontSize: '13px', color: form.isActive !== false ? '#10b981' : '#94a3b8' }}>
                            {form.isActive !== false ? 'Hoạt động' : 'Ẩn'}
                        </span>
                    </div>
                </FormField>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                    <Btn variant="secondary" onClick={() => setModal(null)}>Hủy</Btn>
                    <Btn onClick={handleSave}>{modal === 'add' ? 'Tạo thương hiệu' : 'Lưu thay đổi'}</Btn>
                </div>
            </Modal>

            {/* ── MODAL XÁC NHẬN ẨN ── */}
            <Modal
                open={!!confirmModal}
                title="Ẩn thương hiệu"
                onClose={() => setConfirmModal(null)}
                width={420}
            >
                <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏷️</div>
                    <p style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>
                        Ẩn "{confirmModal?.brand?.brandName}"?
                    </p>
                    <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                        Thương hiệu sẽ bị ẩn khỏi cửa hàng nhưng vẫn lưu trong hệ thống.<br />
                        Bạn có thể kích hoạt lại bất cứ lúc nào.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <Btn variant="secondary" onClick={() => setConfirmModal(null)}>Hủy bỏ</Btn>
                        <button
                            onClick={confirmModal?.onOk}
                            style={{
                                padding: '9px 24px', borderRadius: '10px', border: 'none',
                                background: '#ef4444', color: '#fff', fontWeight: '600',
                                fontSize: '13px', cursor: 'pointer',
                            }}
                        >
                            Xác nhận ẩn
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
