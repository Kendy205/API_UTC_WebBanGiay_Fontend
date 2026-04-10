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

    console.log(items)
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
        <div className="relative rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">
                        Giỏ hàng của bạn
                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-100 px-2 text-xs font-bold text-indigo-600">
                            {totalQty}
                        </span>
                    </h1>
                </div>
                <button
                    type="button"
                    onClick={() => dispatch(clearCartThunk())}
                    disabled={items.length === 0 || actionLoading}
                    className="flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /></svg>
                    Xóa tất cả
                </button>
            </div>

            <CartList items={items} />

            {items.length > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl bg-slate-50 p-6 border border-slate-100">
                    <div>
                        <div className="text-sm font-medium text-slate-500">Tổng cộng thanh toán</div>
                        <div className="text-3xl font-black text-indigo-600 mt-1">{formatPrice(totalAmount)}</div>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/order')}
                        disabled={actionLoading}
                        className="flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Tiến hành đặt hàng
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" /></svg>
                    </button>
                </div>
            )}
        </div>
    )
}
