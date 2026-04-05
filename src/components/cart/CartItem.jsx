import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    updateItemQuantityThunk,
    removeItemThunk,
} from '../../redux/actions/cartAction'

export default function CartItem({ item }) {
    //console.log(item)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const maxStock = item.stockQuantity ?? 99;

    const handleDecrement = async (e) => {
        e.stopPropagation()
        const q = Math.max(1, item.quantity - 1)
        setIsLoading(true)
        await dispatch(updateItemQuantityThunk({ cartItemId: item.cartItemId, quantity: q })).unwrap().catch(() => { })
        setIsLoading(false)
    }

    const handleIncrement = async (e) => {
        e.stopPropagation()
        if (item.quantity >= maxStock) return;
        setIsLoading(true)
        await dispatch(updateItemQuantityThunk({ cartItemId: item.cartItemId, quantity: item.quantity + 1 })).unwrap().catch(() => { })
        setIsLoading(false)
    }

    const handleChange = (e) => {
        e.stopPropagation()
        let q = parseInt(e.target.value, 10)
        if (!isNaN(q) && q > 0) {
            q = Math.min(q, maxStock)
            dispatch(updateItemQuantityThunk({ variantId: item.variantId, quantity: q }))
        }
    }

    const handleRemove = async (e) => {
        e.stopPropagation()
        setIsLoading(true)
        await dispatch(removeItemThunk(item.cartItemId)).unwrap().catch(() => { })
        // No setIsLoading(false) needed here if removing unmounts the component. Wait, doing it is safer or not? 
        setIsLoading(false)
    }

    const formatPrice = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    const itemPrice = item.unitPrice ?? item.price ?? item.priceOverride ?? item.salePrice ?? item.basePrice ?? 0;

    const navigateToDetail = () => {
        if (item.productId) {
            navigate(`/products/${item.productId}`)
        }
    }

    return (
        <div
            onClick={navigateToDetail}
            className={`flex flex-col gap-3 rounded border p-4 sm:flex-row sm:items-center sm:justify-between cursor-pointer transition hover:border-neutral-400 ${isLoading ? 'opacity-50 pointer-events-none border-neutral-300' : 'border-neutral-200'}`}
        >
            {/* Thông tin sản phẩm */}
            <div className="min-w-0">
                <div className="truncate font-medium text-neutral-900">
                    {item.productName}
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                    {item.brandName && <span>Hãng: {item.brandName}</span>}
                    {item.brandName && item.categoryName && <span className="mx-1">•</span>}
                    {item.categoryName && <span>Danh mục: {item.categoryName}</span>}
                </div>
                {(item.sku || item.sizeLabel || item.sizeName || item.colorName) && (
                    <div className="mt-1 text-xs text-neutral-500">
                        {item.sku && <span>SKU: {item.sku}</span>}
                        {item.sku && (item.sizeLabel || item.sizeName || item.colorName) && <span className="mx-1">•</span>}
                        {item.colorName && (
                            <span>Màu: {item.colorName}</span>
                        )}
                        {item.colorName && (item.sizeLabel || item.sizeName) && <span className="mx-1">•</span>}
                        {(item.sizeLabel || item.sizeName) && <span>Size: {item.sizeLabel || item.sizeName}</span>}
                    </div>
                )}
                {itemPrice > 0 && (
                    <div className="mt-2 font-medium text-sm text-neutral-900">
                        Đơn giá: <span className="text-red-600">{formatPrice(itemPrice)}</span>
                    </div>
                )}
            </div>

            {/* Điều chỉnh số lượng & xóa */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={item.quantity <= 1 || isLoading}
                    className="h-9 w-9 rounded border border-neutral-300 bg-white text-lg font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    −
                </button>
                <input
                    value={item.quantity}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={(e) => {
                        e.stopPropagation()
                        let q = parseInt(e.target.value, 10)
                        if (isNaN(q) || q < 1) q = 1;
                        q = Math.min(q, maxStock);
                        dispatch(updateItemQuantityThunk({ variantId: item.variantId, quantity: q }))
                    }}
                    disabled={isLoading}
                    min={1}
                    max={maxStock}
                    className="h-9 w-16 rounded border border-neutral-300 px-2 text-center text-sm disabled:opacity-50 disabled:bg-neutral-100"
                    inputMode="numeric"
                />
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={isLoading || item.quantity >= maxStock}
                    title={item.quantity >= maxStock ? `Chỉ còn ${maxStock} sản phẩm` : ""}
                    className="h-9 w-9 rounded border border-neutral-300 bg-white text-lg font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    +
                </button>

                <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isLoading}
                    className="ml-2 rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Xóa
                </button>
            </div>
        </div>
    )
}
