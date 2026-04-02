import React from 'react'
import { useSelector } from 'react-redux'


export default function Loading() {

    const { loadingCount, routeLoadingCount } = useSelector((state) => state.ui)
    const isLoading = loadingCount > 0 || routeLoadingCount > 0

    if (!isLoading) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-neutral-900 dark:border-violet-600" />
        </div>
    )
}