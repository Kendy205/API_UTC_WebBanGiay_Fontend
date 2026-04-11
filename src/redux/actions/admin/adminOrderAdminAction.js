import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminOrderAdminService } from '../../../services/admin/AdminOrderAdminService'

export const fetchAdminOrdersThunk = createAsyncThunk(
    'adminOrderAdmin/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const res = await adminOrderAdminService.getAll(params)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải đơn hàng')
        }
    }
)

export const updateAdminOrderStatusThunk = createAsyncThunk(
    'adminOrderAdmin/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await adminOrderAdminService.updateStatus(id, status)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật trạng thái')
        }
    }
)
