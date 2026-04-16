import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { PageHeader, Table, badge, fmtDate, Toggle } from '../adminShared'
import Pagination from '../../../components/common/Pagination'
import { stars } from './ReviewsShared'
import { fetchAdminReviewsThunk, updateAdminReviewVisibilityThunk } from '../../../redux/actions/admin/adminReviewAdminAction'

export default function ReviewsAdminPage() {
    const dispatch = useDispatch()
    const { items, total, loading } = useSelector((s) => s.adminReviewAdmin)

    const [filter, setFilter] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 10

    useEffect(() => {
        dispatch(fetchAdminReviewsThunk({
            Page: page,
            PageSize: pageSize,
            Rating: filter || undefined
        }))
    }, [dispatch, page, pageSize, filter])

    const toggleVisible = async (row) => {
        try {
            await dispatch(updateAdminReviewVisibilityThunk({ id: row.id, isPublic: !row.isPublic })).unwrap()
            message.success(`Đã ${!row.isPublic ? 'hiện' : 'ẩn'} đánh giá`)
        } catch (e) {
            message.error(e || 'Lỗi cập nhật hiển thị')
        }
    }

    const cols = [
        { key: 'id', label: '#', render: (v) => <span style={{ color: '#94a3b8' }}>#{v}</span> },
        { key: 'productName', label: 'Sản phẩm', render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span> },
        { key: 'customerName', label: 'Khách hàng' },
        { key: 'rating', label: 'Sao', render: (v) => <span style={{ color: '#f59e0b', fontSize: '14px', letterSpacing: '1px' }}>{stars(v)}</span> },
        { key: 'comment', label: 'Nội dung', render: (v) => <span style={{ color: '#64748b', fontSize: '12px', maxWidth: '300px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span> },
        { key: 'createdAt', label: 'Ngày', render: (v) => fmtDate(v) },
        {
            key: 'isPublic', label: 'Hiển thị',
            render: (v, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Toggle checked={v} onChange={() => toggleVisible(row)} />
                    <span style={{ fontSize: '12px', color: v ? '#10b981' : '#94a3b8' }}>{v ? 'Hiện' : 'Ẩn'}</span>
                </div>
            )
        }
    ]

    return (
        <div>
            <PageHeader title="Đánh giá sản phẩm" subtitle={loading ? 'Đang tải...' : `${total} đánh giá`} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[{ label: 'Tất cả', v: '' }, ...[5, 4, 3, 2, 1].map((n) => ({ label: `${n}★`, v: String(n) }))].map((t) => (
                    <button
                        key={t.v}
                        onClick={() => { setFilter(t.v); setPage(1); }}
                        style={{ padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: filter === t.v ? '#f59e0b' : '#f1f5f9', color: filter === t.v ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
                        {t.label}
                    </button>
                ))}
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
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
        </div>
    )
}
