import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminPromotionService } from '../../../services/admin/AdminPromotionService'

export const fetchAdminPromotionsThunk = createAsyncThunk(
    'adminPromotion/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminPromotionService.getAll()
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải khuyến mãi')
        }
    }
)

export const createAdminPromotionThunk = createAsyncThunk(
    'adminPromotion/create',
    async (data, { rejectWithValue }) => {
        try {
            const res = await adminPromotionService.create(data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tạo khuyến mãi')
        }
    }
)

export const updateAdminPromotionThunk = createAsyncThunk(
    'adminPromotion/update',
    async ({ id, ...data }, { rejectWithValue }) => {
        try {
            const res = await adminPromotionService.update(id, data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật khuyến mãi')
        }
    }
)

export const deleteAdminPromotionThunk = createAsyncThunk(
    'adminPromotion/delete',
    async (id, { rejectWithValue }) => {
        try {
            await adminPromotionService.remove(id)
            return id
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi xóa khuyến mãi')
        }
    }
)
