import { createSlice } from '@reduxjs/toolkit'
import { readCartFromStorage, writeCartToStorage } from '../../utils/cartStorage'

function getKey(product) {
    return (
        product.variantId ??
        product.productVariantId ??
        product.productId ??
        product.id
    )
}

const initialState = {
    items: readCartFromStorage(),
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload
            const key = getKey(product)
            if (key == null) return

            const qty = Math.max(1, Number(product.quantity) || 1)
            const existing = state.items.find((x) => x.key === key)
            if (existing) {
                existing.quantity += qty
            } else {
                state.items.push({
                    key,
                    variantId: product.variantId ?? null,
                    productId: product.productId ?? null,
                    id: product.id ?? null,
                    productName:
                        product.productName ?? product.name ?? 'Sản phẩm',
                    slug: product.slug ?? '',
                    brandName: product.brandName ?? '',
                    categoryName: product.categoryName ?? '',
                    sizeName: product.sizeName ?? '',
                    colorName: product.colorName ?? '',
                    sku: product.sku ?? '',
                    quantity: qty,
                })
            }
            writeCartToStorage(state.items)
        },
        removeFromCart: (state, action) => {
            const key = action.payload
            state.items = state.items.filter((x) => x.key !== key)
            writeCartToStorage(state.items)
        },
        setQuantity: (state, action) => {
            const { key, quantity } = action.payload
            const q = Math.max(1, Number(quantity) || 1)
            const item = state.items.find((x) => x.key === key)
            if (!item) return
            item.quantity = q
            writeCartToStorage(state.items)
        },
        decrement: (state, action) => {
            const key = action.payload
            const item = state.items.find((x) => x.key === key)
            if (!item) return
            item.quantity = Math.max(1, item.quantity - 1)
            writeCartToStorage(state.items)
        },
        increment: (state, action) => {
            const key = action.payload
            const item = state.items.find((x) => x.key === key)
            if (!item) return
            item.quantity += 1
            writeCartToStorage(state.items)
        },
        clearCart: (state) => {
            state.items = []
            writeCartToStorage(state.items)
        },
        hydrateCart: (state) => {
            state.items = readCartFromStorage()
        },
    },
})

export const {
    addToCart,
    removeFromCart,
    setQuantity,
    decrement,
    increment,
    clearCart,
    hydrateCart,
} = cartSlice.actions

export default cartSlice.reducer

