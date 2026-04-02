import { useDispatch } from 'react-redux'
import {
    decrement,
    increment,
    removeFromCart,
    setQuantity,
} from '../../redux/slices/cartSlice'

export default function CartItem({ item }) {
    const dispatch = useDispatch()

    return (
        <div className="flex flex-col gap-3 rounded border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Thông tin sản phẩm */}
            <div className="min-w-0">
                <div className="truncate font-medium text-neutral-900">
                    {item.productName}
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                    {item.brandName ? `Hãng: ${item.brandName}` : ''}
                    {item.brandName && item.categoryName ? ' • ' : ''}
                    {item.categoryName ? `Danh mục: ${item.categoryName}` : ''}
                </div>
                {(item.sku || item.sizeName || item.colorName) && (
                    <div className="mt-1 text-xs text-neutral-500">
                        {item.sku && <span>SKU: {item.sku}</span>}
                        {item.sku && (item.sizeName || item.colorName) && ' • '}
                        {item.colorName && (
                            <span>Màu: {item.colorName}</span>
                        )}
                        {item.colorName && item.sizeName && ' • '}
                        {item.sizeName && <span>Size: {item.sizeName}</span>}
                    </div>
                )}
            </div>

            {/* Điều chỉnh số lượng & xóa */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => dispatch(decrement(item.key))}
                    className="h-9 w-9 rounded border border-neutral-300 bg-white text-lg font-semibold text-neutral-900 hover:bg-neutral-50"
                >
                    −
                </button>
                <input
                    value={item.quantity}
                    onChange={(e) =>
                        dispatch(
                            setQuantity({
                                key: item.key,
                                quantity: e.target.value,
                            })
                        )
                    }
                    className="h-9 w-16 rounded border border-neutral-300 px-2 text-center text-sm"
                    inputMode="numeric"
                />
                <button
                    type="button"
                    onClick={() => dispatch(increment(item.key))}
                    className="h-9 w-9 rounded border border-neutral-300 bg-white text-lg font-semibold text-neutral-900 hover:bg-neutral-50"
                >
                    +
                </button>

                <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(item.key))}
                    className="ml-2 rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                >
                    Xóa
                </button>
            </div>
        </div>
    )
}
