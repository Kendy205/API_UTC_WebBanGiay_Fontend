import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { PageHeader, Btn, Table, Modal, FormField, Input, badge, Toggle } from '../adminShared'
import { EMPTY } from './CategoriesShared'

// Import Thunks
import {
    fetchAdminCategoriesThunk,
    createAdminCategoryThunk,
    updateAdminCategoryThunk,
    deleteAdminCategoryThunk
} from '../../../redux/actions/admin/adminCategoryAction'

export default function CategoriesPage() {
    const dispatch = useDispatch()
    const { items, loading } = useSelector((s) => s.adminCategory)

    const [modal, setModal] = useState(null)
    const [form, setForm] = useState(EMPTY)

    useEffect(() => {
        dispatch(fetchAdminCategoriesThunk())
    }, [dispatch])

    const openAdd = () => { setForm(EMPTY); setModal('add') }
    const openEdit = (c) => { setForm({ ...c }); setModal('edit') }
    
    const handleSave = async () => {
        try {
            const payload = {
                categoryId: form.categoryId || 0,
                parentId: form.parentId || 0,
                categoryName: form.categoryName || '',
                slug: form.slug || '',
                isActive: form.isActive !== false,
            }

            if (modal === 'add') {
                await dispatch(createAdminCategoryThunk(payload)).unwrap()
                message.success('Thêm danh mục thành công!')
            } else {
                await dispatch(updateAdminCategoryThunk({ id: form.categoryId, data: payload })).unwrap()
                message.success('Cập nhật danh mục thành công!')
            }
            setModal(null)
            dispatch(fetchAdminCategoriesThunk())
        } catch (error) {
            message.error(error || 'Lỗi khi lưu danh mục')
        }
    }

    const handleDelete = async (id) => {
        if (confirm('Xóa danh mục này?')) {
            try {
                await dispatch(deleteAdminCategoryThunk(id)).unwrap()
                message.success('Xóa thành công!')
                dispatch(fetchAdminCategoriesThunk())
            } catch (error) {
                message.error(error || 'Lỗi khi xóa bài viết')
            }
        }
    }

    const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }))

    const cols = [
        { key: 'categoryId', label: '#', render: (v) => <span style={{ color: '#94a3b8' }}>#{v}</span> },
        { key: 'categoryName', label: 'Tên danh mục', render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span> },
        { key: 'slug', label: 'Slug', render: (v) => <span style={{ color: '#64748b' }}>{v}</span> },
        { key: 'isActive', label: 'Trạng thái', render: (v) => <span style={badge(v ? '#10b981' : '#94a3b8')}>{v ? 'Hoạt động' : 'Ẩn'}</span> },
        {
            key: '_a', label: 'Thao tác', render: (_, row) => (
                <div style={{ display: 'flex', gap: '6px' }}>
                    <Btn small variant="secondary" onClick={() => openEdit(row)}>Sửa</Btn>
                    <Btn small variant="danger" onClick={() => handleDelete(row.categoryId)}>Xóa</Btn>
                </div>
            )
        },
    ]

    return (
        <div>
            <PageHeader title="Quản lý danh mục" subtitle={loading ? "Đang tải..." : `${items.length} danh mục`} action={<Btn onClick={openAdd}>+ Thêm danh mục</Btn>} />
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <Table columns={cols} data={items} keyField="categoryId" />
            </div>
            <Modal open={!!modal} title={modal === 'add' ? 'Thêm danh mục' : 'Sửa danh mục'} onClose={() => setModal(null)}>
                <FormField label="Tên danh mục"><Input value={form.categoryName} onChange={f('categoryName')} placeholder="Sneakers, Boots..." /></FormField>
                <FormField label="Đường dẫn (Slug)"><Input value={form.slug} onChange={f('slug')} placeholder="sneakers" /></FormField>
                <FormField label="Trạng thái">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Toggle checked={form.isActive !== false} onChange={f('isActive')} />
                        <span style={{ fontSize: '13px', color: form.isActive !== false ? '#10b981' : '#94a3b8' }}>{form.isActive !== false ? 'Hoạt động' : 'Ẩn'}</span>
                    </div>
                </FormField>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                    <Btn variant="secondary" onClick={() => setModal(null)}>Hủy</Btn>
                    <Btn onClick={handleSave}>Lưu</Btn>
                </div>
            </Modal>
        </div>
    )
}
