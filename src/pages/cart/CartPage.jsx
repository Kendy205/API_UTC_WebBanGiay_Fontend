import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCartThunk } from '../../redux/actions/cartAction'
import CartList from '../../components/cart/CartList'
import { useEffect } from 'react'
import { fetchCartThunk } from '../../redux/actions/cartAction'

export default function CartPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { items, loading, actionLoading } = useSelector((s) => s.cart)
    useEffect(() => {
        dispatch(fetchCartThunk())
    }, [])
    const totalQty = items.reduce((sum, x) => sum + (x.quantity || 0), 0)

    if (loading) {
        return (
            <div className="rounded-lg border bg-white p-12 text-center shadow-sm">
                <div className="text-sm font-medium text-neutral-500">Đang tải giỏ hàng...</div>
            </div>
        )
    }

    const formatPrice = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    const totalAmount = items.reduce((sum, item) => {
        const itemPrice = item.unitPrice ?? item.price ?? item.priceOverride ?? item.salePrice ?? item.basePrice ?? 0;
        return sum + (item.totalPrice ?? ((item.quantity || 0) * itemPrice));
    }, 0);

    return (
        <div className="relative rounded-lg border bg-white p-6 shadow-sm">

            <div className="mb-4 flex items-center justify-between gap-3">
                <h1 className="text-xl font-semibold text-neutral-900">
                    Giỏ hàng
                </h1>
                <button
                    type="button"
                    onClick={() => dispatch(clearCartThunk())}
                    disabled={items.length === 0 || actionLoading}
                    className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Xóa tất cả
                </button>
            </div>

            <p className="mb-4 text-sm text-neutral-600">
                Tổng số lượng: <span className="font-medium mr-4">{totalQty}</span>
                Tổng cộng: <span className="font-medium text-red-600">{formatPrice(totalAmount)}</span>
            </p>

            <CartList items={items} />

            {items.length > 0 && (
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/order')}
                        disabled={actionLoading}
                        className="rounded-xl bg-neutral-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-neutral-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Mua hàng →
                    </button>
                </div>
            )}
        </div>
    )
}
