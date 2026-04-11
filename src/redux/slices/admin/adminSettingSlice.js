import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminSettingsThunk,
    updateAdminSettingsThunk,
} from '../../actions/admin/adminSettingAction'

const adminSettingSlice = createSlice({
    name: 'adminSetting',
    initialState: { data: null, loading: false, error: null, saved: false },
    reducers: { resetSaved: (s) => { s.saved = false } },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminSettingsThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminSettingsThunk.fulfilled, (s, a) => { s.loading = false; s.data = a.payload })
            .addCase(fetchAdminSettingsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(updateAdminSettingsThunk.fulfilled, (s, a) => { s.saved = true; s.data = a.payload })
    },
})

export const { resetSaved } = adminSettingSlice.actions
export default adminSettingSlice.reducer
