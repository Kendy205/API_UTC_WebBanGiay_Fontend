import { createAsyncThunk } from '@reduxjs/toolkit'
import { orderService } from '../../services/OrderService'
import { clearCart } from '../slices/cartSlice'

/**
 * fetchAddressesThunk
 * Lấy danh sách địa chỉ của user hiện tại.
 * GET /api/Address
 */
export const fetchAddressesThunk = createAsyncThunk(
    'order/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderService.getMyAddresses()
            const data = response.data?.data ?? response.data ?? []
            return Array.isArray(data) ? data : []
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ??
                error.message ??
                'Không thể tải danh sách địa chỉ.'
            )
        }
    }
)

/**
 * createOrderThunk
 * Tạo đơn hàng mới, sau khi thành công xóa giỏ hàng.
 * POST /api/Order
 * body: { addressId, paymentMethod, items: [{ variantId, quantity }] }
 */
export const createOrderThunk = createAsyncThunk(
    'order/createOrder',
    async (orderData, { dispatch, rejectWithValue }) => {
        try {
            const response = await orderService.createOrder(orderData)
            // Xóa giỏ hàng sau khi đặt hàng thành công
            dispatch(clearCart())
            return response.data?.data ?? response.data
        } catch (error) {
            const msg =
                error?.response?.data?.message ??
                error?.response?.data ??
                'Đặt hàng thất bại. Vui lòng thử lại.'
            return rejectWithValue(typeof msg === 'string' ? msg : JSON.stringify(msg))
        }
    }
)
