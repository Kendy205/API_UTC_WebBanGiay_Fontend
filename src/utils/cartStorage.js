const CART_KEY = 'cart'

export function readCartFromStorage() {
    try {
        const raw = localStorage.getItem(CART_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export function writeCartToStorage(items) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items ?? []))
    } catch {
        /* ignore */
    }
}

export function clearCartStorage() {
    try {
        localStorage.removeItem(CART_KEY)
    } catch {
        /* ignore */
    }
}

