import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/user/ProductSlices'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import cartReducer from './slices/user/cartSlice'
import orderReducer from './slices/user/orderSlice'
import reviewReducer from './slices/user/reviewSlice'
import brandReducer from './slices/user/brandSlice'
import categoryReducer from './slices/user/categorySlice'

// Admin reducers
import adminProductReducer from './slices/admin/adminProductSlice'
import adminCategoryReducer from './slices/admin/adminCategorySlice'
import adminBrandReducer from './slices/admin/adminBrandSlice'
import adminOrderAdminReducer from './slices/admin/adminOrderAdminSlice'
import adminCustomerReducer from './slices/admin/adminCustomerSlice'

import adminPaymentReducer from './slices/admin/adminPaymentSlice'
//import adminRefundReducer from './slices/admin/adminRefundSlice'
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
        brand: brandReducer,
        category: categoryReducer,
        // Admin
        adminProduct: adminProductReducer,
        adminCategory: adminCategoryReducer,
        adminBrand: adminBrandReducer,
        adminOrderAdmin: adminOrderAdminReducer,
        adminCustomer: adminCustomerReducer,

        adminPayment: adminPaymentReducer,
        // adminRefund: adminRefundReducer,
        adminReviewAdmin: adminReviewAdminReducer,
        adminAnalytics: adminAnalyticsReducer,
    },
})