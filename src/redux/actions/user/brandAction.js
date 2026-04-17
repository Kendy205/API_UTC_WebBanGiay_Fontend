import { createAsyncThunk } from '@reduxjs/toolkit'
import { brandService } from '../../../services/user/BrandService'

export const fetchBrandsThunk = createAsyncThunk(
    'brand/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await brandService.getAll()
            // API: { success, data: [ { brandId, brandName, ... } ] }
            return res.data?.data ?? []
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải thương hiệu')
        }
    }
)
