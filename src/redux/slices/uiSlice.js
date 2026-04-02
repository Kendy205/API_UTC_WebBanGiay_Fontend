import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    /**
     * Đếm số request đang chạy để tránh nhấp nháy khi có nhiều request song song.
     */
    loadingCount: 0,
    /**
     * Loading riêng cho thao tác điều hướng (click Link/button hoặc gọi navigate()).
     * Tự tắt theo timeout để tránh kẹt nếu trang mới không gọi API.
     */
    routeLoadingCount: 0,
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        startGlobalLoading: (state) => {
            state.loadingCount += 1
        },
        stopGlobalLoading: (state) => {
            state.loadingCount = Math.max(0, state.loadingCount - 1)
        },
        startRouteLoading: (state) => {
            state.routeLoadingCount += 1
        },
        stopRouteLoading: (state) => {
            state.routeLoadingCount = Math.max(0, state.routeLoadingCount - 1)
        },
        /**
         * Dùng cho debug/test: set trực tiếp loadingCount.
         * Không nên dùng trong production code.
         */
        setLoadingCount: (state, action) => {
            state.loadingCount = Math.max(0, Number(action.payload) || 0)
        },
    },
})

export const {
    startGlobalLoading,
    stopGlobalLoading,
    startRouteLoading,
    stopRouteLoading,
    setLoadingCount,
} = uiSlice.actions

export default uiSlice.reducer

