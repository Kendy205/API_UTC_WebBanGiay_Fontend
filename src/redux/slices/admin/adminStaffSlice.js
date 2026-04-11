import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminStaffThunk,
    createAdminStaffThunk,
    updateAdminStaffThunk,
    deleteAdminStaffThunk,
} from '../../actions/admin/adminStaffAction'

const adminStaffSlice = createSlice({
    name: 'adminStaff',
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminStaffThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminStaffThunk.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
            .addCase(fetchAdminStaffThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(createAdminStaffThunk.fulfilled, (s, a) => { s.items.push(a.payload) })
            .addCase(updateAdminStaffThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.id === a.payload.id)
                if (idx !== -1) s.items[idx] = a.payload
            })
            .addCase(deleteAdminStaffThunk.fulfilled, (s, a) => {
                s.items = s.items.filter((x) => x.id !== a.payload)
            })
    },
})

export default adminStaffSlice.reducer
