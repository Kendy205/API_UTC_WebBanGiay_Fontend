import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { message } from 'antd'
import { fetchMyOrdersThunk, cancelOrderThunk } from '../../redux/actions/user/orderAction'
import { createReviewThunk } from '../../redux/actions/user/reviewAction'
import Pagination from '../../components/common/Pagination'
import HistoryOrderItem from './HistoryOrderItem'

// Helper component for Star Rating
const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                >
                    ★
                </button>
            ))}
        </div>
    )
}

export default function OrderHistoryPage() {
    const dispatch = useDispatch()
    const { myOrders: orders, loadingOrders: loading, myOrdersError: error } = useSelector(state => state.order)
    const { submittingReview } = useSelector(state => state.review)

    // Review Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [rating, setRating] = useState(5)
    const [reviewContent, setReviewContent] = useState('')

    // Cancel Modal State
    const [cancelModal, setCancelModal] = useState({ open: false, orderId: null })
    const [isCancelling, setIsCancelling] = useState(false)
    const [cancelError, setCancelError] = useState(null)

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 5

    useEffect(() => {
        dispatch(fetchMyOrdersThunk())
    }, [dispatch])

    const openReviewModal = (item) => {
        setSelectedItem(item)
        setRating(5)
        setReviewContent('')
        setIsModalOpen(true)
    }

    const closeReviewModal = () => {
        setIsModalOpen(false)
        setSelectedItem(null)
    }

    const submitReview = async () => {
        if (!selectedItem) return

        try {
            const payload = {
                orderItemId: selectedItem.orderItemId,
                rating: rating,
                reviewTitle: '',
                reviewContent: reviewContent
            }
            await dispatch(createReviewThunk(payload)).unwrap()
            message.success('Cảm ơn bạn đã gửi đánh giá!')
            closeReviewModal()
        } catch (err) {
            console.error('Lỗi gửi đánh giá', err)
            message.error(typeof err === 'string' ? err : 'Đã có lỗi xảy ra khi gửi đánh giá.')
        }
    }

    const openCancelModal = (orderId) => {
        setCancelModal({ open: true, orderId })
        setCancelError(null)
    }

    const closeCancelModal = () => {
        if (isCancelling) return
        setCancelModal({ open: false, orderId: null })
        setCancelError(null)
    }

    const handleCancelOrder = async () => {
        const { orderId } = cancelModal
        if (!orderId) return
        setIsCancelling(true)
        setCancelError(null)
        try {
            await dispatch(cancelOrderThunk({ orderId })).unwrap()
            closeCancelModal()
        } catch (err) {
            console.error('Lỗi khi hủy đơn hàng', err)
            setCancelError(typeof err === 'string' ? err : 'Đã có lỗi xảy ra khi hủy đơn hàng.')
        } finally {
            setIsCancelling(false)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount || 0)
    }

    const formatDate = (dateString) => {
        const d = new Date(dateString)
        return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN')
    }

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Chờ xử lý'
            case 'confirmed': return 'Đã xác nhận'
            case 'shipping': return 'Đang giao'
            case 'completed': return 'Hoàn thành'
            case 'cancelled': return 'Đã hủy'
            default: return status
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-neutral-600">Đang tải lịch sử đơn hàng...</div>
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 text-neutral-900">Lịch sử đơn hàng</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-neutral-500">
                    Bạn chưa có đơn hàng nào.
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((order) => (
                        <div key={order.orderId} className="bg-white rounded-lg shadow border border-neutral-100 overflow-hidden">
                            {/* Header Order */}
                            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm text-neutral-500">Mã đơn hàng: <span className="font-semibold text-neutral-900">{order.orderCode}</span></p>
                                    <p className="text-sm text-neutral-500">Ngày đặt: {formatDate(order.createdAt)}</p>
                                </div>
                                <div className="text-right space-y-2">
                                    {order.paymentStatus && (
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mr-2 ${order.paymentStatus.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {order.paymentStatus.toLowerCase() === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    )}
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${order.orderStatus?.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-700' :
                                        order.orderStatus?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.orderStatus?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {getStatusText(order.orderStatus)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.orderItems?.map((item) => {
                                        const isPaid = order.paymentStatus?.toLowerCase() === 'paid' || order.orderStatus?.toLowerCase() === 'completed';
                                        return (
                                            <HistoryOrderItem
                                                key={item.orderItemId}
                                                item={item}
                                                openReviewModal={isPaid ? openReviewModal : null}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer Order summary */}
                            <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-100 flex justify-between items-end">
                                <div>
                                    {order.orderStatus?.toLowerCase() === 'pending' && (
                                        <button
                                            onClick={() => openCancelModal(order.orderId)}
                                            className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded transition-colors"
                                        >
                                            Hủy đơn hàng
                                        </button>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-neutral-500">Phí vận chuyển: {formatCurrency(order.shippingFee)}</p>
                                    <p className="text-lg font-bold text-red-600 mt-1">Tổng tiền: {formatCurrency(order.totalAmount)}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Phân trang */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.max(1, Math.ceil(orders.length / pageSize))}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Modal Review */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                            <h3 className="font-semibold text-lg">Đánh giá sản phẩm</h3>
                            <button onClick={closeReviewModal} className="text-neutral-400 hover:text-neutral-700 text-xl font-bold">&times;</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {selectedItem && (
                                <div className="text-sm text-neutral-600 mb-4 bg-neutral-50 p-3 rounded">
                                    <span className="font-medium">{selectedItem.productNameSnapshot}</span>
                                    <p>Màu: {selectedItem.colorNameSnapshot} - Size: {selectedItem.sizeLabelSnapshot}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm mb-1 font-medium text-neutral-700">Chất lượng sản phẩm</label>
                                <StarRating rating={rating} setRating={setRating} />
                            </div>

                            <div>
                                <label className="block text-sm mb-1 font-medium text-neutral-700">Nội dung đánh giá</label>
                                <textarea
                                    className="w-full border border-neutral-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                    rows={4}
                                    placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm này nhé..."
                                    value={reviewContent}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
                            <button
                                onClick={closeReviewModal}
                                disabled={submittingReview}
                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50"
                            >
                                Trở lại
                            </button>
                            <button
                                onClick={submitReview}
                                disabled={submittingReview}
                                className={`px-4 py-2 text-sm font-medium text-white rounded bg-neutral-900 hover:bg-neutral-800 ${submittingReview ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {submittingReview ? 'Đang gửi...' : 'Hoàn thành'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Hủy đơn hàng */}
            {cancelModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                            <h3 className="font-semibold text-lg text-neutral-900">Hủy đơn hàng</h3>
                            <button
                                onClick={closeCancelModal}
                                disabled={isCancelling}
                                className="text-neutral-400 hover:text-neutral-700 text-xl font-bold disabled:opacity-40"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {/* Icon cảnh báo */}
                            <div className="flex justify-center mb-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" className="text-red-500">
                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-center text-sm text-neutral-600">
                                Bạn có chắc chắn muốn <span className="font-semibold text-red-600">hủy đơn hàng</span> này không? Hành động này không thể hoàn tác.
                            </p>

                            {/* Error */}
                            {cancelError && (
                                <p className="mt-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-center text-xs text-red-600">
                                    {cancelError}
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
                            <button
                                onClick={closeCancelModal}
                                disabled={isCancelling}
                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50"
                            >
                                Không, giữ lại
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={isCancelling}
                                className={`px-4 py-2 text-sm font-medium text-white rounded bg-red-600 hover:bg-red-700 transition-colors ${isCancelling ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isCancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
