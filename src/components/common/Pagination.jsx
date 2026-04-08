import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Trước
            </button>

            {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                const p = i + 1;
                const active = p === currentPage;
                return (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        className={`rounded px-3 py-1.5 text-sm font-medium ${
                            active
                                ? 'bg-neutral-900 text-white'
                                : 'border border-neutral-300 bg-white text-neutral-900'
                        }`}
                    >
                        {p}
                    </button>
                );
            })}

            {totalPages > 7 && (
                <span className="px-2 text-sm text-neutral-500">…</span>
            )}

            <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Sau
            </button>
        </div>
    );
}
