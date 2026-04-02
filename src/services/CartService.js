import { BaseServices } from './BaseService'

export class CartService extends BaseServices {
    /**
     * Lấy giỏ hàng hiện tại của user đang đăng nhập.
     * GET /api/Cart
     */
    getMyCart = () => this.get('api/Cart')

    /**
     * Thêm 1 item vào giỏ hàng trên server.
     * POST /api/Cart/items
     * body: { variantId, quantity }
     */
    addItem = (body) => this.post('api/Cart/items', body)

    /**
     * Xóa 1 item khỏi giỏ hàng trên server.
     * DELETE /api/Cart/items/:variantId
     */
    removeItem = (variantId) => this.delete(`api/Cart/items/${variantId}`)

    /**
     * Cập nhật số lượng 1 item trên server.
     * PUT /api/Cart/items/:variantId
     * body: { quantity }
     */
    updateItem = (variantId, quantity) =>
        this.put(`api/Cart/items/${variantId}`, { quantity })

    /**
     * Đồng bộ toàn bộ giỏ hàng (dùng khi login, merge guest cart → server).
     * POST /api/Cart/sync
     * body: { items: [{ variantId, quantity }] }
     */
    syncCart = (items) => this.post('api/Cart/sync', { items })
}

export const cartService = new CartService()
