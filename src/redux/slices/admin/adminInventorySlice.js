import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminInventoryThunk,
    updateAdminInventoryThunk,
} from '../../actions/admin/adminInventoryAction'

const adminInventorySlice = createSlice({
    name: 'adminInventory',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminInventoryThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminInventoryThunk.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
            .addCase(fetchAdminInventoryThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(updateAdminInventoryThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.productId === a.payload.productId)
                if (idx !== -1) s.items[idx].stock = a.payload.stock
            })
    },
})

export default adminInventorySlice.reducer
