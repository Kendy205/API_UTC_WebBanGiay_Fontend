import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../../redux/slices/cartSlice'
import CartList from './CartList'

export default function CartPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const items = useSelector((s) => s.cart.items)

    const totalQty = items.reduce((sum, x) => sum + (x.quantity || 0), 0)

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h1 className="text-xl font-semibold text-neutral-900">
                    Giỏ hàng
                </h1>
                <button
                    type="button"
                    onClick={() => dispatch(clearCart())}
                    disabled={items.length === 0}
                    className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Xóa tất cả
                </button>
            </div>

            <p className="mb-4 text-sm text-neutral-600">Tổng số lượng: {totalQty}</p>

            <CartList items={items} />

            {items.length > 0 && (
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/order')}
                        className="rounded-xl bg-neutral-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-neutral-700 active:scale-95"
                    >
                        Mua hàng →
                    </button>
                </div>
            )}
        </div>
    )
}
