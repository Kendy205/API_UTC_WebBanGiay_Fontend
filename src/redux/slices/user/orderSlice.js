import { createSlice } from '@reduxjs/toolkit'
import { fetchAddressesThunk, addAddressThunk, createOrderThunk, fetchMyOrdersThunk, cancelOrderThunk, payVnpayThunk } from '../../actions/user/orderAction'

const initialState = {
    // Danh sách địa chỉ
    addresses: [],
    addressLoading: false,
    addressError: null,

    // Thêm địa chỉ
    addingAddress: false,
    addAddressError: null,

    // Trạng thái tạo đơn hàng
    submitting: false,
    orderError: null,
    orderSuccess: false,
    createdOrder: null,

    // Lịch sử đơn hàng
    myOrders: [],
    loadingOrders: false,
    myOrdersError: null,
    
    // Hủy đơn hàng
    cancellingOrder: false,
    cancelOrderError: null,

    // Thanh toán VNPay
    vnpayLoading: false,
    vnpayError: null,
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.submitting = false
            state.orderError = null
            state.orderSuccess = false
            state.createdOrder = null
        },
    },
    extraReducers: (builder) => {
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

        builder
            .addCase(addAddressThunk.pending, (state) => {
                state.addingAddress = true
                state.addAddressError = null
            })
            .addCase(addAddressThunk.fulfilled, (state) => {
                state.addingAddress = false
            })
            .addCase(addAddressThunk.rejected, (state, action) => {
                state.addingAddress = false
                state.addAddressError = action.payload ?? 'Không thể thêm địa chỉ.'
            })

        builder
            .addCase(createOrderThunk.pending, (state) => {
                state.submitting = true
                state.orderError = null
                state.orderSuccess = false
            })
            .addCase(createOrderThunk.fulfilled, (state, action) => {
                state.submitting = false
                state.orderSuccess = true
                console.log(action.payload)
                state.createdOrder = action.payload ?? null
            })
            .addCase(createOrderThunk.rejected, (state, action) => {
                state.submitting = false
                state.orderError = action.payload ?? 'Đặt hàng thất bại.'
            })

        builder
            .addCase(fetchMyOrdersThunk.pending, (state) => {
                state.loadingOrders = true
                state.myOrdersError = null
            })
            .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
                state.loadingOrders = false
                state.myOrders = action.payload
            })
            .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
                state.loadingOrders = false
                state.myOrdersError = action.payload ?? 'Không thể tải lịch sử đơn hàng.'
            })

        builder
            .addCase(cancelOrderThunk.pending, (state) => {
                state.cancellingOrder = true
                state.cancelOrderError = null
            })
            .addCase(cancelOrderThunk.fulfilled, (state) => {
                state.cancellingOrder = false
            })
            .addCase(cancelOrderThunk.rejected, (state, action) => {
                state.cancellingOrder = false
                state.cancelOrderError = action.payload ?? 'Không thể hủy đơn hàng.'
            })

        builder
            .addCase(payVnpayThunk.pending, (state) => {
                state.vnpayLoading = true
                state.vnpayError = null
            })
            .addCase(payVnpayThunk.fulfilled, (state) => {
                state.vnpayLoading = false
            })
            .addCase(payVnpayThunk.rejected, (state, action) => {
                state.vnpayLoading = false
                state.vnpayError = action.payload ?? 'Không thể tạo link thanh toán VNPay.'
            })
    },
})

export const { resetOrderState } = orderSlice.actions
export default orderSlice.reducer
