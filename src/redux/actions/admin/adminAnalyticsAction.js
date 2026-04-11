import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminAnalyticsService } from '../../../services/admin/AdminAnalyticsService'

export const fetchAdminAnalyticsOverviewThunk = createAsyncThunk(
    'adminAnalytics/fetchOverview',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminAnalyticsService.getOverview()
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải analytics')
        }
    }
)

export const fetchAdminRevenueChartThunk = createAsyncThunk(
    'adminAnalytics/fetchRevenueChart',
    async (params, { rejectWithValue }) => {
        try {
            const res = await adminAnalyticsService.getRevenueChart(params)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải biểu đồ doanh thu')
        }
    }
)
