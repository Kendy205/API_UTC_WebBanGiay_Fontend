import { createAsyncThunk } from '@reduxjs/toolkit'
import { orderService } from '../../../services/user/OrderService'
import { fetchCartThunk } from './cartAction'

/**
 * addAddressThunk
 */
export const addAddressThunk = createAsyncThunk(
    'order/addAddress',
    async (addressData, { dispatch, rejectWithValue }) => {
        try {
            const response = await orderService.addAddress(addressData)
            // Re-fetch sau khi thêm thành công
            dispatch(fetchAddressesThunk())
            return response.data?.data ?? response.data
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ??
                error.message ??
                'Không thể thêm địa chỉ.'
            )
        }
    }
)

/**
 * fetchAddressesThunk
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
 */
export const createOrderThunk = createAsyncThunk(
    'order/createOrder',
    async (orderData, { dispatch, rejectWithValue }) => {
        try {
            const response = await orderService.createOrder(orderData)
            dispatch(fetchCartThunk())
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

/**
 * payVnpayThunk
 * Gọi sau khi tạo đơn hàng thành công với phương thức bank_transfer.
 * Backend trả về paymentUrl → redirect trình duyệt sang VNPay.
 */
export const payVnpayThunk = createAsyncThunk(
    'order/payVnpay',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await orderService.payVnpay(orderId)
            const data = response.data?.data ?? response.data
            // data có thể là string URL hoặc object { paymentUrl }
            const paymentUrl =
                typeof data === 'string'
                    ? data
                    : data?.paymentUrl ?? data?.url ?? null

            if (!paymentUrl) {
                return rejectWithValue('Không nhận được link thanh toán từ server.')
            }

            // Redirect trình duyệt sang trang thanh toán VNPay
            window.location.href = paymentUrl
            return paymentUrl
        } catch (error) {
            const msg =
                error?.response?.data?.message ??
                error?.response?.data ??
                'Không thể tạo link thanh toán VNPay.'
            return rejectWithValue(typeof msg === 'string' ? msg : JSON.stringify(msg))
        }
    }
)

/**
 * fetchMyOrdersThunk
 */
export const fetchMyOrdersThunk = createAsyncThunk(
    'order/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderService.getMyOrders()
            const data = response.data?.data ?? response.data ?? []
            return Array.isArray(data) ? data : []
        } catch (error) {
            const msg =
                error?.response?.data?.message ??
                error?.response?.data ??
                'Không thể tải lịch sử đơn hàng.'
            return rejectWithValue(typeof msg === 'string' ? msg : JSON.stringify(msg))
        }
    }
)

/**
 * cancelOrderThunk
 */
export const cancelOrderThunk = createAsyncThunk(
    'order/cancelOrder',
    async ({ orderId }, { dispatch, rejectWithValue }) => {
        try {
            const response = await orderService.cancelOrder(orderId)
            dispatch(fetchMyOrdersThunk())
            return response.data?.data ?? response.data
        } catch (error) {
            const msg =
                error?.response?.data?.message ??
                error?.response?.data ??
                'Không thể hủy đơn hàng.'
            return rejectWithValue(typeof msg === 'string' ? msg : JSON.stringify(msg))
        }
    }
)
