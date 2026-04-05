import { createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/ProductService";

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async (_, { rejectWithValue }) => {
        try {
            // Gọi API để lấy danh sách sản phẩm
            const response = await productService.getProducts();
            
            return response.data; // Trả về dữ liệu sản phẩm
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

   