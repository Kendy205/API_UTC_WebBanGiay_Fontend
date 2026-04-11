import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminOrdersThunk,
    updateAdminOrderStatusThunk,
} from '../../actions/admin/adminOrderAdminAction'

const adminOrderAdminSlice = createSlice({
    name: 'adminOrderAdmin',
    initialState: { items: [], total: 0, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminOrdersThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminOrdersThunk.fulfilled, (s, a) => {
                s.loading = false
                s.items = a.payload.data ?? a.payload
                s.total = a.payload.total ?? s.items.length
            })
            .addCase(fetchAdminOrdersThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(updateAdminOrderStatusThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.id === a.payload.id)
                if (idx !== -1) s.items[idx].status = a.payload.status
            })
    },
})

export default adminOrderAdminSlice.reducer
