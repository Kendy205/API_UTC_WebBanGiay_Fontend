import { createAsyncThunk } from '@reduxjs/toolkit'
import { reviewService } from '../../services/user/ReviewService'

export const getProductReviewsThunk = createAsyncThunk(
    'review/getProductReviews',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await reviewService.getProductReviews(productId)
            const data = response.data?.data ?? response.data ?? []
            return Array.isArray(data) ? data : []
        } catch (error) {
            const msg =
                error?.response?.data?.message ??
                error?.response?.data ??
                'Không thể tải danh sách đánh giá.'
            return rejectWithValue(typeof msg === 'string' ? msg : JSON.stringify(msg))
        }
    }
)

export const createReviewThunk = createAsyncThunk(
    'review/createReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            const response = await reviewService.createReview(reviewData)
            return response.data?.data ?? response.data
        } catch (error) {
            const msg =
                error?.response?.data?.message ??
                error?.response?.data ??
                'Không thể gửi đánh giá.'
            return rejectWithValue(typeof msg === 'string' ? msg : JSON.stringify(msg))
        }
    }
)
