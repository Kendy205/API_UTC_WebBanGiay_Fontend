import ProductList from "../../components/shoes/ProductList";

export default function HomePage() {
    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-xl font-semibold text-neutral-900">
                Trang chủ (USER)
            </h1>
            <p className="text-neutral-600">
                <ProductList>

                </ProductList>
            </p>
        </div>
    )
}

