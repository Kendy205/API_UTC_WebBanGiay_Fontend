import React from 'react';

/**
 * Smart pagination with ellipsis:
 * Always shows: first, last, current ±2 neighbors, and "..." separators.
 */
function getPageRange(currentPage, totalPages) {
    const delta = 2;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push('...');
    if (totalPages > 1) range.push(totalPages);

    return range;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = getPageRange(currentPage, totalPages);

    return (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {/* Prev */}
            <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="flex h-10 min-w-[2.5rem] items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Trang trước"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
            </button>

            {/* Page numbers */}
            {pages.map((p, idx) =>
                p === '...' ? (
                    <span
                        key={`ellipsis-${idx}`}
                        className="flex h-10 w-10 items-center justify-center text-sm font-medium text-slate-400"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                            p === currentPage
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-600/20'
                                : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next */}
            <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="flex h-10 min-w-[2.5rem] items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Trang sau"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
        </div>
    );
}
