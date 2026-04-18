import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PageHeader, Table, SearchBar, badge, fmt, fmtDate } from '../adminShared'
import Pagination from '../../../components/common/Pagination'
import { fetchAdminPaymentsThunk } from '../../../redux/actions/admin/adminPaymentAction'

const STATUS_COLOR = {
    Paid: '#10b981',
    Pending: '#f59e0b',
    Failed: '#ef4444',
    Refunded: '#6366f1',
}

const METHOD_COLOR = {
    Banking: '#6366f1',
    COD: '#f59e0b',
    VNPay: '#10b981',
}

const STATUSES = ['', 'Paid', 'Pending', 'Failed', 'Refunded']
const METHODS = ['', 'Banking', 'COD', 'VNPay']

export default function PaymentsPage() {
    const dispatch = useDispatch()
    const { items, total, page, pageSize, totalPages, loading } = useSelector((s) => s.adminPayment)

    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterMethod, setFilterMethod] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    // Gọi API mỗi khi filter / page thay đổi
    useEffect(() => {
        dispatch(fetchAdminPaymentsThunk({
            page: currentPage,
            pageSize: 10,
            search: search || undefined,
            status: filterStatus || undefined,
            method: filterMethod || undefined,
        }))
    }, [dispatch, currentPage, filterStatus, filterMethod])

    // Tìm kiếm client-side (tên, mã đơn, mã TT) trên data trang hiện tại
    const filtered = items.filter((p) => {
        const q = search.toLowerCase()
        return (
            (p.customerName || '').toLowerCase().includes(q) ||
            String(p.orderId).includes(q) ||
            (p.id || '').toLowerCase().includes(q)
        )
    })

    const totalPaid = items
        .filter((x) => x.status === 'Paid')
        .reduce((s, x) => s + x.amount, 0)

    const handlePageChange = (p) => {
        setCurrentPage(p)
    }

    const cols = [
        {
            key: 'id', label: 'Mã TT',
            render: (v) => <span style={{ fontFamily: 'monospace', fontWeight: '600', color: '#6366f1', fontSize: '12px' }}>{v}</span>
        },
        {
            key: 'orderId', label: 'Mã đơn',
            render: (v) => <span style={{ color: '#6366f1', fontWeight: '600' }}>#{v}</span>
        },
        { key: 'customerName', label: 'Khách hàng', render: (v) => <span style={{ fontWeight: '500' }}>{v}</span> },
        {
            key: 'amount', label: 'Số tiền',
            render: (v) => <span style={{ fontWeight: '700', color: '#0f172a' }}>{fmt(v)}</span>
        },
        {
            key: 'method', label: 'Phương thức',
            render: (v) => <span style={badge(METHOD_COLOR[v] ?? '#6366f1')}>{v}</span>
        },
        {
            key: 'status', label: 'Trạng thái',
            render: (v) => <span style={badge(STATUS_COLOR[v] ?? '#94a3b8')}>{v}</span>
        },
        { key: 'createdAt', label: 'Ngày', render: (v) => fmtDate(v) },
    ]

    return (
        <div>
            <PageHeader
                title="Thanh toán"
                subtitle={loading ? 'Đang tải...' : `Tổng thu (trang này): ${fmt(totalPaid)} — ${total} giao dịch`}
            />

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                {/* Filters */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Tìm khách / mã đơn / mã thanh toán..."
                    />
                    <select
                        value={filterStatus}
                        onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1) }}
                        style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
                    >
                        {STATUSES.map(s => <option key={s} value={s}>{s || 'Tất cả trạng thái'}</option>)}
                    </select>
                    <select
                        value={filterMethod}
                        onChange={e => { setFilterMethod(e.target.value); setCurrentPage(1) }}
                        style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none' }}
                    >
                        {METHODS.map(m => <option key={m} value={m}>{m || 'Tất cả phương thức'}</option>)}
                    </select>
                </div>

                <Table columns={cols} data={filtered} />

                {/* Pagination */}
                <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}
