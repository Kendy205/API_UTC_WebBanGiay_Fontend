import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/ProductSlices'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/orderSlice'
import reviewReducer from './slices/reviewSlice'

export const store = configureStore({
    reducer: {
        product: productReducer,
        auth: authReducer,
        ui: uiReducer,
        cart: cartReducer,
        order: orderReducer,
        review: reviewReducer,
    },
})