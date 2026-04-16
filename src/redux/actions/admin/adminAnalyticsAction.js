import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminAnalyticsService } from '../../../services/admin/AdminAnalyticsService'
import { adminDashboardService } from '../../../services/admin/AdminDashboardService'

export const fetchDashboardSummaryThunk = createAsyncThunk(
    'adminAnalytics/fetchDashboardSummary',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminDashboardService.getSummary()
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải thống kê dashboard')
        }
    }
)

export const fetchAdminAnalyticsOverviewThunk = createAsyncThunk(
    'adminAnalytics/fetchOverview',
    async (year, { rejectWithValue }) => {
        try {
            const res = await adminAnalyticsService.getOverview(year)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải analytics')
        }
    }
)

export const fetchOrderStatusDistributionThunk = createAsyncThunk(
    'adminAnalytics/fetchOrderStatusDistribution',
    async (year, { rejectWithValue }) => {
        try {
            const res = await adminAnalyticsService.getOrderStatusDistribution(year)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải phân bổ trạng thái đơn hàng')
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
