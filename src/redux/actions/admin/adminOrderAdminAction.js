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

export const fetchAdminOrderByIdThunk = createAsyncThunk(
    'adminOrderAdmin/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await adminOrderAdminService.getById(id)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải chi tiết đơn hàng')
        }
    }
)

export const updateAdminOrderThunk = createAsyncThunk(
    'adminOrderAdmin/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await adminOrderAdminService.update(id, data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật đơn hàng')
        }
    }
)

export const deleteAdminOrderThunk = createAsyncThunk(
    'adminOrderAdmin/delete',
    async (id, { rejectWithValue }) => {
        try {
            await adminOrderAdminService.remove(id)
            return id
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi xóa đơn hàng')
        }
    }
)
