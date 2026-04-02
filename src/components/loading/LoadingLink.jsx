import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { startRouteLoading, stopRouteLoading } from '../../redux/slices/uiSlice'
import { useCallback } from 'react'

/**
 * Link đã được bọc loading cho thao tác điều hướng.
 * Khi click sẽ bật routeLoadingCount ngay lập tức và tự tắt sau timeout.
 */
export default function LoadingLink({
    to,
    children,
    className,
    durationMs = 300,
    onClick,
    ...rest
}) {
    const dispatch = useDispatch()

    const handleClick = useCallback(
        (e) => {
            dispatch(startRouteLoading())
            window.setTimeout(() => dispatch(stopRouteLoading()), durationMs)

            if (onClick) onClick(e)
        },
        [dispatch, durationMs, onClick]
    )

    return (
        <Link
            to={to}
            className={className}
            onClick={handleClick}
            {...rest}
        >
            {children}
        </Link>
    )
}

