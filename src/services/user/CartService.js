import { BaseServices } from '../BaseService'

export class CartService extends BaseServices {
    /**
     * Lấy giỏ hàng hiện tại của user đang đăng nhập.
     * GET /api/Cart
     */
    getMyCart = () => this.get('api/Cart/mycart', { __skipGlobalLoading: true })

    /**
     * Thêm 1 item vào giỏ hàng trên server.
     * POST /api/Cart/items
     * body: { variantId, quantity }
     */
    addItem = (body) => this.post('api/Cart/addcart', body, { __skipGlobalLoading: true })

    /**
     * Xóa 1 item khỏi giỏ hàng trên server.
     * DELETE /api/Cart/items/:variantId
     */
    removeItem = (cartItemId) => this.delete(`api/Cart/items/${cartItemId}`, { __skipGlobalLoading: true })

    /**
     * Xóa tất cả item khỏi giỏ hàng trên server.
     * DELETE /api/Cart/items
     */
    clearCart = () => this.delete('api/Cart/items', { __skipGlobalLoading: true })

    /** 
     * Cập nhật số lượng 1 item trên server.
     * PUT /api/Cart/items/:variantId
     * body: { quantity }
     */
    updateItem = (cartItemId, quantity) =>
        this.put(`api/Cart/items/${cartItemId}`, { quantity }, { __skipGlobalLoading: true })

    /**
     * Đồng bộ toàn bộ giỏ hàng (dùng khi login, merge guest cart → server).
     * POST /api/Cart/sync
     * body: { items: [{ variantId, quantity }] }
     */
    syncCart = (items) => this.post('api/Cart/sync', { items }, { __skipGlobalLoading: true })
}

export const cartService = new CartService()
