import { createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../../services/user/ProductService";

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
        try {
            const response = await productService.getProducts({ page, pageSize });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch products');
        }
    }
)
export const getProductById = createAsyncThunk(
    'product',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await productService.getProductById(productId);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch product variants');
        }
    }
)

export const filterProductsThunk = createAsyncThunk(
    'products/filterProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await productService.filterProducts(params);
            // response.data is ApiResponse<IEnumerable<ProductDto>>
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Lỗi tìm kiếm sản phẩm');
        }
    }
)
   