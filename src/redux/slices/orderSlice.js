import { createSlice } from '@reduxjs/toolkit'
import { fetchAddressesThunk, createOrderThunk } from '../actions/orderAction'

const initialState = {
    // Danh sách địa chỉ
    addresses: [],
    addressLoading: false,
    addressError: null,

    // Trạng thái tạo đơn hàng
    submitting: false,
    orderError: null,
    orderSuccess: false,
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        /** Reset toàn bộ state order (dùng khi rời khỏi trang order) */
        resetOrderState: (state) => {
            state.submitting = false
            state.orderError = null
            state.orderSuccess = false
        },
    },
    extraReducers: (builder) => {
        // ── fetchAddressesThunk ──────────────────────────────────
        builder
            .addCase(fetchAddressesThunk.pending, (state) => {
                state.addressLoading = true
                state.addressError = null
            })
            .addCase(fetchAddressesThunk.fulfilled, (state, action) => {
                state.addressLoading = false
                state.addresses = action.payload
            })
            .addCase(fetchAddressesThunk.rejected, (state, action) => {
                state.addressLoading = false
                state.addressError = action.payload ?? 'Không thể tải địa chỉ.'
            })

        // ── createOrderThunk ─────────────────────────────────────
        builder
            .addCase(createOrderThunk.pending, (state) => {
                state.submitting = true
                state.orderError = null
                state.orderSuccess = false
            })
            .addCase(createOrderThunk.fulfilled, (state) => {
                state.submitting = false
                state.orderSuccess = true
            })
            .addCase(createOrderThunk.rejected, (state, action) => {
                state.submitting = false
                state.orderError = action.payload ?? 'Đặt hàng thất bại.'
            })
    },
})

export const { resetOrderState } = orderSlice.actions
export default orderSlice.reducer
