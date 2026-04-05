import { createSlice } from '@reduxjs/toolkit';
import { getProducts,getProductById } from '../actions/ProductAction';
const initialState = {
    products: [],
    error: null,
}

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.error = null;
            }
            )
            .addCase(getProducts.fulfilled, (state, action) => {
                state.products = action.payload.data;
                //console.log('Danh sách sản phẩm đã được cập nhật:', state.products)
            }
            )
            .addCase(getProducts.rejected, (state, action) => {
                state.error = action.payload || 'Không tải được danh sách sản phẩm'
            }
            )
    }
})


export default productSlice.reducer

