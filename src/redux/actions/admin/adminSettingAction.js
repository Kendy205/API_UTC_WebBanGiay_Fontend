import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminSettingService } from '../../../services/admin/AdminSettingService'

export const fetchAdminSettingsThunk = createAsyncThunk(
    'adminSetting/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminSettingService.get()
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải cài đặt')
        }
    }
)

export const updateAdminSettingsThunk = createAsyncThunk(
    'adminSetting/update',
    async (data, { rejectWithValue }) => {
        try {
            const res = await adminSettingService.update(data)
            return res.data?.data ?? data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi lưu cài đặt')
        }
    }
)
