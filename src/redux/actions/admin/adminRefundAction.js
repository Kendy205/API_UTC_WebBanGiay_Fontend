// import { createAsyncThunk } from '@reduxjs/toolkit'
// import { adminRefundService } from '../../../services/admin/AdminRefundService'

// export const fetchAdminRefundsThunk = createAsyncThunk(
//     'adminRefund/fetchAll',
//     async (params, { rejectWithValue }) => {
//         try {
//             const res = await adminRefundService.getAll(params)
//             return res.data?.data ?? res.data
//         } catch (e) {
//             return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải hoàn trả')
//         }
//     }
// )

// export const updateAdminRefundStatusThunk = createAsyncThunk(
//     'adminRefund/updateStatus',
//     async ({ id, status }, { rejectWithValue }) => {
//         try {
//             const res = await adminRefundService.updateStatus(id, status)
//             return res.data?.data ?? res.data
//         } catch (e) {
//             return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật hoàn trả')
//         }
//     }
// )
