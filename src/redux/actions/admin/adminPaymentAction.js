import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminPaymentService } from '../../../services/admin/AdminPaymentService'

export const fetchAdminPaymentsThunk = createAsyncThunk(
    'adminPayment/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const res = await adminPaymentService.getAll(params)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải thanh toán')
        }
    }
)
