import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { PageHeader, Table, SearchBar, Btn, Modal, FormField, Input, Select, badge, fmtDate } from '../adminShared'
import { fetchAdminCustomersThunk, createAdminCustomerThunk, updateAdminCustomerThunk } from '../../../redux/actions/admin/adminCustomerAction'

const EMPTY_USER = {
    userId: 0,
    fullName: '',
    email: '',
    phone: '',
    password: '',
    status: 'Active',
    roleId: 2
}

export default function CustomersPage() {
    const dispatch = useDispatch()
    const { items, loading } = useSelector((s) => s.adminCustomer)

    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    const [modalOpen, setModalOpen] = useState(false)
    const [form, setForm] = useState(EMPTY_USER)

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => clearTimeout(handler)
    }, [search])

    useEffect(() => {
        dispatch(fetchAdminCustomersThunk({
            Page: 1, // You can add pagination later similar to orders
            PageSize: 50,
            Search: debouncedSearch || undefined
        }))
    }, [dispatch, debouncedSearch])

    const handleOpen = (row = null) => {
        if (row) {
            // Extract roleId from first userRole if exists, otherwise default 2
            const currentRoleId = row.userRoles?.[0]?.roleId || 2
            setForm({
                userId: row.userId,
                fullName: row.fullName,
                email: row.email,
                phone: row.phone || '',
                status: row.status || 'Active',
                roleId: currentRoleId
            })
        } else {
            setForm(EMPTY_USER)
        }
        setModalOpen(true)
    }

    const handleSave = async () => {
        if (!form.fullName || !form.email) return message.error('Vui lòng nhập tên và email')

        // Cập nhật API yêu cầu password cũng mảng phẳng
        // Khi tạo mới yêu cầu phải có password
        if (form.userId === 0 && !form.password) {
            return message.error('Vui lòng nhập mật khẩu')
        }

        try {
            const submitData = {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                password: form.password,
                status: form.status,
                roleId: Number(form.roleId)
            }

            if (form.userId === 0) {
                await dispatch(createAdminCustomerThunk(submitData)).unwrap()
                message.success('Thêm người dùng thành công!')
            } else {
                await dispatch(updateAdminCustomerThunk({ id: form.userId, data: submitData })).unwrap()
                message.success('Cập nhật người dùng thành công!')
            }
            setModalOpen(false)
            dispatch(fetchAdminCustomersThunk({ Page: 1, PageSize: 50, Search: debouncedSearch || undefined }))
        } catch (e) {
            message.error(e || 'Lỗi lưu dữ liệu')
        }
    }

    const handleDelete = async (row) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa (ẩn) người dùng ${row.fullName}?`)) return
        try {
            const submitData = {
                fullName: row.fullName,
                email: row.email,
                phone: row.phone,
                password: '', // Gửi chuỗi rỗng để không đổi pass, tùy backend xử lý
                status: 'deleted',
                roleId: row.userRoles?.[0]?.roleId || 2
            }
            await dispatch(updateAdminCustomerThunk({ id: row.userId, data: submitData })).unwrap()
            message.success('Đã chuyển trạng thái thành deleted')
            dispatch(fetchAdminCustomersThunk({ Page: 1, PageSize: 50, Search: debouncedSearch || undefined }))
        } catch (e) {
            message.error(e || 'Lỗi xóa (ẩn) dữ liệu')
        }
    }

    const cols = [
        { key: 'userId', label: '#', render: (v) => <span style={{ color: '#94a3b8' }}>#{v}</span> },
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
        { key: 'roleNames', label: 'Vai trò', render: (v) => <span style={badge('#3b82f6')}>{v || 'Customer'}</span> },
        { key: 'createdAt', label: 'Ngày đăng ký', render: (v) => fmtDate(v) },
        {
            key: 'status', label: 'Trạng thái',
            render: (v) => {
                const color = v === 'Active' || v === '' || !v ? '#10b981' : (v === 'deleted' ? '#ef4444' : '#f59e0b')
                return <span style={badge(color)}>{v || 'Active'}</span>
            }
        },
        {
            key: '_a', label: '',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Btn small variant="secondary" onClick={() => handleOpen(row)}>Sửa</Btn>
                    <Btn small variant="danger" onClick={() => handleDelete(row)}>Xóa</Btn>
                </div>
            )
        }
    ]

    return (
        <div>
            <PageHeader
                title="Khách hàng"
                subtitle={loading ? "Đang tải..." : `${items.length} người dùng`}
                action={<Btn onClick={() => handleOpen()}>+ Thêm mới</Btn>}
            />
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <SearchBar value={search} onChange={setSearch} placeholder="Tìm tên, email..." />
                </div>
                <Table columns={cols} data={items} keyField="userId" />
            </div>

            <Modal open={modalOpen} title={form.userId === 0 ? 'Thêm người dùng' : 'Sửa thông tin'} onClose={() => setModalOpen(false)}>
                <FormField label="Họ tên">
                    <Input value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} placeholder="Nhập họ tên" />
                </FormField>
                <FormField label="Email">
                    <Input value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="user@example.com" />
                </FormField>
                <FormField label="Số điện thoại">
                    <Input value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="09xxxxxxx" />
                </FormField>
                <FormField label={form.userId === 0 ? "Mật khẩu" : "Đổi mật khẩu (bỏ trống nếu giữ nguyên)"}>
                    <Input type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} placeholder="Nhập mật khẩu" />
                </FormField>
                <FormField label="Trạng thái">
                    <Select
                        value={form.status}
                        onChange={v => setForm({ ...form, status: v })}
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'Inactive', value: 'Inactive' },
                            { label: 'Deleted', value: 'deleted' }
                        ]}
                    />
                </FormField>
                <FormField label="Phân quyền">
                    <Select
                        value={form.roleId}
                        onChange={v => setForm({ ...form, roleId: v })}
                        options={[
                            { label: 'Admin', value: 1 },
                            { label: 'Customer', value: 2 }
                        ]}
                    />
                </FormField>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                    <Btn variant="secondary" onClick={() => setModalOpen(false)}>Hủy</Btn>
                    <Btn onClick={handleSave}>Lưu thông tin</Btn>
                </div>
            </Modal>
        </div>
    )
}
