import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminReviewsThunk,
    updateAdminReviewVisibilityThunk,
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
                s.items = a.payload.reviews ?? a.payload.data ?? a.payload
                s.total = a.payload.totalItems ?? a.payload.total ?? s.items.length
            })
            .addCase(fetchAdminReviewsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(updateAdminReviewVisibilityThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.id === a.payload.id)
                if (idx !== -1) s.items[idx].isPublic = a.payload.isPublic
            })
    },
})

export default adminReviewAdminSlice.reducer
