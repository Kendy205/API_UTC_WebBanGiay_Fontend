import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { PageHeader, Btn, Table, Modal, FormField, Input, badge, Toggle } from '../adminShared'
import { EMPTY } from './CategoriesShared'
import {
    fetchAdminCategoriesThunk,
    createAdminCategoryThunk,
    updateAdminCategoryThunk,
} from '../../../redux/actions/admin/adminCategoryAction'

export default function CategoriesPage() {
    const dispatch = useDispatch()
    const { items, loading } = useSelector((s) => s.adminCategory)

    const [modal, setModal] = useState(null)         // null | 'add' | 'edit'
    const [form, setForm] = useState(EMPTY)
    const [confirmModal, setConfirmModal] = useState(null) // { category, onOk }
    const [search, setSearch] = useState('')

    useEffect(() => {
        dispatch(fetchAdminCategoriesThunk())
    }, [dispatch])

    const openAdd = () => { setForm(EMPTY); setModal('add') }
    const openEdit = (c) => { setForm({ ...c }); setModal('edit') }

    const handleSave = async () => {
        if (!form.categoryName?.trim()) return message.warning('Vui lòng nhập tên danh mục!')
        setModal(null)   // Đóng modal ngay, loading hiển thị phía background
        try {
            const payload = {
                categoryId: form.categoryId || 0,
                categoryName: form.categoryName.trim(),
                slug: form.slug?.trim() || '',
                isActive: form.isActive !== false,
            }
            if (modal === 'add') {
                await dispatch(createAdminCategoryThunk(payload)).unwrap()
                message.success('Thêm danh mục thành công!')
            } else {
                await dispatch(updateAdminCategoryThunk({ id: form.categoryId, data: payload })).unwrap()
                message.success('Cập nhật danh mục thành công!')
            }
            dispatch(fetchAdminCategoriesThunk())
        } catch (error) {
            message.error(error || 'Lỗi khi lưu danh mục')
        }
    }

    // Soft-delete: update isActive = false
    const handleHide = (category) => {
        setConfirmModal({
            category,
            onOk: async () => {
                try {
                    const payload = {
                        categoryId: category.categoryId,
                        categoryName: category.categoryName,
                        slug: category.slug,
                        isActive: false,
                    }
                    await dispatch(updateAdminCategoryThunk({ id: category.categoryId, data: payload })).unwrap()
                    message.success(`Đã ẩn danh mục "${category.categoryName}"!`)
                    dispatch(fetchAdminCategoriesThunk())
                } catch (error) {
                    message.error(error || 'Lỗi khi ẩn danh mục')
                } finally {
                    setConfirmModal(null)
                }
            }
        })
    }

    const handleReactivate = async (category) => {
        try {
            await dispatch(updateAdminCategoryThunk({
                id: category.categoryId,
                data: { ...category, isActive: true }
            })).unwrap()
            message.success('Đã kích hoạt lại danh mục!')
            dispatch(fetchAdminCategoriesThunk())
        } catch (error) {
            message.error(error || 'Lỗi khi kích hoạt danh mục')
        }
    }

    const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }))

    const filtered = items.filter(c =>
        (c.categoryName || '').toLowerCase().includes(search.toLowerCase())
    )

    const cols = [
        { key: 'categoryId', label: '#', render: (v) => <span style={{ color: '#94a3b8' }}>#{v}</span> },
        { key: 'categoryName', label: 'Tên danh mục', render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span> },
        { key: 'slug', label: 'Slug', render: (v) => <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '12px' }}>{v}</span> },
        { key: 'isActive', label: 'Trạng thái', render: (v) => <span style={badge(v ? '#10b981' : '#94a3b8')}>{v ? 'Hoạt động' : 'Ẩn'}</span> },
        {
            key: '_a', label: 'Thao tác', render: (_, row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <Btn small variant="secondary" onClick={() => openEdit(row)}>Sửa</Btn>
                    {row.isActive ? (
                        <Btn small variant="danger" onClick={() => handleHide(row)}>Ẩn</Btn>
                    ) : (
                        <Btn small variant="success" onClick={() => handleReactivate(row)}>Kích hoạt</Btn>
                    )}
                </div>
            )
        },
    ]

    return (
        <div>
            <PageHeader
                title="Quản lý danh mục"
                subtitle={loading ? 'Đang tải...' : `${items.length} danh mục`}
                action={<Btn onClick={openAdd}>+ Thêm danh mục</Btn>}
            />

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                {/* Search */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="🔍 Tìm danh mục..."
                        style={{
                            width: '280px', padding: '8px 12px', border: '1px solid #e2e8f0',
                            borderRadius: '8px', fontSize: '13px', outline: 'none',
                        }}
                    />
                </div>
                <Table columns={cols} data={filtered} keyField="categoryId" />
            </div>

            {/* ── MODAL THÊM / SỬA ── */}
            <Modal
                open={!!modal}
                title={modal === 'add' ? '+ Thêm danh mục' : '✏️ Sửa danh mục'}
                onClose={() => setModal(null)}
            >
                <FormField label="Tên danh mục *">
                    <Input value={form.categoryName} onChange={f('categoryName')} placeholder="Sneakers, Boots..." />
                </FormField>
                <FormField label="Đường dẫn (Slug)">
                    <Input value={form.slug} onChange={f('slug')} placeholder="sneakers" />
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
                    <Btn onClick={handleSave}>{modal === 'add' ? 'Tạo danh mục' : 'Lưu thay đổi'}</Btn>
                </div>
            </Modal>

            {/* ── MODAL XÁC NHẬN ẨN ── */}
            <Modal
                open={!!confirmModal}
                title="Ẩn danh mục"
                onClose={() => setConfirmModal(null)}
                width={420}
            >
                <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📂</div>
                    <p style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>
                        Ẩn "{confirmModal?.category?.categoryName}"?
                    </p>
                    <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                        Danh mục sẽ bị ẩn khỏi cửa hàng nhưng vẫn lưu trong hệ thống.<br />
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
