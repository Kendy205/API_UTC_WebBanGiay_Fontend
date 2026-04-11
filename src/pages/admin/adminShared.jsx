// Shared admin UI utilities
import { useState } from 'react'

// ─── Shared styles ────────────────────────────────────────────
export const card = {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
}

export const badge = (color) => ({
    fontSize: '11px',
    fontWeight: '600',
    color,
    background: color + '18',
    borderRadius: '999px',
    padding: '3px 10px',
    display: 'inline-block',
})

export const STATUS_COLOR = {
    // orders
    Pending: '#f59e0b',
    Confirmed: '#6366f1',
    Shipping: '#3b82f6',
    Completed: '#10b981',
    Cancelled: '#ef4444',
    // payment
    Paid: '#10b981',
    Refunded: '#a855f7',
    // refund / review
    Approved: '#10b981',
    Rejected: '#ef4444',
}

export const fmt = (n) =>
    typeof n === 'number'
        ? n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
        : n

export const fmtDate = (s) =>
    s ? new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

// ─── Reusable components ──────────────────────────────────────

export function PageHeader({ title, subtitle, action }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
                <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>{title}</h1>
                {subtitle && <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>{subtitle}</p>}
            </div>
            {action}
        </div>
    )
}

export function Btn({ children, onClick, variant = 'primary', small, style: s = {} }) {
    const base = {
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: small ? '12px' : '13px',
        padding: small ? '6px 12px' : '9px 16px',
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
    }
    const variants = {
        primary: { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' },
        secondary: { background: '#f1f5f9', color: '#374151' },
        danger: { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' },
        success: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
    }
    return (
        <button onClick={onClick} style={{ ...base, ...variants[variant], ...s }}>
            {children}
        </button>
    )
}

export function Table({ columns, data, keyField = 'id' }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8fafc' }}>
                        {columns.map((c) => (
                            <th key={c.key} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                                {c.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, ri) => (
                        <tr key={row[keyField] ?? ri} style={{ borderTop: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            {columns.map((c) => (
                                <td key={c.key} style={{ padding: '11px 16px', fontSize: '13px', color: '#374151', ...c.cellStyle }}>
                                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8', fontSize: '13px' }}>Không có dữ liệu</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export function SearchBar({ value, onChange, placeholder = 'Tìm kiếm...' }) {
    return (
        <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '14px' }}>🔍</span>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{ paddingLeft: '36px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#374151', outline: 'none', width: '220px', background: '#f8fafc' }}
            />
        </div>
    )
}

export function Modal({ open, title, onClose, children, width = 480 }) {
    if (!open) return null
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}
        >
            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{title}</div>
                    <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '14px', color: '#64748b' }}>✕</button>
                </div>
                {children}
            </div>
        </div>
    )
}

export function FormField({ label, children }) {
    return (
        <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
            {children}
        </div>
    )
}

export function Input({ value, onChange, placeholder, type = 'text' }) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#374151', outline: 'none', boxSizing: 'border-box' }}
        />
    )
}

export function Select({ value, onChange, options }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#374151', outline: 'none', background: '#fff' }}
        >
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    )
}

export function Toggle({ checked, onChange }) {
    return (
        <div
            onClick={() => onChange(!checked)}
            style={{
                width: '44px', height: '24px', borderRadius: '12px',
                background: checked ? '#6366f1' : '#cbd5e1',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                flexShrink: 0,
            }}
        >
            <div style={{
                position: 'absolute', top: '3px', left: checked ? '23px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s',
            }} />
        </div>
    )
}

/** Simple hook – replaces Redux while mock data is used */
export function useMockState(initial) {
    return useState(initial)
}
