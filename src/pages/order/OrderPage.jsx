import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAddressesThunk, createOrderThunk, payVnpayThunk } from '../../redux/actions/user/orderAction'
import { resetOrderState } from '../../redux/slices/user/orderSlice'
import GoongAddressPicker from '../../components/map/GoongAddressPicker'
import SavedAddressTab from './SavedAddressTab'

const PAYMENT_METHODS = [
    { value: 'COD', label: '💵 Thanh toán khi nhận hàng (COD)' },
    { value: 'bank_transfer', label: '🏦 Chuyển khoản VNPay' },
    { value: 'card', label: '💳 Thẻ tín dụng / Ghi nợ' },
    { value: 'ewallet', label: '📱 Ví điện tử (Momo, ZaloPay…)' },
]

// Tab constant
const TAB_SAVED = 'saved'
const TAB_MAP = 'map'

export default function OrderPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // ── Redux state ──────────────────────────────────────────────
    const items = useSelector((s) => s.cart.items)
    const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)

    const { addresses, addressLoading, addressError, submitting, orderError, orderSuccess, createdOrder, vnpayLoading, vnpayError } =
        useSelector((s) => s.order)

    // ── Local UI state ───────────────────────────────────────────
    const [selectedAddressId, setSelectedAddressId] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('COD')

    // Tab: 'saved' = địa chỉ đã lưu, 'map' = nhập địa chỉ mới qua bản đồ
    const [addressTab, setAddressTab] = useState(TAB_SAVED)
    // Địa chỉ được chọn từ bản đồ Goong
    const [mapAddress, setMapAddress] = useState(null) // { address, lat, lng }



    // ── Guards ───────────────────────────────────────────────────
    // Chỉ redirect khi chưa đăng nhập
    useEffect(() => {
        if (!isAuthenticated) { navigate('/login') }
    }, [isAuthenticated, navigate])

    // Dùng useRef để đánh dấu mount lần đầu — KHÔNG gây re-render
    const isMountedRef = useRef(false)
    useEffect(() => {
        if (!isMountedRef.current) {
            // Lần đầu mount: bỏ qua, chỉ đánh dấu
            isMountedRef.current = true
            return
        }
        // Sau lần đầu: nếu cart rỗng thì redirect
        // Ngoại trừ trường hợp vừa đặt hàng thành công (cart bị xóa là đúng)
        if (items.length === 0 && !orderSuccess) { navigate('/cart') }
    }, [items, navigate, orderSuccess])

    // ── Fetch địa chỉ khi mount (chỉ khi đã auth) ───────────────
    useEffect(() => {
        if (!isAuthenticated) return
        dispatch(fetchAddressesThunk())
        dispatch(resetOrderState())
    }, [dispatch, isAuthenticated])

    // ── Tự chọn địa chỉ mặc định sau khi có data ────────────────
    useEffect(() => {
        if (addresses.length === 0) return
        const def = addresses.find((a) => a.isDefault)
        setSelectedAddressId(def ? def.addressId : addresses[0].addressId)
    }, [addresses])

    // Không tự redirect nữa — hiển thị trang thông báo thành công cho đến khi user tự điều hướng

    const totalQty = items.reduce((s, x) => s + (x.quantity || 0), 0)

    // Kiểm tra địa chỉ hợp lệ dựa theo tab đang chọn
    const isAddressReady =
        addressTab === TAB_SAVED
            ? !!selectedAddressId
            : !!mapAddress

    const handleConfirm = async () => {
        if (!isAddressReady) return

        const payload = {
            userId: 0,
            note: "",
            paymentMethod,
            items: items.map((i) => ({
                variantId: i.variantId,
                quantity: i.quantity,
            })),
        }

        if (addressTab === TAB_SAVED) {
            payload.shippingAddressId = selectedAddressId
            payload.newAddress = null
        } else {
            payload.shippingAddressId = 0
            payload.newAddress = {
                addressId: 0,
                recipientName: "Địa chỉ mới",
                phone: "",
                province: "",
                district: "",
                ward: "",
                streetAddress: mapAddress.address,
                isDefault: false
            }
        }

        // Tạo đơn hàng trước
        const result = await dispatch(createOrderThunk(payload))
        console.log(result)
        // Nếu đặt hàng thành công và là chuyển khoản VNPay → gọi API lấy link rồi redirect
        if (createOrderThunk.fulfilled.match(result) && paymentMethod === 'bank_transfer') {
            const newOrderId =
                result.payload?.orderId ??
                result.payload?.id ??
                null

            if (newOrderId) {
                dispatch(payVnpayThunk(newOrderId))
                // Sau lệnh này trình duyệt sẽ redirect, không cần làm gì thêm
            } else {
                // Không lấy được orderId — vẫn hiển thị trang thành công thường
                // (UI sẽ hiển thị do orderSuccess = true)
            }
        }
    }

    /* ── Đặt hàng thành công ── */
    if (orderSuccess) {
        const fmt = (n) => n != null
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
            : null

        const STATUS_MAP = {
            Pending: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700 border-amber-200' },
            Processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            Shipped: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
            Delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700 border-green-200' },
            Cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200' },
        }
        const statusKey = createdOrder?.status ?? createdOrder?.orderStatus ?? 'Pending'
        const statusInfo = STATUS_MAP[statusKey] ?? STATUS_MAP.Pending

        const orderItems = createdOrder?.orderItems ?? createdOrder?.items ?? items
        const totalAmount = createdOrder?.totalAmount ?? createdOrder?.total ?? null
        const orderId = createdOrder?.orderId ?? createdOrder?.id ?? null
        const method = createdOrder?.paymentMethod ?? null

        return (
            <div className="mx-auto max-w-xl px-4 py-10">

                {/* ─ Header thành công ─ */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-5xl shadow-sm">
                        ✅
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Đặt hàng thành công!</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm xác nhận đơn của bạn.
                    </p>
                </div>

                {/* ─ Thẻ thông tin đơn hàng ─ */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                    {/* Mã đơn + trạng thái */}
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">Mã đơn hàng</p>
                            <p className="font-bold text-slate-800 text-lg">
                                {orderId ? `#${orderId}` : '—'}
                            </p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.color}`}>
                            {statusInfo.label}
                        </span>
                    </div>

                    {/* Phương thức thanh toán */}
                    {method && (
                        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-sm">
                            <span className="text-slate-400">💳 Thanh toán:</span>
                            <span className="font-medium text-slate-700">{method}</span>
                        </div>
                    )}

                    {/* Danh sách sản phẩm */}
                    <div className="px-5 py-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Sản phẩm</p>
                        <div className="space-y-3">
                            {orderItems.map((it, idx) => (
                                <div key={it.orderItemId ?? it.variantId ?? idx}
                                    className="flex items-center justify-between gap-3 text-sm">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-slate-800">
                                            {it.productName ?? it.name ?? `Sản phẩm #${idx + 1}`}
                                        </p>
                                        {(it.colorName || it.sizeLabel || it.sizeName) && (
                                            <p className="text-xs text-slate-400">
                                                {[it.colorName, it.sizeLabel ?? it.sizeName].filter(Boolean).join(' · ')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="font-semibold text-slate-700">×{it.quantity}</p>
                                        {fmt(it.unitPrice ?? it.price) && (
                                            <p className="text-xs text-slate-400">{fmt(it.unitPrice ?? it.price)}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tổng tiền */}
                        {totalAmount != null && (
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className="text-sm font-semibold text-slate-600">Tổng cộng</span>
                                <span className="text-lg font-extrabold text-indigo-600">{fmt(totalAmount)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─ Điều hướng ─ */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        onClick={() => { dispatch(resetOrderState()); navigate('/order-history') }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
                    >
                        📋 Xem lịch sử đơn hàng
                    </button>
                    <button
                        onClick={() => { dispatch(resetOrderState()); navigate('/') }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        🏠 Về trang chủ
                    </button>
                    <button
                        onClick={() => { dispatch(resetOrderState()); navigate('/products') }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:col-span-2"
                    >
                        🛍️ Tiếp tục mua sắm
                    </button>
                </div>

            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-neutral-900">Xác nhận đơn hàng</h1>

            <div className="grid gap-6 md:grid-cols-[1fr_360px]">
                {/* ── Cột trái: địa chỉ + thanh toán ── */}
                <div className="space-y-6">

                    {/* ── Địa chỉ nhận hàng ── */}
                    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 font-semibold text-neutral-800">📍 Địa chỉ nhận hàng</h2>

                        {/* Tab switcher */}
                        <div className="mb-4 flex rounded-lg border border-neutral-200 overflow-hidden text-sm font-medium">
                            <button
                                type="button"
                                onClick={() => setAddressTab(TAB_SAVED)}
                                className={`flex-1 py-2 transition ${addressTab === TAB_SAVED
                                    ? 'bg-neutral-900 text-white'
                                    : 'bg-white text-neutral-600 hover:bg-neutral-50'
                                    }`}
                            >
                                📋 Địa chỉ đã lưu
                            </button>
                            <button
                                type="button"
                                onClick={() => setAddressTab(TAB_MAP)}
                                className={`flex-1 py-2 transition border-l border-neutral-200 ${addressTab === TAB_MAP
                                    ? 'bg-neutral-900 text-white'
                                    : 'bg-white text-neutral-600 hover:bg-neutral-50'
                                    }`}
                            >
                                🗺️ Chọn trên bản đồ
                            </button>
                        </div>

                        {/* ── TAB: Địa chỉ đã lưu ── */}
                        {addressTab === TAB_SAVED && (
                            <SavedAddressTab
                                selectedAddressId={selectedAddressId}
                                setSelectedAddressId={setSelectedAddressId}
                            />
                        )}

                        {/* ── TAB: Chọn địa chỉ qua bản đồ Goong ── */}
                        {addressTab === TAB_MAP && (
                            <div>
                                <GoongAddressPicker
                                    onAddressSelected={(data) => setMapAddress(data)}
                                />
                                {mapAddress ? (
                                    <div className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm">
                                        <p className="font-semibold text-green-800">✅ Địa chỉ đã chọn:</p>
                                        <p className="mt-1 text-green-700">{mapAddress.address}</p>
                                        <p className="mt-0.5 text-xs text-green-600">
                                            {mapAddress.lat.toFixed(5)}, {mapAddress.lng.toFixed(5)}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-xs text-neutral-400">
                                        ⬆️ Gõ để tìm và chọn địa chỉ giao hàng trên bản đồ.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                </div>

                {/* ── Cột phải: thanh toán + tóm tắt đơn hàng ── */}
                <div className="space-y-6">

                    {/* ── Phương thức thanh toán ── */}
                    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 font-semibold text-neutral-800">💳 Phương thức thanh toán</h2>
                        <div className="space-y-2">
                            {PAYMENT_METHODS.map((pm) => (
                                <label
                                    key={pm.value}
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${paymentMethod === pm.value
                                        ? 'border-neutral-900 bg-neutral-50 font-semibold ring-1 ring-neutral-900'
                                        : 'border-neutral-200 hover:border-neutral-400'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={pm.value}
                                        checked={paymentMethod === pm.value}
                                        onChange={() => setPaymentMethod(pm.value)}
                                        className="accent-neutral-900"
                                    />
                                    {pm.label}
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* ── Tóm tắt đơn hàng ── */}
                    <div className="sticky top-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 font-semibold text-neutral-800">🛒 Tóm tắt đơn hàng</h2>

                        <div className="max-h-64 space-y-3 overflow-y-auto">
                            {items.map((item) => (
                                <div
                                    key={item.key}
                                    className="flex items-start justify-between gap-2 text-sm"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate font-medium text-neutral-900">
                                            {item.productName}
                                        </div>
                                        <div className="mt-0.5 text-xs text-neutral-500">
                                            {[item.colorName, item.sizeName].filter(Boolean).join(' / ')}
                                        </div>
                                    </div>
                                    <div className="shrink-0 font-medium text-neutral-700">
                                        × {item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 border-t border-neutral-200 pt-3 text-sm text-neutral-700">
                            <div className="flex justify-between">
                                <span>Tổng số lượng</span>
                                <span className="font-semibold">{totalQty} sản phẩm</span>
                            </div>
                        </div>

                        {/* Địa chỉ đang dùng (preview) */}
                        {addressTab === TAB_MAP && mapAddress && (
                            <div className="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                                <span className="font-medium">🗺️ Giao đến: </span>
                                {mapAddress.address}
                            </div>
                        )}

                        {/* Lỗi đặt hàng */}
                        {orderError && (
                            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {orderError}
                            </p>
                        )}

                        {/* Lỗi VNPay (sau khi tạo đơn thành công nhưng lấy link thất bại) */}
                        {vnpayError && (
                            <p className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">
                                ⚠️ {vnpayError}
                            </p>
                        )}

                        {/* Cảnh báo chưa chọn địa chỉ */}
                        {!isAddressReady && !addressLoading && (
                            <p className="mt-3 text-xs text-amber-600">
                                ⚠️ Vui lòng {addressTab === TAB_SAVED ? 'chọn địa chỉ nhận hàng' : 'chọn địa chỉ trên bản đồ'}.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={submitting || vnpayLoading || addressLoading || !isAddressReady}
                            className="mt-5 w-full rounded-xl bg-neutral-900 py-3 text-sm font-bold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {vnpayLoading
                                ? '🔄 Đang chuyển sang VNPay…'
                                : submitting
                                    ? 'Đang xử lý…'
                                    : paymentMethod === 'bank_transfer'
                                        ? '🏦 Thanh toán qua VNPay'
                                        : '✅ Xác nhận đặt hàng'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/cart')}
                            className="mt-2 w-full rounded-xl border border-neutral-300 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                        >
                            ← Quay lại giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
