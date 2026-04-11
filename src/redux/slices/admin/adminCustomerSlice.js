import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminCustomersThunk,
    updateAdminCustomerStatusThunk,
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
            .addCase(updateAdminCustomerStatusThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.id === a.payload.id)
                if (idx !== -1) s.items[idx].isActive = a.payload.isActive
            })
    },
})

export default adminCustomerSlice.reducer
