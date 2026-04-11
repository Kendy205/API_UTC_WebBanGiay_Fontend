import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/ProductSlices'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/orderSlice'
import reviewReducer from './slices/reviewSlice'

// Admin reducers
import adminProductReducer from './slices/admin/adminProductSlice'
import adminCategoryReducer from './slices/admin/adminCategorySlice'
import adminOrderAdminReducer from './slices/admin/adminOrderAdminSlice'
import adminCustomerReducer from './slices/admin/adminCustomerSlice'
import adminPromotionReducer from './slices/admin/adminPromotionSlice'
import adminInventoryReducer from './slices/admin/adminInventorySlice'
import adminPaymentReducer from './slices/admin/adminPaymentSlice'
import adminRefundReducer from './slices/admin/adminRefundSlice'
import adminReviewAdminReducer from './slices/admin/adminReviewAdminSlice'
import adminAnalyticsReducer from './slices/admin/adminAnalyticsSlice'
import adminSettingReducer from './slices/admin/adminSettingSlice'

export const store = configureStore({
    reducer: {
        product: productReducer,
        auth: authReducer,
        ui: uiReducer,
        cart: cartReducer,
        order: orderReducer,
        review: reviewReducer,
        // Admin
        adminProduct: adminProductReducer,
        adminCategory: adminCategoryReducer,
        adminOrderAdmin: adminOrderAdminReducer,
        adminCustomer: adminCustomerReducer,
        adminPromotion: adminPromotionReducer,
        adminInventory: adminInventoryReducer,
        adminPayment: adminPaymentReducer,
        adminRefund: adminRefundReducer,
        adminReviewAdmin: adminReviewAdminReducer,
        adminAnalytics: adminAnalyticsReducer,
        adminSetting: adminSettingReducer,
    },
})