import { createSlice } from '@reduxjs/toolkit'
import { fetchAdminBrandsThunk } from '../../actions/admin/adminBrandAction'

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
    },
})

export default adminBrandSlice.reducer
