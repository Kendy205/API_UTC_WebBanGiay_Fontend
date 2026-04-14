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

export const createAdminCustomerThunk = createAsyncThunk(
    'adminCustomer/create',
    async (data, { rejectWithValue }) => {
        try {
            const res = await adminCustomerService.create(data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi thêm khách hàng')
        }
    }
)

export const updateAdminCustomerThunk = createAsyncThunk(
    'adminCustomer/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await adminCustomerService.update(id, data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật khách hàng')
        }
    }
)
