import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminAnalyticsOverviewThunk,
    fetchAdminRevenueChartThunk,
    fetchDashboardSummaryThunk,
    fetchOrderStatusDistributionThunk
} from '../../actions/admin/adminAnalyticsAction'

const adminAnalyticsSlice = createSlice({
    name: 'adminAnalytics',
    initialState: {
        overview: null,
        dashboardSummary: null,
        statusDistribution: [],
        revenueChart: [],
        loading: false,
        summaryLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminAnalyticsOverviewThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminAnalyticsOverviewThunk.fulfilled, (s, a) => { s.loading = false; s.ov = a.payload })
            .addCase(fetchAdminAnalyticsOverviewThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(fetchOrderStatusDistributionThunk.fulfilled, (s, a) => { s.statusDistribution = a.payload })
            .addCase(fetchAdminRevenueChartThunk.fulfilled, (s, a) => { s.revenueChart = a.payload })
            .addCase(fetchDashboardSummaryThunk.pending, (s) => { s.summaryLoading = true })
            .addCase(fetchDashboardSummaryThunk.fulfilled, (s, a) => { s.summaryLoading = false; s.dashboardSummary = a.payload })
            .addCase(fetchDashboardSummaryThunk.rejected, (s) => { s.summaryLoading = false })
    },
})

export default adminAnalyticsSlice.reducer
