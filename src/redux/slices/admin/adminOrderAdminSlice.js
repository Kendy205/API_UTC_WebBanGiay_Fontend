import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminOrdersThunk,
    fetchAdminOrderByIdThunk,
    updateAdminOrderThunk,
    deleteAdminOrderThunk,
} from '../../actions/admin/adminOrderAdminAction'

const adminOrderAdminSlice = createSlice({
    name: 'adminOrderAdmin',
    initialState: { items: [], total: 0, selectedItem: null, loading: false, loadingDetail: false, error: null },
    reducers: {
        clearSelectedOrder: (s) => { s.selectedItem = null }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminOrdersThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminOrdersThunk.fulfilled, (s, a) => {
                s.loading = false
                s.items = a.payload.data ?? a.payload
                s.total = a.payload.total ?? s.items.length
            })
            .addCase(fetchAdminOrdersThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(fetchAdminOrderByIdThunk.pending, (s) => { s.loadingDetail = true; s.error = null })
            .addCase(fetchAdminOrderByIdThunk.fulfilled, (s, a) => {
                s.loadingDetail = false
                s.selectedItem = a.payload
            })
            .addCase(fetchAdminOrderByIdThunk.rejected, (s, a) => { s.loadingDetail = false; s.error = a.payload })
            .addCase(updateAdminOrderThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.id === a.payload.id)
                if (idx !== -1) s.items[idx] = { ...s.items[idx], ...a.payload }
            })
            .addCase(deleteAdminOrderThunk.fulfilled, (s, a) => {
                s.items = s.items.filter((x) => x.id !== a.payload)
            })
    },
})

export const { clearSelectedOrder } = adminOrderAdminSlice.actions
export default adminOrderAdminSlice.reducer
