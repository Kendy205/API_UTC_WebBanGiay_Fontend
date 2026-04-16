import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { resetOrderState } from '../../redux/slices/user/orderSlice'

/**
 * VnpayReturnPage
 * Route: /vnpay-return
 *
 * VNPay sẽ redirect trình duyệt về URL này sau khi người dùng hoàn tất (hoặc huỷ) thanh toán.
 * Ví dụ URL nhận được:
 *   http://localhost:5173/vnpay-return?vnp_Amount=50000000&vnp_ResponseCode=00&vnp_TxnRef=15&...
 *
 * Trang chỉ đọc query params và hiển thị kết quả visual.
 * Việc xác nhận "thật" (verify chữ ký, cập nhật DB) do backend thực hiện qua IPN hoặc Return URL API.
 */
export default function VnpayReturnPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Các tham số VNPay trả về
    const responseCode = searchParams.get('vnp_ResponseCode')   // '00' = thành công
    const txnRef = searchParams.get('vnp_TxnRef')               // orderId
    const transactionNo = searchParams.get('vnp_TransactionNo') // Mã GD VNPay
    const amountRaw = searchParams.get('vnp_Amount')            // Số tiền × 100
    const bankCode = searchParams.get('vnp_BankCode')           // Ngân hàng
    const payDate = searchParams.get('vnp_PayDate')             // YYYYMMDDHHmmss
    const orderInfo = searchParams.get('vnp_OrderInfo')

    const isSuccess = responseCode === '00'

    // Format tiền (VNPay gửi amount đã × 100)
    const amount = amountRaw
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              Number(amountRaw) / 100
          )
        : null

    // Format ngày thanh toán (YYYYMMDDHHmmss → readable)
    const formatPayDate = (raw) => {
        if (!raw || raw.length < 14) return null
        const y = raw.slice(0, 4)
        const mo = raw.slice(4, 6)
        const d = raw.slice(6, 8)
        const h = raw.slice(8, 10)
        const mi = raw.slice(10, 12)
        const s = raw.slice(12, 14)
        return `${d}/${mo}/${y} ${h}:${mi}:${s}`
    }

    const paidAt = formatPayDate(payDate)

    // Map mã lỗi VNPay thường gặp
    const ERROR_MESSAGES = {
        '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan đến lừa đảo, giao dịch bất thường).',
        '09': 'Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking.',
        '10': 'Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.',
        '11': 'Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao dịch.',
        '12': 'Thẻ/Tài khoản của khách hàng bị khoá.',
        '13': 'Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Vui lòng thực hiện lại giao dịch.',
        '24': 'Khách hàng huỷ giao dịch.',
        '51': 'Tài khoản không đủ số dư để thực hiện giao dịch.',
        '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.',
        '75': 'Ngân hàng thanh toán đang bảo trì.',
        '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định. Vui lòng thực hiện lại giao dịch.',
        '99': 'Lỗi không xác định. Vui lòng liên hệ hỗ trợ.',
    }

    const errorMessage =
        !isSuccess
            ? ERROR_MESSAGES[responseCode] ?? `Giao dịch thất bại (Mã: ${responseCode ?? 'N/A'})`
            : null

    const handleGoHome = () => {
        dispatch(resetOrderState())
        navigate('/')
    }

    const handleGoOrders = () => {
        dispatch(resetOrderState())
        navigate('/order-history')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                {/* ── Icon + tiêu đề ── */}
                <div className="text-center mb-8">
                    <div
                        className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full text-5xl shadow-lg transition-transform ${
                            isSuccess
                                ? 'bg-green-100 animate-bounce-once'
                                : 'bg-red-100'
                        }`}
                    >
                        {isSuccess ? '✅' : '❌'}
                    </div>
                    <h1
                        className={`text-2xl font-bold ${
                            isSuccess ? 'text-green-700' : 'text-red-700'
                        }`}
                    >
                        {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                    </h1>
                    {isSuccess ? (
                        <p className="mt-2 text-sm text-slate-500">
                            Cảm ơn bạn đã mua hàng. Đơn hàng đang được xử lý.
                        </p>
                    ) : (
                        <p className="mt-2 text-sm text-slate-500">
                            {errorMessage}
                        </p>
                    )}
                </div>

                {/* ── Thẻ thông tin giao dịch ── */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">

                    {/* Header thẻ */}
                    <div
                        className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide ${
                            isSuccess
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                        }`}
                    >
                        Chi tiết giao dịch VNPay
                    </div>

                    <div className="divide-y divide-slate-100">
                        {txnRef && (
                            <Row label="Mã đơn hàng" value={`#${txnRef}`} bold />
                        )}
                        {transactionNo && (
                            <Row label="Mã giao dịch VNPay" value={transactionNo} />
                        )}
                        {amount && (
                            <Row label="Số tiền" value={amount} bold className="text-indigo-600" />
                        )}
                        {bankCode && (
                            <Row label="Ngân hàng" value={bankCode} />
                        )}
                        {paidAt && (
                            <Row label="Thời gian" value={paidAt} />
                        )}
                        {orderInfo && (
                            <Row label="Nội dung" value={decodeURIComponent(orderInfo)} />
                        )}
                        <Row
                            label="Trạng thái"
                            value={isSuccess ? 'Thành công' : 'Thất bại'}
                            valueClass={isSuccess ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}
                        />
                    </div>
                </div>

                {/* ── Nút điều hướng ── */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        onClick={handleGoOrders}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
                    >
                        📋 Xem lịch sử đơn hàng
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        🏠 Về trang chủ
                    </button>
                    {!isSuccess && (
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:col-span-2"
                        >
                            🛒 Quay lại giỏ hàng
                        </button>
                    )}
                </div>

                {/* Note nhỏ */}
                <p className="mt-6 text-center text-xs text-slate-400">
                    Kết quả được xác nhận bởi VNPay và hệ thống của chúng tôi.
                </p>
            </div>
        </div>
    )
}

/** Helper component cho mỗi hàng thông tin */
function Row({ label, value, bold, valueClass }) {
    return (
        <div className="flex items-center justify-between gap-4 px-5 py-3">
            <span className="text-sm text-slate-500 shrink-0">{label}</span>
            <span
                className={`text-sm text-right break-all ${
                    bold ? 'font-semibold text-slate-800' : 'text-slate-700'
                } ${valueClass ?? ''}`}
            >
                {value}
            </span>
        </div>
    )
}
