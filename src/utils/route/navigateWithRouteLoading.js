import { startRouteLoading, stopRouteLoading } from '../../redux/slices/uiSlice'

/**
 * Wrapper để bọc navigate bằng loading khi click route.
 * - Dùng riêng cho thao tác điều hướng (không phụ thuộc API).
 * - Tự tắt theo timeout để không bị kẹt.
 */
export function navigateWithRouteLoading({
    dispatch,
    navigate,
    to,
    options,
    durationMs = 100,
}) {
    dispatch(startRouteLoading())
    const timerId = setTimeout(() => {
        dispatch(stopRouteLoading())
    }, durationMs)

    // Trả timerId để bạn clear nếu cần
    navigate(to, options)
    return timerId
}

