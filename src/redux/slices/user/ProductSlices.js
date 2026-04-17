import { createSlice } from '@reduxjs/toolkit';
import { getProducts, getProductById } from '../../actions/user/ProductAction';

const initialState = {
    products: [],
    totalPages: 1,
    total: 0,
    error: null,
}

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                // action.payload = ApiResponse { success, data: { data:[], total, page, pageSize } }
                const inner = action.payload?.data;
                state.products = inner?.data ?? [];
                state.total = inner?.total ?? 0;
                state.totalPages = inner?.pageSize > 0
                    ? Math.ceil(inner.total / inner.pageSize)
                    : 1;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.error = action.payload || 'Không tải được danh sách sản phẩm';
            })
    }
})

export default productSlice.reducer
