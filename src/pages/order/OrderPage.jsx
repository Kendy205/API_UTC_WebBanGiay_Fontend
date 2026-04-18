import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAddressesThunk, createOrderThunk, payVnpayThunk } from '../../redux/actions/user/orderAction'
import { resetOrderState } from '../../redux/slices/user/orderSlice'
import MapboxAddressPicker from '../../components/map/MapboxAddressPicker'
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
    // Địa chỉ được chọn từ bản đồ Mapbox
    const [mapAddress, setMapAddress] = useState(null) // { address, lat, lng, distanceKm, shippingFee }


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

    const formatPrice = (amount) => amount != null
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
        : null

    const totalItemPrice = items.reduce((s, item) => {
        let price = item.unitPrice ?? item.price;
        if (price == null || price === 0) {
            price = (item.priceOverride > 0)
                ? item.priceOverride
                : ((item.salePrice > 0) ? item.salePrice : item.basePrice) ?? 0;
        }
        return s + price * (item.quantity || 1);
    }, 0);

    // Phí ship: nếu đang ở tab bản đồ dùng phí tính từ khoảng cách, ngược lại dùng mặc định 30k
    const shippingFee = addressTab === TAB_MAP && mapAddress?.shippingFee != null
        ? mapAddress.shippingFee
        : 30000
    const finalTotal = totalItemPrice + shippingFee

    // Kiểm tra địa chỉ hợp lệ dựa theo tab đang chọn
    const isAddressReady =
        addressTab === TAB_SAVED
            ? !!selectedAddressId
            : !!mapAddress

    const handleConfirm = async () => {
        if (!isAddressReady) return

        const payload = {
            //userId: 0,
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
            payload.shippingFee = mapAddress.shippingFee ?? 30000
            payload.distanceKm = mapAddress.distanceKm ?? null
            payload.newAddress = {
                addressId: 0,
                recipientName: 'Địa chỉ mới',
                phone: '',
                province: '',
                district: '',
                ward: '',
                streetAddress: mapAddress.address,
                lat: mapAddress.lat,
                lng: mapAddress.lng,
                isDefault: false,
            }
        }
        console.log(payload)
        // Tạo đơn hàng     trước
        const result = await dispatch(createOrderThunk(payload))
        //console.log(result)
        // Nếu đặt hàng thành công và là chuyển khoản VNPay → gọi API lấy link rồi redirect
        if (createOrderThunk.fulfilled.match(result) && paymentMethod === 'bank_transfer') {
            const newOrderId =
                result.payload?.orderId ??
                result.payload?.id ??
                null

            if (newOrderId) {
                dispatch(payVnpayThunk(newOrderId))
                // Sau lệnh này trình duyệt sẽ redirect
            } else {
                // Không lấy được orderId — vẫn hiển thị trang thành công thường
                // (UI sẽ hiển thị do orderSuccess = true)
            }
        }
    }

    /* ── Đặt hàng thành công ── */
    if (orderSuccess) {
        const fmt = formatPrice
        console.log(createdOrder)
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
                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Chi tiết sản phẩm</p>
                        <div className="space-y-4">
                            {orderItems.map((it, idx) => {
                                const img = it.imageUrlSnapshot || it.image || it.imageUrl || null
                                const name = it.productNameSnapshot || it.productName || it.name || `Sản phẩm #${idx + 1}`
                                const color = it.colorNameSnapshot || it.colorName
                                const size = it.sizeLabelSnapshot || it.sizeLabel || it.sizeName
                                const price = it.unitPrice ?? it.price

                                return (
                                    <div key={it.orderItemId ?? it.variantId ?? idx}
                                        className="group flex items-center gap-4 rounded-xl border border-transparent p-1 transition-all hover:bg-slate-50 hover:border-slate-100">

                                        {/* Ảnh sản phẩm */}
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                                            {img ? (
                                                <img
                                                    src={img}
                                                    alt={name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-xs text-slate-300">No Image</div>
                                            )}
                                        </div>

                                        {/* Thông tin chữ */}
                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-1 font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                {name}
                                            </p>
                                            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                                                {color && (
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                                                        🎨 {color}
                                                    </span>
                                                )}
                                                {size && (
                                                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-600">
                                                        📏 Size: {size}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Giá & Số lượng */}
                                        <div className="shrink-0 text-right">
                                            <p className="font-bold text-slate-900">×{it.quantity}</p>
                                            {fmt(price) && (
                                                <p className="text-xs font-medium text-slate-400 line-through decoration-slate-300 decoration-1 opacity-60">{fmt(price)}</p>
                                            )}
                                            {fmt((price || 0) * it.quantity) && (
                                                <p className="text-sm font-bold text-indigo-500">{fmt((price || 0) * it.quantity)}</p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Tổng tiền */}
                        {totalAmount != null && (
                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                <div>
                                    <span className="text-sm font-medium text-slate-500">Tổng thanh toán</span>
                                    <p className="text-xs text-slate-400 mt-0.5">(Đã bao gồm phí vận chuyển và giảm giá)</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black tracking-tight text-indigo-600">
                                        {fmt(totalAmount)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─ Điều hướng ─ */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        onClick={() => navigate('/order-history')}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
                    >
                        📋 Xem lịch sử đơn hàng
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        🏠 Về trang chủ
                    </button>
                    {/* <button
                        onClick={() => { dispatch(resetOrderState()); navigate('/home') }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:col-span-2"
                    >
                        🛍️ Tiếp tục mua sắm
                    </button> */}
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

                        {/* ── TAB: Chọn địa chỉ qua bản đồ Mapbox ── */}
                        {addressTab === TAB_MAP && (
                            <MapboxAddressPicker
                                onAddressSelected={(data) => setMapAddress(data)}
                            />
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

                        <div className="mt-4 border-t border-neutral-200 pt-3 text-sm text-neutral-700 space-y-2">
                            <div className="flex justify-between">
                                <span>Tổng số lượng</span>
                                <span className="font-semibold">{totalQty} sản phẩm</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tiền hàng</span>
                                <span className="font-medium text-neutral-900">{formatPrice(totalItemPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <div className="text-right">
                                    <span className="font-medium text-neutral-900">{formatPrice(shippingFee)}</span>
                                    {addressTab === TAB_MAP && mapAddress?.distanceKm != null && (
                                        <div className="text-xs text-neutral-400 mt-0.5">📏 {mapAddress.distanceKm} km</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between border-t border-neutral-100 pt-2 mt-2 text-base">
                                <span className="font-semibold text-neutral-900">Tổng thanh toán</span>
                                <span className="font-bold text-indigo-600">{formatPrice(finalTotal)}</span>
                            </div>
                        </div>

                        {/* Địa chỉ đang dùng (preview) */}
                        {addressTab === TAB_MAP && mapAddress && (
                            <div className="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-600 space-y-1">
                                <div><span className="font-medium">🗺️ Giao đến: </span>{mapAddress.address}</div>
                                {mapAddress.distanceKm != null && (
                                    <div className="text-green-700 font-medium">📏 {mapAddress.distanceKm} km — 🚚 {formatPrice(mapAddress.shippingFee)}</div>
                                )}
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
