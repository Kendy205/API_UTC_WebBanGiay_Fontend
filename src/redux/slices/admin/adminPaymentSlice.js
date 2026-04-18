import { createSlice } from '@reduxjs/toolkit'
import { fetchAdminPaymentsThunk } from '../../actions/admin/adminPaymentAction'

const adminPaymentSlice = createSlice({
    name: 'adminPayment',
    initialState: { items: [], total: 0, page: 1, pageSize: 10, totalPages: 1, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminPaymentsThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminPaymentsThunk.fulfilled, (s, a) => {
                s.loading = false
                const p = a.payload || {}
                s.items = p.data ?? (Array.isArray(p) ? p : [])
                s.total = p.total ?? s.items.length
                s.page = p.page ?? s.page
                s.pageSize = p.pageSize ?? s.pageSize
                s.totalPages = p.totalPages ?? (Math.ceil(s.total / s.pageSize) || 1)
            })
            .addCase(fetchAdminPaymentsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
    },
})

export default adminPaymentSlice.reducer
