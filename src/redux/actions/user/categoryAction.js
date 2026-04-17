import { createAsyncThunk } from '@reduxjs/toolkit'
import { categoryService } from '../../../services/user/CategoryService'

export const fetchCategoriesThunk = createAsyncThunk(
    'category/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await categoryService.getAll()
            // API: { success, data: [ { categoryId, categoryName, ... } ] }
            return res.data?.data ?? []
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải danh mục')
        }
    }
)
