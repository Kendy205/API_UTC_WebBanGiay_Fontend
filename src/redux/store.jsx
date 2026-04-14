import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/user/ProductSlices'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import cartReducer from './slices/user/cartSlice'
import orderReducer from './slices/user/orderSlice'
import reviewReducer from './slices/user/reviewSlice'

// Admin reducers
import adminProductReducer from './slices/admin/adminProductSlice'
import adminCategoryReducer from './slices/admin/adminCategorySlice'
import adminBrandReducer from './slices/admin/adminBrandSlice'
import adminOrderAdminReducer from './slices/admin/adminOrderAdminSlice'
import adminCustomerReducer from './slices/admin/adminCustomerSlice'
import adminPromotionReducer from './slices/admin/adminPromotionSlice'
import adminInventoryReducer from './slices/admin/adminInventorySlice'
import adminPaymentReducer from './slices/admin/adminPaymentSlice'
import adminRefundReducer from './slices/admin/adminRefundSlice'
import adminReviewAdminReducer from './slices/admin/adminReviewAdminSlice'
import adminAnalyticsReducer from './slices/admin/adminAnalyticsSlice'

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
        adminBrand: adminBrandReducer,
        adminOrderAdmin: adminOrderAdminReducer,
        adminCustomer: adminCustomerReducer,
        adminPromotion: adminPromotionReducer,
        adminInventory: adminInventoryReducer,
        adminPayment: adminPaymentReducer,
        adminRefund: adminRefundReducer,
        adminReviewAdmin: adminReviewAdminReducer,
        adminAnalytics: adminAnalyticsReducer,
    },
})