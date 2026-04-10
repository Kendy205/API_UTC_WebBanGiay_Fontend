import { createSlice } from '@reduxjs/toolkit'
import { getProductReviewsThunk, createReviewThunk } from '../actions/reviewAction'

const initialState = {
    // Lấy đánh giá
    reviews: [],
    loadingReviews: false,
    reviewError: null,

    // Gửi đánh giá
    submittingReview: false,
    submitReviewError: null,
    submitReviewSuccess: false,
}

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        resetReviewState: (state) => {
            state.submittingReview = false
            state.submitReviewError = null
            state.submitReviewSuccess = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductReviewsThunk.pending, (state) => {
                state.loadingReviews = true
                state.reviewError = null
            })
            .addCase(getProductReviewsThunk.fulfilled, (state, action) => {
                state.loadingReviews = false
                state.reviews = action.payload
            })
            .addCase(getProductReviewsThunk.rejected, (state, action) => {
                state.loadingReviews = false
                state.reviewError = action.payload ?? 'Không thể tải đánh giá.'
            })

        builder
            .addCase(createReviewThunk.pending, (state) => {
                state.submittingReview = true
                state.submitReviewError = null
                state.submitReviewSuccess = false
            })
            .addCase(createReviewThunk.fulfilled, (state) => {
                state.submittingReview = false
                state.submitReviewSuccess = true
            })
            .addCase(createReviewThunk.rejected, (state, action) => {
                state.submittingReview = false
                state.submitReviewError = action.payload ?? 'Không thể gửi đánh giá.'
            })
    },
})

export const { resetReviewState } = reviewSlice.actions
export default reviewSlice.reducer
