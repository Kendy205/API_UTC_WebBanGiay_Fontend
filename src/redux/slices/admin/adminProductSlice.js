import { createSlice } from '@reduxjs/toolkit'
import {
    fetchAdminProductsThunk,
    createAdminProductThunk,
    updateAdminProductThunk,
    deleteAdminProductThunk,
    createAdminVariantThunk,
    updateAdminVariantThunk,
    deleteAdminVariantThunk,
    fetchAdminColorsThunk,
    fetchAdminSizesThunk,
} from '../../actions/admin/adminProductAction'

const adminProductSlice = createSlice({
    name: 'adminProduct',
    initialState: {
        items: [],
        colors: [],
        sizes: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 1,
        loading: false,
        error: null,
    },
    reducers: {
        setPage: (s, a) => { s.page = a.payload }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProductsThunk.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAdminProductsThunk.fulfilled, (s, a) => {
                s.loading = false
                const p = a.payload || {}
                s.items = p.items ?? p.data ?? p
                s.total = p.totalCount ?? p.total ?? s.items.length
                s.page = p.currentPage ?? p.page ?? s.page
                s.totalPages = p.totalPages ?? (Math.ceil(s.total / s.pageSize) || 1)
            })
            .addCase(fetchAdminProductsThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(createAdminProductThunk.pending, (s) => { s.loading = true })
            .addCase(createAdminProductThunk.fulfilled, (s, a) => {
                s.loading = false
                s.items.unshift(a.payload)
                s.total += 1
            })
            .addCase(createAdminProductThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
            .addCase(updateAdminProductThunk.fulfilled, (s, a) => {
                const idx = s.items.findIndex((x) => x.productId === a.payload.productId)
                if (idx !== -1) s.items[idx] = a.payload
            })
            .addCase(deleteAdminProductThunk.fulfilled, (s, a) => {
                s.items = s.items.filter((x) => x.productId === a.payload)
                s.total -= 1
            })
            // Variants
            .addCase(createAdminVariantThunk.fulfilled, (s, a) => {
                const { productId, variant } = a.payload
                const product = s.items.find((x) => x.productId === productId)
                if (product) {
                    if (!product.productVariants) product.productVariants = []
                    product.productVariants.push(variant)
                }
            })
            .addCase(updateAdminVariantThunk.fulfilled, (s, a) => {
                const { productId, variant } = a.payload
                const product = s.items.find((x) => x.productId === productId)
                if (product && product.productVariants) {
                    const vIdx = product.productVariants.findIndex((v) => v.variantId === variant.variantId)
                    if (vIdx !== -1) product.productVariants[vIdx] = variant
                }
            })
            .addCase(deleteAdminVariantThunk.fulfilled, (s, a) => {
                const { productId, variantId } = a.payload
                const product = s.items.find((x) => x.productId === productId)
                if (product && product.productVariants) {
                    product.productVariants = product.productVariants.filter((v) => v.variantId !== variantId)
                }
            })
            // Colors & Sizes
            .addCase(fetchAdminColorsThunk.fulfilled, (s, a) => {
                s.colors = a.payload.data ?? a.payload
            })
            .addCase(fetchAdminSizesThunk.fulfilled, (s, a) => {
                s.sizes = a.payload.data ?? a.payload
            })
    },
})

export const { setPage } = adminProductSlice.actions
export default adminProductSlice.reducer
