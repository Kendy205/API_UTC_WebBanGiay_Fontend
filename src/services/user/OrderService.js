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
     * Tạo đơn hàng mới.
     * POST /api/Order/checkout
     */
    createOrder = (body) => this.post('api/my/orders/checkout', body)

    /**
     * Lấy danh sách lịch sử đơn hàng
     * GET /api/Order
     */
    getMyOrders = () => this.get('api/my/orders')

    /**
     * Hủy đơn hàng.
     * POST /api/Order/cancel
     */
    cancelOrder = (orderId) => this.post(`api/my/orders/${orderId}/cancel`)

    /**
     * Lấy URL thanh toán VNPay cho một đơn hàng.
     * POST /api/Order/{orderId}/pay-vnpay
     * Returns: { paymentUrl: string }
     */
    payVnpay = (orderId) => this.post(`api/my/orders/${orderId}/pay-vnpay`)
}

export const orderService = new OrderService()
