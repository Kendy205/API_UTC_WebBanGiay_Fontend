import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminReviewAdminService } from '../../../services/admin/AdminReviewAdminService'

export const fetchAdminReviewsThunk = createAsyncThunk(
    'adminReviewAdmin/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const res = await adminReviewAdminService.getAll(params)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải đánh giá')
        }
    }
)

export const updateAdminReviewVisibilityThunk = createAsyncThunk(
    'adminReviewAdmin/updateVisibility',
    async ({ id, isVisible }, { rejectWithValue }) => {
        try {
            const res = await adminReviewAdminService.updateVisibility(id, isVisible)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật hiển thị')
        }
    }
)

export const deleteAdminReviewThunk = createAsyncThunk(
    'adminReviewAdmin/delete',
    async (id, { rejectWithValue }) => {
        try {
            await adminReviewAdminService.remove(id)
            return id
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi xóa đánh giá')
        }
    }
)
