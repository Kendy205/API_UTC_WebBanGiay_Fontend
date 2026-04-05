import { createSlice } from '@reduxjs/toolkit'
import {
    fetchCartThunk,
    addToCartThunk,
    updateItemQuantityThunk,
    removeItemThunk,
    clearCartThunk,
} from '../actions/cartAction'

const initialState = {
    items: [],
    loading: false, // loading cho quá trình fetch nguyên giỏ hàng
    actionLoading: false, // loading cho thao tác thêm, sửa, xoá
    error: null,
}

const handleActionPending = (state) => {
    state.actionLoading = true
    state.error = null
}
const handleActionFulfilled = (state, action) => {
    state.actionLoading = false
    state.error = null
    if (Array.isArray(action.payload)) {
        state.items = action.payload
    }
}
const handleActionRejected = (state, action) => {
    state.actionLoading = false
    state.error = action.payload ?? action.error?.message ?? 'Đã có lỗi xảy ra'
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartLocal: (state) => {
            state.items = []
        },
    },
    extraReducers: (builder) => {
        // Fetch cart
        builder.addCase(fetchCartThunk.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchCartThunk.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload ?? []
            state.error = null
        })
        builder.addCase(fetchCartThunk.rejected, (state, action) => {
            state.loading = false
            state.error =
                action.payload ?? action.error?.message ?? 'Lỗi tải giỏ hàng'
        })

        // Thay đổi liên quan tới item
        builder
            .addCase(addToCartThunk.pending, handleActionPending)
            .addCase(addToCartThunk.fulfilled, handleActionFulfilled)
            .addCase(addToCartThunk.rejected, handleActionRejected)

            .addCase(updateItemQuantityThunk.pending, handleActionPending)
            .addCase(updateItemQuantityThunk.fulfilled, handleActionFulfilled)
            .addCase(updateItemQuantityThunk.rejected, handleActionRejected)

            .addCase(removeItemThunk.pending, handleActionPending)
            .addCase(removeItemThunk.fulfilled, handleActionFulfilled)
            .addCase(removeItemThunk.rejected, handleActionRejected)

            .addCase(clearCartThunk.pending, handleActionPending)
            .addCase(clearCartThunk.fulfilled, handleActionFulfilled)
            .addCase(clearCartThunk.rejected, handleActionRejected)
    },
})

export const { clearCartLocal } = cartSlice.actions
export default cartSlice.reducer
