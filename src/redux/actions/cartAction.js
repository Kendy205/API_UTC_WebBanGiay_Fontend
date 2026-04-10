import { createAsyncThunk } from '@reduxjs/toolkit'
import { cartService } from '../../services/CartService'

/**
 * Lấy danh sách giỏ hàng
 */
export const fetchCartThunk = createAsyncThunk(
    'cart/fetchCartThunk',
    async (_, { rejectWithValue }) => {
        try {
            const res = await cartService.getMyCart()
            const body = res?.data ?? res
            const items = body?.data?.items ?? body ?? []
            return Array.isArray(items) ? items : []
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message ?? error.message)
        }
    }
)

/**
 * Thêm sản phẩm vào giỏ hàng
 */
export const addToCartThunk = createAsyncThunk(
    'cart/addToCartThunk',
    async (product, { dispatch, rejectWithValue }) => {
        try {
            const res = await cartService.addItem({
                variantId: product.variantId,
                quantity: product.quantity ?? 1,
            })
            // API trả về giỏ hàng mới sau khi thêm
            return res.data?.data?.items ?? []
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message ?? error.message)
        }
    }
)

/**
 * Cập nhật số lượng sản phẩm
 */
export const updateItemQuantityThunk = createAsyncThunk(
    'cart/updateItemQuantityThunk',
    async ({ cartItemId, quantity }, { rejectWithValue }) => {
        try {
            const res = await cartService.updateItem(cartItemId, quantity)
            // Trả về trực tiếp mảng items mới
            return res.data?.data?.items ?? []
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message ?? error.message)
        }
    }
)

/**
 * Xoá một sản phẩm khỏi giỏ hàng
 */
export const removeItemThunk = createAsyncThunk(
    'cart/removeItemThunk',
    async (variantId, { dispatch, rejectWithValue }) => {
        try {
            const res = await cartService.removeItem(variantId)
            // Trả về trực tiếp mảng items mới
            return res.data?.data?.items ?? []
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message ?? error.message)
        }
    }
)

/**
 * Xoá toàn bộ giỏ hàng
 * (Ghi chú: Nếu backend chưa có api xóa toàn bộ, ta gọi remove từng item)
 */
export const clearCartThunk = createAsyncThunk(
    'cart/clearCartThunk',
    async (_, { getState, dispatch, rejectWithValue }) => {
        try {
            //const items = getState().cart.items || []
            // Chạy song song tất cả các request xóa
            const res = await cartService.clearCart()
            // Xóa tất cả nên trả về mảng rỗng
            return res.data?.data?.items ?? []
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message ?? error.message)
        }
    }
)
