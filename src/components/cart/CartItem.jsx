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
            dispatch(updateItemQuantityThunk({ cartItemId: item.cartItemId, quantity: q }))
        }
    }

    const handleRemove = async (e) => {
        e.stopPropagation()
        setIsLoading(true)
        await dispatch(removeItemThunk(item.variantId)).unwrap().catch(() => { })
        setIsLoading(false)
    }

    const formatPrice = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    const itemPrice = item.unitPrice ?? item.price ?? item.priceOverride ?? item.salePrice ?? item.basePrice ?? 0;

    const canNavigate = item.productId && item.productId > 0

    const navigateToDetail = () => {
        if (canNavigate) {
            navigate(`/products/${item.productId}`)
        }
    }

    return (
        <div
            onClick={navigateToDetail}
            className={`group flex flex-col gap-5 rounded-2xl border bg-white p-5 sm:flex-row sm:items-center sm:justify-between transition-all duration-300 hover:shadow-lg ${canNavigate ? 'cursor-pointer' : 'cursor-default'} ${isLoading ? 'opacity-50 pointer-events-none border-slate-200' : 'border-slate-200 hover:border-indigo-200 hover:shadow-indigo-100/50'}`}
        >
            <div className="flex items-center gap-4 min-w-0">
                {/* Ảnh sản phẩm - giả lập vì hiện UI chưa có chỗ chứa */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60 relative">
                    {item.image ? (
                        <img src={item.image} alt={item.productName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z" /><path d="M4.5 3a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z" /></svg>
                        </div>
                    )}
                </div>

                {/* Thông tin sản phẩm - tên lớn trên, variant nhỏ bên dưới */}
                <div className="min-w-0 flex-1">

                    {/* Tên sản phẩm */}
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="truncate font-bold text-slate-800 text-base leading-tight transition-colors group-hover:text-indigo-600">
                            {item.productName}
                        </span>
                        {canNavigate && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">
                                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                            </svg>
                        )}
                    </div>

                    {/* Thông tin biến thể: màu + size */}
                    {(item.colorName || item.sizeLabel || item.sizeName) && (
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            {item.colorName && (
                                <span className="flex items-center gap-1">
                                    <span
                                        className="h-3 w-3 rounded-full border border-slate-300 shrink-0"
                                        style={{ backgroundColor: item.colorHex || '#ccc' }}
                                    />
                                    <span>{item.colorName}</span>
                                </span>
                            )}
                            {(item.sizeLabel || item.sizeName) && (
                                <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
                                    Size: {item.sizeLabel || item.sizeName}
                                </span>
                            )}
                            {item.sku && (
                                <span className="font-mono text-[10px] text-slate-400">#{item.sku}</span>
                            )}
                        </div>
                    )}

                    {/* Giá đơn vị */}
                    {itemPrice > 0 && (
                        <div className="mt-2 font-extrabold text-indigo-600 text-sm">
                            {formatPrice(itemPrice)}
                        </div>
                    )}
                </div>
            </div>

            {/* Điều chỉnh số lượng & xóa */}
            <div className="flex items-center justify-between sm:gap-4 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                    <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={item.quantity <= 1 || isLoading}
                        className="flex h-8 w-8 items-center justify-center rounded-md font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            dispatch(updateItemQuantityThunk({ cartItemId: item.cartItemId, quantity: q }))
                        }}
                        disabled={isLoading}
                        min={1}
                        max={maxStock}
                        className="h-8 w-12 text-center text-sm font-bold text-slate-800 focus:outline-none focus:ring-0 disabled:opacity-50 bg-transparent disabled:text-slate-400 border-none"
                        inputMode="numeric"
                    />
                    <button
                        type="button"
                        onClick={handleIncrement}
                        disabled={isLoading || item.quantity >= maxStock}
                        title={item.quantity >= maxStock ? `Chỉ còn ${maxStock} sản phẩm` : ""}
                        className="flex h-8 w-8 items-center justify-center rounded-md font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        +
                    </button>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <div className="text-right text-sm font-bold text-slate-800">
                        {formatPrice(itemPrice * item.quantity)}
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={isLoading}
                        className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg>
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    )
}
