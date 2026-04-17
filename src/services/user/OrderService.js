import { BaseServices } from '../BaseService'

export class OrderService extends BaseServices {
    /**
     * Lấy danh sách địa chỉ của user hiện tại.
     * GET /api/Address
     */
    getMyAddresses = () => this.get('api/Address')

    /**
     * Thêm địa chỉ mới
     * POST /api/Address
     */
    addAddress = (body) => this.post('api/Address', body)

    /**
     * Soft-delete địa chỉ: PUT /api/Address/{id} với isDelete: true
     */
    softDeleteAddress = (id, addressData) => this.put(`api/Address/${id}`, { ...addressData, isDelete: true })

    /**
     * Tạo đơn hàng mới.
     * POST /api/Order/checkout
     */
    createOrder = (body) => this.post('api/My/orders/checkout', body)

    /**
     * Lấy danh sách lịch sử đơn hàng
     * GET /api/My/orders
     */
    getMyOrders = ({ page = 1, pageSize = 10 } = {}) => this.get('api/My/orders', { params: { page, pageSize } })

    /**
     * Hủy đơn hàng.
     * POST /api/Order/cancel
     */
    cancelOrder = (orderId) => this.post(`api/My/orders/${orderId}/cancel`)

    /**
     * Lấy URL thanh toán VNPay cho một đơn hàng.
     * POST /api/Order/{orderId}/pay-vnpay
     * Returns: { paymentUrl: string }
     */
    payVnpay = (orderId) => this.post(`api/My/orders/${orderId}/pay-vnpay`)
}

export const orderService = new OrderService()
