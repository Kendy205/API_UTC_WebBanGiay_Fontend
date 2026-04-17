import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { PageHeader, Table, SearchBar, badge, STATUS_COLOR, fmt, fmtDate, Modal, Btn } from '../adminShared'
import Pagination from '../../../components/common/Pagination'
import { fetchAdminOrdersThunk, updateAdminOrderStatusThunk, fetchAdminOrderByIdThunk } from '../../../redux/actions/admin/adminOrderAdminAction'
import { clearSelectedOrder } from '../../../redux/slices/admin/adminOrderAdminSlice'

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipping', 'Completed', 'Cancelled']

export default function OrdersAdminPage() {
    const dispatch = useDispatch()
    const { items, total, loading, selectedItem, loadingDetail } = useSelector((s) => s.adminOrderAdmin)

    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 10

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 500)
        return () => clearTimeout(handler)
    }, [search])

    useEffect(() => {
        dispatch(fetchAdminOrdersThunk({
            Page: page,
            PageSize: pageSize,
            Status: statusFilter || undefined,
            Search: debouncedSearch || undefined
        }))
    }, [dispatch, page, pageSize, statusFilter, debouncedSearch])

    const handleStatus = async (row, newStatus) => {
        try {
            await dispatch(updateAdminOrderStatusThunk({ id: row.id, status: newStatus })).unwrap()
            message.success('Cập nhật trạng thái thành công!')
        } catch (e) {
            message.error(e || 'Lỗi cập nhật trạng thái')
        }
    }

    const handleViewDetail = async (id) => {
        setDetailModalOpen(true)
        await dispatch(fetchAdminOrderByIdThunk(id)).unwrap()
    }

    const closeDetail = () => {
        setDetailModalOpen(false)
        dispatch(clearSelectedOrder())
    }

    const cols = [
        { key: 'id', label: 'Mã đơn', render: (v, row) => <span style={{ fontWeight: '700', color: '#6366f1', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleViewDetail(row.id)}>#{v}</span> },
        { key: 'customerName', label: 'Khách hàng', render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span> },
        { key: 'itemCount', label: 'SP', render: (v) => `${v} sản phẩm` },
        { key: 'total', label: 'Tổng tiền', render: (v) => <span style={{ fontWeight: '700', color: '#0f172a' }}>{fmt(v)}</span> },
        { key: 'paymentMethod', label: 'Thanh toán', render: (v) => <span style={badge('#6366f1')}>{v}</span> },
        { key: 'createdAt', label: 'Ngày đặt', render: (v) => fmtDate(v) },
        { key: 'status', label: 'Trạng thái', render: (v) => <span style={badge(STATUS_COLOR[v] ?? '#94a3b8')}>{v}</span> },
        {
            key: '_a', label: 'Cập nhật', render: (_, row) => (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                        value={row.status}
                        onChange={(e) => handleStatus(row, e.target.value)}
                        style={{ padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', background: '#f8fafc', cursor: 'pointer' }}
                    >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Btn small variant="secondary" onClick={() => handleViewDetail(row.id)}>Chi tiết</Btn>
                </div>
            )
        },
    ]

    return (
        <div>
            <PageHeader title="Quản lý đơn hàng" subtitle={loading ? "Đang tải..." : `${total} đơn hàng`} />

            {/* Status tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {[{ label: 'Tất cả', value: '' }, ...ORDER_STATUSES.map((s) => ({ label: s, value: s }))].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                        style={{
                            padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                            background: statusFilter === tab.value ? (STATUS_COLOR[tab.value] ?? '#6366f1') : '#f1f5f9',
                            color: statusFilter === tab.value ? '#fff' : '#64748b',
                            transition: 'all 0.15s',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <SearchBar value={search} onChange={setSearch} placeholder="Tìm theo tên / mã đơn..." />
                </div>
                <Table columns={cols} data={items} keyField="id" />

                {total > pageSize && (
                    <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
                        <Pagination
                            currentPage={page}
                            totalPages={Math.ceil(total / pageSize)}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>

            <Modal open={detailModalOpen} title="Chi tiết đơn hàng" onClose={closeDetail} width={700}>
                {loadingDetail || !selectedItem ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Đang tải thông tin...</div>
                ) : (
                    <div>
                        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                            <p style={{ margin: 0, fontSize: '14px' }}><strong>Khách hàng:</strong> {selectedItem.customerName}</p>
                            <p style={{ margin: 0, fontSize: '14px' }}><strong>Địa chỉ:</strong> {selectedItem.address}</p>
                            <p style={{ margin: 0, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong>Trạng thái:</strong> <span style={badge(STATUS_COLOR[selectedItem.status] ?? '#94a3b8')}>{selectedItem.status}</span>
                            </p>
                            <p style={{ margin: 0, fontSize: '15px' }}><strong>Tổng thanh toán:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{fmt(selectedItem.total)}</span></p>
                        </div>
                        <h4 style={{ margin: '16px 0 8px 0', paddingBottom: '8px', color: '#1e293b' }}>Danh sách sản phẩm ({selectedItem.items?.length || 0})</h4>
                        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <Table
                                columns={[
                                    { key: 'productName', label: 'Tên sản phẩm', render: (v) => <span style={{ fontWeight: '500' }}>{v}</span> },
                                    { key: 'quantity', label: 'SL', render: v => `x${v}` },
                                    { key: 'unitPrice', label: 'Đơn giá', render: v => fmt(v) },
                                    { key: '_sum', label: 'Thành tiền', render: (_, r) => <span style={{ color: '#ef4444', fontWeight: '600' }}>{fmt(r.quantity * r.unitPrice)}</span> }
                                ]}
                                data={selectedItem.items || []}
                                keyField="productId"
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
