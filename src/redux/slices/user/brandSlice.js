import { createSlice } from '@reduxjs/toolkit'
import { fetchBrandsThunk } from '../../actions/user/brandAction'

const brandSlice = createSlice({
    name: 'brand',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBrandsThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBrandsThunk.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchBrandsThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export default brandSlice.reducer
