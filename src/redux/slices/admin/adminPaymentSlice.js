import { createSlice } from '@reduxjs/toolkit'
import { fetchAdminPaymentsThunk } from '../../actions/admin/adminPaymentAction'

const adminPaymentSlice = createSlice({
    name: 'adminPayment',
    initialState: { items: [], total: 0, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminPaymentsThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminPaymentsThunk.fulfilled, (s, a) => {
                s.loading = false
                s.items = a.payload.data ?? a.payload
                s.total = a.payload.total ?? s.items.length
            })
            .addCase(fetchAdminPaymentsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
    },
})

export default adminPaymentSlice.reducer
