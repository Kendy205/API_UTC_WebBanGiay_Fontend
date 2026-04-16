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
