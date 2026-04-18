import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminBrandService } from '../../../services/admin/AdminBrandService'

export const fetchAdminBrandsThunk = createAsyncThunk(
    'adminBrand/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminBrandService.getAll()
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải thương hiệu')
        }
    }
)

export const createAdminBrandThunk = createAsyncThunk(
    'adminBrand/create',
    async (data, { rejectWithValue }) => {
        try {
            const res = await adminBrandService.create(data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi thêm thương hiệu')
        }
    }
)

export const updateAdminBrandThunk = createAsyncThunk(
    'adminBrand/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await adminBrandService.update(id, data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật thương hiệu')
        }
    }
)
