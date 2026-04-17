import { createAsyncThunk } from '@reduxjs/toolkit'
import { adminProductService } from '../../../services/admin/AdminProductService'

export const fetchAdminProductsThunk = createAsyncThunk(
    'adminProduct/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const res = await adminProductService.getAll(params)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải sản phẩm')
        }
    }
)

export const createAdminProductThunk = createAsyncThunk(
    'adminProduct/create',
    async (data, { rejectWithValue }) => {
        try {
            // Log FormData properly if it's an instance of FormData
            if (data instanceof FormData) {
                console.log('Sending FormData:', Object.fromEntries(data.entries()));
            } else {
                console.log('Sending JSON:', data);
            }
            const res = await adminProductService.create(data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tạo sản phẩm')
        }
    }
)

export const updateAdminProductThunk = createAsyncThunk(
    'adminProduct/update',
    async ({ productId, data }, { rejectWithValue }) => {
        try {
            const res = await adminProductService.update(productId, data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật sản phẩm')
        }
    }
)

export const deleteAdminProductThunk = createAsyncThunk(
    'adminProduct/delete',
    async (productId, { rejectWithValue }) => {
        try {
            await adminProductService.remove(productId)
            return productId
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi xóa sản phẩm')
        }
    }
)

export const createAdminVariantThunk = createAsyncThunk(
    'adminProduct/createVariant',
    async ({ productId, data }, { rejectWithValue }) => {
        try {
            const res = await adminProductService.createVariant({ productId, ...data })
            return { productId, variant: res.data?.data ?? res.data }
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tạo biến thể')
        }
    }
)

export const updateAdminVariantThunk = createAsyncThunk(
    'adminProduct/updateVariant',
    async ({ productId, variantId, data }, { rejectWithValue }) => {
        try {
            const res = await adminProductService.updateVariant(variantId, { productId, ...data })
            return { productId, variant: res.data?.data ?? res.data }
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi cập nhật biến thể')
        }
    }
)

export const deleteAdminVariantThunk = createAsyncThunk(
    'adminProduct/deleteVariant',
    async ({ productId, variantId }, { rejectWithValue }) => {
        try {
            await adminProductService.removeVariant(variantId)
            return { productId, variantId }
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi xóa biến thể')
        }
    }
)

export const fetchAdminColorsThunk = createAsyncThunk(
    'adminProduct/fetchColors',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminProductService.getColors()
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải màu sắc')
        }
    }
)

export const fetchAdminSizesThunk = createAsyncThunk(
    'adminProduct/fetchSizes',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminProductService.getSizes()
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải kích cỡ')
        }
    }
)

export const fetchInventoryMovementsThunk = createAsyncThunk(
    'adminProduct/fetchInventory',
    async (params, { rejectWithValue }) => {
        try {
            const res = await adminProductService.getInventoryMovements(params)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tải lịch sử nhập xuất kho')
        }
    }
)

export const createInventoryMovementThunk = createAsyncThunk(
    'adminProduct/createInventory',
    async (data, { rejectWithValue }) => {
        try {
            const res = await adminProductService.createInventoryMovement(data)
            return res.data?.data ?? res.data
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message ?? 'Lỗi tạo phiếu nhập/xuất kho')
        }
    }
)
