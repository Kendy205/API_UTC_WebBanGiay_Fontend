import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminStaffService } from '../../../services/admin/AdminStaffService'

export const fetchAdminStaffThunk = createAsyncThunk(
    'adminStaff/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminStaffService.getAll()
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải nhân viên')
        }
    }
)

export const createAdminStaffThunk = createAsyncThunk(
    'adminStaff/create',
    async (data, { rejectWithValue }) => {
        try {
            const res = await adminStaffService.create(data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tạo nhân viên')
        }
    }
)

export const updateAdminStaffThunk = createAsyncThunk(
    'adminStaff/update',
    async ({ id, ...data }, { rejectWithValue }) => {
        try {
            const res = await adminStaffService.update(id, data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật nhân viên')
        }
    }
)

export const deleteAdminStaffThunk = createAsyncThunk(
    'adminStaff/delete',
    async (id, { rejectWithValue }) => {
        try {
            await adminStaffService.remove(id)
            return id
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi xóa nhân viên')
        }
    }
)
