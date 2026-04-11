import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminCategoryService } from '../../../services/admin/AdminCategoryService'

export const fetchAdminCategoriesThunk = createAsyncThunk(
    'adminCategory/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminCategoryService.getAll()
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải danh mục')
        }
    }
)

export const createAdminCategoryThunk = createAsyncThunk(
    'adminCategory/create',
    async (data, { rejectWithValue }) => {
        try {
            const res = await adminCategoryService.create(data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tạo danh mục')
        }
    }
)

export const updateAdminCategoryThunk = createAsyncThunk(
    'adminCategory/update',
    async ({ id, ...data }, { rejectWithValue }) => {
        try {
            const res = await adminCategoryService.update(id, data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật danh mục')
        }
    }
)

export const deleteAdminCategoryThunk = createAsyncThunk(
    'adminCategory/delete',
    async (id, { rejectWithValue }) => {
        try {
            await adminCategoryService.remove(id)
            return id
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi xóa danh mục')
        }
    }
)
