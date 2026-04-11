import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminProductsThunk,
    createAdminProductThunk,
    updateAdminProductThunk,
    deleteAdminProductThunk,
} from '../../actions/admin/adminProductAction'

const adminProductSlice = createSlice({
    name: 'adminProduct',
    initialState: {
        items: [],
        total: 0,
        page: 1,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProductsThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminProductsThunk.fulfilled, (s, a) => {
                s.loading = false
                s.items = a.payload.data ?? a.payload
                s.total = a.payload.total ?? s.items.length
            })
            .addCase(fetchAdminProductsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(createAdminProductThunk.pending, (s) => { s.loading = true })
            .addCase(createAdminProductThunk.fulfilled, (s, a) => {
                s.loading = false
                s.items.unshift(a.payload)
                s.total += 1
            })
            .addCase(createAdminProductThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(updateAdminProductThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.id === a.payload.id)
                if (idx !== -1) s.items[idx] = a.payload
            })
            .addCase(deleteAdminProductThunk.fulfilled, (s, a) => {
                s.items = s.items.filter((x) => x.id !== a.payload)
                s.total -= 1
            })
    },
})

export default adminProductSlice.reducer
