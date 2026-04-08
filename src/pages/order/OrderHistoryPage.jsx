import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../../services/OrderService'
import { reviewService } from '../../services/ReviewService'
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
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Review Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [rating, setRating] = useState(5)
    const [reviewContent, setReviewContent] = useState('')
    const [submittingReview, setSubmittingReview] = useState(false)

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 5

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await orderService.getMyOrders()
            // Assume the response follows a standard format or direct array
            let data = response.data
            // If response wraps in "data" property again based on the provided JSON
            if (response.data && response.data.data) {
                data = response.data.data
            }
            // Sort by createdAt descending conceptually, assuming backend returns correct order
            setOrders(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Lỗi khi lấy lịch sử đơn hàng', err)
            setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.')
        } finally {
            setLoading(false)
        }
    }

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
            setSubmittingReview(true)
            const payload = {
                orderItemId: selectedItem.orderItemId,
                rating: rating,
                reviewTitle: '',
                reviewContent: reviewContent
            }
            await reviewService.createReview(payload)
            alert('Cảm ơn bạn đã gửi đánh giá!')
            closeReviewModal()
            // Optionally: Could mark the item as reviewed in state so the button disappears
        } catch (err) {
            console.error('Lỗi gửi đánh giá', err)
            alert(err.response?.data || 'Đã có lỗi xảy ra khi gửi đánh giá.')
        } finally {
            setSubmittingReview(false)
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
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${order.orderStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                                            order.orderStatus === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                        }`}>
                                        {getStatusText(order.orderStatus)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.orderItems?.map((item) => (
                                        <HistoryOrderItem 
                                            key={item.orderItemId} 
                                            item={item} 
                                            openReviewModal={openReviewModal} 
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Footer Order summary */}
                            <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-100 flex justify-end">
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
        </div>
    )
}
