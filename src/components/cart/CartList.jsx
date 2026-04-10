import CartItem from './CartItem'

export default function CartList({ items }) {
    if (items.length === 0) {
        return (
            <div className="rounded border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                Giỏ hàng đang trống.
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <CartItem key={item.variantId} item={item} />
            ))}
        </div>
    )
}
