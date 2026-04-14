import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminAnalyticsOverviewThunk,
    fetchAdminRevenueChartThunk,
} from '../../actions/admin/adminAnalyticsAction'

const adminAnalyticsSlice = createSlice({
    name: 'adminAnalytics',
    initialState: { ov: null, revenueChart: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminAnalyticsOverviewThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminAnalyticsOverviewThunk.fulfilled, (s, a) => { s.loading = false; s.ov = a.payload })
            .addCase(fetchAdminAnalyticsOverviewThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(fetchAdminRevenueChartThunk.fulfilled, (s, a) => { s.revenueChart = a.payload })
    },
})

export default adminAnalyticsSlice.reducer
