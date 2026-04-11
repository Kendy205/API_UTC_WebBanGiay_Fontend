import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminReviewsThunk,
    updateAdminReviewVisibilityThunk,
    deleteAdminReviewThunk,
} from '../../actions/admin/adminReviewAdminAction'

const adminReviewAdminSlice = createSlice({
    name: 'adminReviewAdmin',
    initialState: { items: [], total: 0, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminReviewsThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminReviewsThunk.fulfilled, (s, a) => {
                s.loading = false
                s.items = a.payload.data ?? a.payload
                s.total = a.payload.total ?? s.items.length
            })
            .addCase(fetchAdminReviewsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(updateAdminReviewVisibilityThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.id === a.payload.id)
                if (idx !== -1) s.items[idx].isVisible = a.payload.isVisible
            })
            .addCase(deleteAdminReviewThunk.fulfilled, (s, a) => {
                s.items = s.items.filter((x) => x.id !== a.payload)
            })
    },
})

export default adminReviewAdminSlice.reducer
