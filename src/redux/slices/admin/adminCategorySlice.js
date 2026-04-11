import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminCategoriesThunk,
    createAdminCategoryThunk,
    updateAdminCategoryThunk,
    deleteAdminCategoryThunk,
} from '../../actions/admin/adminCategoryAction'

const adminCategorySlice = createSlice({
    name: 'adminCategory',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminCategoriesThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminCategoriesThunk.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
            .addCase(fetchAdminCategoriesThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(createAdminCategoryThunk.fulfilled, (s, a) => { s.items.push(a.payload) })
            .addCase(updateAdminCategoryThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.id === a.payload.id)
                if (idx !== -1) s.items[idx] = a.payload
            })
            .addCase(deleteAdminCategoryThunk.fulfilled, (s, a) => {
                s.items = s.items.filter((x) => x.id !== a.payload)
            })
    },
})

export default adminCategorySlice.reducer
