import { BaseServices } from './BaseService'

export class OrderService extends BaseServices {
    /**
     * Lấy danh sách địa chỉ của user hiện tại.
     * GET /api/Address
     */
    getMyAddresses = () => this.get('api/Address')

    /**
     * Tạo đơn hàng mới.
     * POST /api/Order
     * body: { addressId, paymentMethod, items: [{ variantId, quantity }] }
     */
    createOrder = (body) => this.post('api/Order', body)
}

export const orderService = new OrderService()
