import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAddressesThunk, createOrderThunk } from '../../redux/actions/orderAction'
import { resetOrderState } from '../../redux/slices/orderSlice'
import GoongAddressPicker from '../../components/map/GoongAddressPicker'

const PAYMENT_METHODS = [
    { value: 'COD', label: '💵 Thanh toán khi nhận hàng (COD)' },
    { value: 'bank_transfer', label: '🏦 Chuyển khoản ngân hàng' },
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

    const { addresses, addressLoading, addressError, submitting, orderError, orderSuccess } =
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
        if (items.length === 0) { navigate('/cart') }
    }, [items, navigate])

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

    // ── Redirect khi đặt hàng thành công ────────────────────────
    useEffect(() => {
        if (orderSuccess) {
            const timer = setTimeout(() => {
                dispatch(resetOrderState())
                navigate('/')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [orderSuccess, dispatch, navigate])

    const totalQty = items.reduce((s, x) => s + (x.quantity || 0), 0)

    // Kiểm tra địa chỉ hợp lệ dựa theo tab đang chọn
    const isAddressReady =
        addressTab === TAB_SAVED
            ? !!selectedAddressId
            : !!mapAddress

    const handleConfirm = () => {
        if (!isAddressReady) return

        const payload = {
            paymentMethod,
            items: items.map((i) => ({
                variantId: i.variantId,
                quantity: i.quantity,
            })),
        }

        if (addressTab === TAB_SAVED) {
            payload.addressId = selectedAddressId
        } else {
            // Gửi địa chỉ thô từ bản đồ Goong
            payload.shippingAddress = mapAddress.address
            payload.lat = mapAddress.lat
            payload.lng = mapAddress.lng
        }

        dispatch(createOrderThunk(payload))
    }

    /* ── Đặt hàng thành công ── */
    if (orderSuccess) {
        return (
            <div className="mx-auto max-w-lg px-4 py-16 text-center">
                <div className="mb-4 text-6xl">🎉</div>
                <h1 className="mb-2 text-2xl font-bold text-neutral-900">Đặt hàng thành công!</h1>
                <p className="mb-2 text-neutral-600">
                    Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ xác nhận đơn sớm nhất.
                </p>
                <p className="text-sm text-neutral-400">Tự động về trang chủ sau 3 giây…</p>
                <button
                    onClick={() => { dispatch(resetOrderState()); navigate('/') }}
                    className="mt-6 rounded-xl bg-neutral-900 px-8 py-3 text-sm font-semibold text-white hover:bg-neutral-700 transition"
                >
                    Về trang chủ ngay
                </button>
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
                            <>
                                {addressLoading ? (
                                    <p className="text-sm text-neutral-500">Đang tải địa chỉ…</p>
                                ) : addressError ? (
                                    <p className="text-sm text-red-600">{addressError}</p>
                                ) : addresses.length === 0 ? (
                                    <div className="text-sm text-neutral-500 space-y-2">
                                        <p>Bạn chưa có địa chỉ nào đã lưu.</p>
                                        <p>
                                            <button
                                                className="font-medium text-neutral-900 underline underline-offset-2"
                                                onClick={() => navigate('/profile/addresses')}
                                            >
                                                Thêm địa chỉ vào hồ sơ
                                            </button>
                                            {' '}hoặc{' '}
                                            <button
                                                className="font-medium text-neutral-900 underline underline-offset-2"
                                                onClick={() => setAddressTab(TAB_MAP)}
                                            >
                                                chọn trên bản đồ
                                            </button>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => {
                                            const isSelected = addr.addressId === selectedAddressId
                                            const fullAddress = [
                                                addr.streetAddress,
                                                addr.ward,
                                                addr.district,
                                                addr.province,
                                            ]
                                                .filter(Boolean)
                                                .join(', ')
                                            return (
                                                <label
                                                    key={addr.addressId}
                                                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${isSelected
                                                            ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                                                            : 'border-neutral-200 hover:border-neutral-400'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="address"
                                                        value={addr.addressId}
                                                        checked={isSelected}
                                                        onChange={() => setSelectedAddressId(addr.addressId)}
                                                        className="mt-1 accent-neutral-900"
                                                    />
                                                    <div className="text-sm">
                                                        <div className="font-semibold text-neutral-900">
                                                            {addr.recipientName}
                                                            {addr.isDefault && (
                                                                <span className="ml-2 rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                                                    Mặc định
                                                                </span>
                                                            )}
                                                        </div>
                                                        {addr.phone && (
                                                            <div className="mt-0.5 text-neutral-600">{addr.phone}</div>
                                                        )}
                                                        <div className="mt-0.5 text-neutral-600">{fullAddress}</div>
                                                    </div>
                                                </label>
                                            )
                                        })}
                                    </div>
                                )}
                            </>
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

                        {/* Cảnh báo chưa chọn địa chỉ */}
                        {!isAddressReady && !addressLoading && (
                            <p className="mt-3 text-xs text-amber-600">
                                ⚠️ Vui lòng {addressTab === TAB_SAVED ? 'chọn địa chỉ nhận hàng' : 'chọn địa chỉ trên bản đồ'}.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={submitting || addressLoading || !isAddressReady}
                            className="mt-5 w-full rounded-xl bg-neutral-900 py-3 text-sm font-bold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? 'Đang xử lý…' : '✅ Xác nhận đặt hàng'}
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
