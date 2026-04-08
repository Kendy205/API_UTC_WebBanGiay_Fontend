import { BaseServices } from './BaseService'

export class OrderService extends BaseServices {
    /**
     * Lấy danh sách địa chỉ của user hiện tại.
     * GET /api/Address
     */
    getMyAddresses = () => this.get('api/Address')

    /**
     * Tạo đơn hàng mới.
     * POST /api/Order/checkout
     */
    createOrder = (body) => this.post('api/Order/checkout', body)

    /**
     * Lấy danh sách lịch sử đơn hàng
     * GET /api/Order
     */
    getMyOrders = () => this.get('api/Order')
}

export const orderService = new OrderService()
