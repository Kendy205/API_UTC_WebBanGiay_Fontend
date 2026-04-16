import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminCustomersThunk,
    createAdminCustomerThunk,
    updateAdminCustomerThunk,
} from '../../actions/admin/adminCustomerAction'

const adminCustomerSlice = createSlice({
    name: 'adminCustomer',
    initialState: { items: [], total: 0, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminCustomersThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminCustomersThunk.fulfilled, (s, a) => {
                s.loading = false
                s.items = a.payload.data ?? a.payload
                s.total = a.payload.total ?? s.items.length
            })
            .addCase(fetchAdminCustomersThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(createAdminCustomerThunk.fulfilled, (s, a) => {
                s.items.unshift(a.payload)
            })
            .addCase(updateAdminCustomerThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.userId === a.payload.userId)
                if (idx !== -1) s.items[idx] = { ...s.items[idx], ...a.payload }
            })
    },
})

export default adminCustomerSlice.reducer
