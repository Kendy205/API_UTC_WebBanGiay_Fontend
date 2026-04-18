import { createSlice } from '@reduxjs/toolkit';
import { getProducts, getProductById, filterProductsThunk } from '../../actions/user/ProductAction';

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
        // Handle common fulfillment logic
        const handleFulfilled = (state, action) => {
            const inner = action.payload?.data;
            state.products = inner?.data ?? [];
            state.total = inner?.total ?? 0;
            state.totalPages = inner?.pageSize > 0
                ? Math.ceil(inner.total / inner.pageSize)
                : 1;
        };

        builder
            .addCase(getProducts.pending, (state) => {
                state.error = null;
            })
            .addCase(getProducts.fulfilled, handleFulfilled)
            .addCase(getProducts.rejected, (state, action) => {
                state.error = action.payload || 'Không tải được danh sách sản phẩm';
            })
            .addCase(filterProductsThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(filterProductsThunk.fulfilled, handleFulfilled)
            .addCase(filterProductsThunk.rejected, (state, action) => {
                state.error = action.payload || 'Không tìm thấy sản phẩm theo bộ lọc';
            })
    }
})

export default productSlice.reducer
