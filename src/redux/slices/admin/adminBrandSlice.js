import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminBrandsThunk,
    createAdminBrandThunk,
    updateAdminBrandThunk,
} from '../../actions/admin/adminBrandAction'

const adminBrandSlice = createSlice({
    name: 'adminBrand',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminBrandsThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminBrandsThunk.fulfilled, (s, a) => {
                s.loading = false
                s.items = a.payload
            })
            .addCase(fetchAdminBrandsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(createAdminBrandThunk.fulfilled, (s, a) => {
                if (a.payload) s.items.unshift(a.payload)
            })
            .addCase(updateAdminBrandThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex(x => x.brandId === a.payload?.brandId)
                if (idx !== -1) s.items[idx] = a.payload
            })
    },
})

export default adminBrandSlice.reducer
