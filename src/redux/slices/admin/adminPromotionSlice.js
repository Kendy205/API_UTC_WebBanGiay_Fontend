import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminPromotionsThunk,
    createAdminPromotionThunk,
    updateAdminPromotionThunk,
    deleteAdminPromotionThunk,
} from '../../actions/admin/adminPromotionAction'

const adminPromotionSlice = createSlice({
    name: 'adminPromotion',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminPromotionsThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminPromotionsThunk.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
            .addCase(fetchAdminPromotionsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(createAdminPromotionThunk.fulfilled, (s, a) => { s.items.push(a.payload) })
            .addCase(updateAdminPromotionThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.id === a.payload.id)
                if (idx !== -1) s.items[idx] = a.payload
            })
            .addCase(deleteAdminPromotionThunk.fulfilled, (s, a) => {
                s.items = s.items.filter((x) => x.id !== a.payload)
            })
    },
})

export default adminPromotionSlice.reducer
