import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminInventoryService } from '../../../services/admin/AdminInventoryService'

export const fetchAdminInventoryThunk = createAsyncThunk(
    'adminInventory/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const res = await adminInventoryService.getAll(params)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải tồn kho')
        }
    }
)

export const updateAdminInventoryThunk = createAsyncThunk(
    'adminInventory/update',
    async ({ productId, ...data }, { rejectWithValue }) => {
        try {
            const res = await adminInventoryService.update(productId, data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật tồn kho')
        }
    }
)
