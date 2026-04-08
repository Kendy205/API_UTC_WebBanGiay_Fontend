import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../../redux/actions/ProductAction';
import ProductCard from './ProductCard';
import Skeleton from '../loading/Skeleton';
import Pagination from '../common/Pagination';

export default function ProductList() {
    const { products, error } = useSelector((state) => state.product)
    const isApiLoading = useSelector((state) => state.ui.loadingCount > 0)
    //console.log(isApiLoading)

    const dispatch = useDispatch();
    const [page, setPage] = useState(1)
    const pageSize = 8
    const [isPageLoading, setIsPageLoading] = useState(false)
    const goToPage = (nextPage) => {
        setIsPageLoading(true)
        setPage(nextPage)
        setTimeout(() => setIsPageLoading(false), 300)
    }
    const showSkeleton = isPageLoading || isApiLoading
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch])

    const totalItems = products?.length ?? 0
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const safePage = Math.min(Math.max(1, page), totalPages)

    const pagedProducts = useMemo(() => {
        const start = (safePage - 1) * pageSize
        return (products ?? []).slice(start, start + pageSize)
    }, [products, safePage])

    return (
        <div className="mx-auto max-w-6xl px-4 flex flex-col min-h-[calc(100vh-150px)]">
            <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900">
                        Danh sách sản phẩm
                    </h1>
                    <p className="text-sm text-neutral-600">
                        Tổng: {totalItems} sản phẩm
                    </p>
                </div>
                <div className="text-sm text-neutral-600">
                    Trang {safePage}/{totalPages}
                </div>
            </div>

            {error && (
                <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    Lỗi: {error}
                </p>
            )}

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {showSkeleton
                    ? Array.from({ length: pageSize }).map((_, idx) => (
                        <li key={idx}>
                            <Skeleton />
                        </li>
                    ))
                    : pagedProducts.map((product) => (
                        <ProductCard
                            key={product.productId ?? product.id}
                            product={product}
                        />
                    ))}
            </ul>

            <div className="mt-auto pb-6">
                <Pagination 
                    currentPage={safePage} 
                    totalPages={totalPages} 
                    onPageChange={goToPage} 
                />
            </div>
        </div>
    )
}
