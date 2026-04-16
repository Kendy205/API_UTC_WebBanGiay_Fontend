import React from 'react';
import { Link } from 'react-router-dom';

export default function HistoryOrderItem({ item, openReviewModal }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount || 0)
    }

    const image = item.imageUrlSnapshot || item.imageUrl || item.image || 'https://placehold.co/150x150?text=No+Image';

    return (
        <div className="flex gap-4 items-start border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
            <div className="w-20 h-20 flex-shrink-0">
                <img
                    src={image}
                    alt={item.productNameSnapshot || 'Product'}
                    className="w-full h-full object-cover rounded border border-neutral-200"
                />
            </div>
            <div className="flex-1">
                <Link
                    to={`/products/${item.productId || item.productIdSnapshot || 0}`}
                    className="font-medium text-neutral-900 hover:text-blue-600 transition-colors inline-block mb-1"
                >
                    {item.productNameSnapshot}
                </Link>
                <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 mb-1">
                    {item.colorNameSnapshot && (
                        <span>Màu: <span className="text-neutral-700 font-medium">{item.colorNameSnapshot}</span></span>
                    )}
                    {item.colorNameSnapshot && item.sizeLabelSnapshot && <span>|</span>}
                    {item.sizeLabelSnapshot && (
                        <span>Size: <span className="text-neutral-700 font-medium">{item.sizeLabelSnapshot}</span></span>
                    )}
                </div>
                <p className="text-sm font-medium text-neutral-700">x{item.quantity}</p>
            </div>
            <div className="text-right flex flex-col justify-between items-end gap-2 h-full min-h-[5rem]">
                <p className="font-semibold text-red-600">{formatCurrency(item.unitPrice)}</p>
                {openReviewModal && (
                    <button
                        onClick={() => openReviewModal(item)}
                        className="text-sm text-blue-600 hover:underline px-3 py-1.5 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded transition-colors mt-auto"
                    >
                        Đánh giá
                    </button>
                )}
            </div>
        </div>
    );
}
