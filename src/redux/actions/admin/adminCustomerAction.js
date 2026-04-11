import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminCustomerService } from '../../../services/admin/AdminCustomerService'

export const fetchAdminCustomersThunk = createAsyncThunk(
    'adminCustomer/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const res = await adminCustomerService.getAll(params)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải khách hàng')
        }
    }
)

export const updateAdminCustomerStatusThunk = createAsyncThunk(
    'adminCustomer/updateStatus',
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const res = await adminCustomerService.updateStatus(id, isActive)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật trạng thái')
        }
    }
)
