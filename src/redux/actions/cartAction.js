import { createAsyncThunk } from '@reduxjs/toolkit'
import { cartService } from '../../services/CartService'
import { addToCart } from '../slices/cartSlice'

/**
 * addToCartThunk
 *
 * Flow:
 *  1. Kiểm tra isAuthenticated (authSlice) → nếu chưa login thì reject
 *  2. Dispatch addToCart → lưu localStorage ngay (UX nhanh)
 *  3. Gọi API POST /api/Cart/items để đồng bộ lên server
 *     → Nếu API lỗi: chỉ log warning, KHÔNG rollback localStorage
 *       (giỏ hàng vẫn còn, user không mất data)
 */
export const addToCartThunk = createAsyncThunk(
    'cart/addToCartThunk',
    async (product, { getState, dispatch, rejectWithValue }) => {
        const { isAuthenticated } = getState().auth

        // ── Chưa đăng nhập ──────────────────────────────────────────────
        if (!isAuthenticated) {
            return rejectWithValue('Vui lòng đăng nhập để thêm vào giỏ hàng')
        }

        // ── Lưu localStorage ngay (optimistic update) ────────────────────
        dispatch(addToCart(product))

        // ── Đồng bộ lên server (best-effort, không block UX) ─────────────
        try {
            await cartService.addItem({
                variantId: product.variantId,
                quantity: 1,
            })
        } catch (e) {
            // Backend chưa có / lỗi tạm thời → warning, không throw
            console.warn('[CartSync] Không sync được lên server:', e?.response?.data?.message ?? e.message)
        }
    }
)

/**
 * syncCartOnLoginThunk
 *
 * Gọi sau khi user đăng nhập thành công:
 * Lấy toàn bộ items đang trong localStorage → gửi batch lên server.
 * Dùng trong authAction hoặc component sau khi login fulfilled.
 */
export const syncCartOnLoginThunk = createAsyncThunk(
    'cart/syncCartOnLogin',
    async (_, { getState }) => {
        const items = getState().cart.items
        if (!items.length) return

        const payload = items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
        }))

        try {
            await cartService.syncCart(payload)
        } catch (e) {
            console.warn('[CartSync] Sync khi login thất bại:', e?.response?.data?.message ?? e.message)
        }
    }
)

// Re-export các action đồng bộ từ slice để dùng trực tiếp khi cần
export {
    addToCart,
    removeFromCart,
    setQuantity,
    decrement,
    increment,
    clearCart,
    hydrateCart,
} from '../slices/cartSlice'
