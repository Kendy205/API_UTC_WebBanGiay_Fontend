import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminProductService } from '../../../services/admin/AdminProductService'

export const fetchAdminProductsThunk = createAsyncThunk(
    'adminProduct/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const res = await adminProductService.getAll(params)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải sản phẩm')
        }
    }
)

export const createAdminProductThunk = createAsyncThunk(
    'adminProduct/create',
    async (data, { rejectWithValue }) => {
        try {
            const res = await adminProductService.create(data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tạo sản phẩm')
        }
    }
)

export const updateAdminProductThunk = createAsyncThunk(
    'adminProduct/update',
    async ({ id, ...data }, { rejectWithValue }) => {
        try {
            const res = await adminProductService.update(id, data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật sản phẩm')
        }
    }
)

export const deleteAdminProductThunk = createAsyncThunk(
    'adminProduct/delete',
    async (id, { rejectWithValue }) => {
        try {
            await adminProductService.remove(id)
            return id
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi xóa sản phẩm')
        }
    }
)
