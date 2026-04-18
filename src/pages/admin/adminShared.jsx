// Shared admin UI utilities — Premium Edition
import React, { useState, useRef, useEffect } from 'react'

/* ─── Shared style tokens ─────────────────────────────────────── */
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
    borderRadius: '6px',
    padding: '3px 9px',
    display: 'inline-block',
    letterSpacing: '0.02em',
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
    s
        ? new Date(s).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
          })
        : '—'

/* ─── Global admin shared styles ─────────────────────────────── */
export function AdminSharedStyles() {
    return (
        <style>{`
            @keyframes adminFadeUp {
                from { opacity: 0; transform: translateY(10px) scale(0.98); }
                to   { opacity: 1; transform: translateY(0)    scale(1); }
            }
            @keyframes adminBackdropIn {
                from { opacity: 0; }
                to   { opacity: 1; }
            }
            @keyframes adminSpinner {
                to { transform: rotate(360deg); }
            }

            .admin-input:focus {
                outline: none;
                border-color: #6366f1 !important;
                box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
                background: #fff !important;
            }
            .admin-select-native:focus {
                outline: none;
                border-color: #6366f1 !important;
                box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
            }
            .admin-btn-primary:hover {
                box-shadow: 0 4px 16px rgba(99,102,241,0.35) !important;
                transform: translateY(-1px) !important;
            }
            .admin-btn-primary:active { transform: translateY(0) !important; }
            .admin-btn-secondary:hover {
                background: #e9ecf0 !important;
                transform: translateY(-1px) !important;
            }
            .admin-btn-secondary:active { transform: translateY(0) !important; }
            .admin-btn-danger:hover {
                background: #fee2e2 !important;
                transform: translateY(-1px) !important;
            }
            .admin-btn-success:hover {
                background: #dcfce7 !important;
                transform: translateY(-1px) !important;
            }
            .admin-table-row:hover { background: #f8fafc !important; }
            .admin-table-row td { transition: background 0.12s ease; }

            .admin-search-wrap input:focus {
                outline: none;
                border-color: #6366f1 !important;
                box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
                background: #fff !important;
            }
            .admin-search-wrap input:focus + .search-icon-inner {
                color: #6366f1;
            }

            .admin-custom-select-trigger:hover {
                border-color: #c7d2fe !important;
                background: #fafafa !important;
            }
            .admin-custom-select-trigger:focus-within,
            .admin-custom-select-trigger.open {
                border-color: #6366f1 !important;
                box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
                background: #fff !important;
            }
            .admin-dropdown-option:hover {
                background: #eef2ff !important;
                color: #4338ca !important;
            }
            .admin-dropdown-option.selected {
                background: #e0e7ff !important;
                color: #4338ca !important;
                font-weight: 600;
            }
            .admin-toggle:hover { opacity: 0.85; }

            @media (prefers-reduced-motion: reduce) {
                .admin-modal-inner { animation: none !important; }
                .admin-backdrop    { animation: none !important; }
            }
        `}</style>
    )
}

/* ─── PageHeader ──────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '20px',
            }}
        >
            <div>
                <h1
                    style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#0f172a',
                        margin: 0,
                        letterSpacing: '-0.4px',
                    }}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>
                        {subtitle}
                    </p>
                )}
            </div>
            {action}
        </div>
    )
}

/* ─── Btn ─────────────────────────────────────────────────────── */
export function Btn({ children, onClick, variant = 'primary', small, style: s = {}, disabled }) {
    const base = {
        border: 'none',
        borderRadius: '9px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        fontSize: small ? '12px' : '13px',
        padding: small ? '5px 11px' : '9px 17px',
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        opacity: disabled ? 0.55 : 1,
        userSelect: 'none',
    }
    const variants = {
        primary: {
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(79,70,229,0.2)',
        },
        secondary: {
            background: '#f1f5f9',
            color: '#374151',
            border: '1px solid #e2e8f0',
        },
        danger: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
        },
        success: {
            background: '#f0fdf4',
            color: '#16a34a',
            border: '1px solid #bbf7d0',
        },
    }
    const className = `admin-btn-${variant}`
    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={className}
            style={{ ...base, ...variants[variant], ...s }}
        >
            {children}
        </button>
    )
}

/* ─── Table ───────────────────────────────────────────────────── */
export function Table({ columns, data, keyField = 'id', expandableRowRender }) {
    const [expandedIds, setExpandedIds] = useState([])

    const toggleExpand = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        )
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                        {expandableRowRender && (
                            <th style={{ width: '40px', padding: '11px 16px' }} />
                        )}
                        {columns.map((c) => (
                            <th
                                key={c.key}
                                style={{
                                    padding: '11px 16px',
                                    textAlign: 'left',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.07em',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {c.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, ri) => {
                        const id = row[keyField] ?? ri
                        const isExpanded = expandedIds.includes(id)
                        return (
                            <React.Fragment key={id}>
                                <tr
                                    className="admin-table-row"
                                    style={{
                                        borderTop: '1px solid #f1f5f9',
                                        background: isExpanded ? '#f8fafc' : 'transparent',
                                        cursor: expandableRowRender ? 'pointer' : 'default',
                                    }}
                                >
                                    {expandableRowRender && (
                                        <td
                                            style={{
                                                padding: '12px 16px',
                                                textAlign: 'center',
                                                color: '#64748b',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => toggleExpand(id)}
                                        >
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    transition: 'transform 0.2s',
                                                    transform: isExpanded
                                                        ? 'rotate(90deg)'
                                                        : 'rotate(0deg)',
                                                    fontSize: '10px',
                                                }}
                                            >
                                                ▶
                                            </span>
                                        </td>
                                    )}
                                    {columns.map((c) => (
                                        <td
                                            key={c.key}
                                            style={{
                                                padding: '12px 16px',
                                                fontSize: '13px',
                                                color: '#374151',
                                                ...c.cellStyle,
                                            }}
                                        >
                                            {c.render ? c.render(row[c.key], row) : row[c.key]}
                                        </td>
                                    ))}
                                </tr>
                                {isExpanded && expandableRowRender && (
                                    <tr>
                                        <td
                                            style={{ padding: 0 }}
                                            colSpan={columns.length + 1}
                                        >
                                            <div
                                                style={{
                                                    background: '#f8fafc',
                                                    padding: '0 16px 16px 16px',
                                                    borderTop: '1px dashed #e2e8f0',
                                                }}
                                            >
                                                {expandableRowRender(row)}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )
                    })}
                    {data.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length + (expandableRowRender ? 1 : 0)}
                                style={{
                                    textAlign: 'center',
                                    padding: '48px 16px',
                                    color: '#94a3b8',
                                    fontSize: '13px',
                                }}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

/* ─── SearchBar ───────────────────────────────────────────────── */
export function SearchBar({ value, onChange, placeholder = 'Tìm kiếm...' }) {
    return (
        <div className="admin-search-wrap" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            {/* Search icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="search-icon-inner"
                style={{
                    position: 'absolute',
                    left: '11px',
                    color: '#94a3b8',
                    pointerEvents: 'none',
                    transition: 'color 0.15s',
                    zIndex: 1,
                }}
            >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    paddingLeft: '34px',
                    paddingRight: '12px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '9px',
                    fontSize: '13px',
                    color: '#374151',
                    width: '240px',
                    background: '#f8fafc',
                    transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
                }}
            />
        </div>
    )
}

/* ─── Modal ───────────────────────────────────────────────────── */
export function Modal({ open, title, onClose, children, width = 480 }) {
    if (!open) return null
    return (
        <div
            className="admin-backdrop"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(15,23,42,0.45)',
                backdropFilter: 'blur(4px)',
                animation: 'adminBackdropIn 0.2s ease',
            }}
            onClick={onClose}
        >
            <div
                className="admin-modal-inner"
                style={{
                    background: '#fff',
                    borderRadius: '18px',
                    padding: '28px',
                    width,
                    maxWidth: 'calc(100vw - 32px)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow:
                        '0 32px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)',
                    animation: 'adminFadeUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '22px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '15px',
                            fontWeight: '700',
                            color: '#0f172a',
                            letterSpacing: '-0.2px',
                        }}
                    >
                        {title}
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none',
                            background: '#f1f5f9',
                            borderRadius: '8px',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.12s, color 0.12s',
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fee2e2'
                            e.currentTarget.style.color = '#dc2626'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f1f5f9'
                            e.currentTarget.style.color = '#64748b'
                        }}
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

/* ─── FormField ───────────────────────────────────────────────── */
export function FormField({ label, children, hint }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label
                style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px',
                    letterSpacing: '0.01em',
                }}
            >
                {label}
            </label>
            {children}
            {hint && (
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94a3b8' }}>{hint}</p>
            )}
        </div>
    )
}

/* ─── Input ───────────────────────────────────────────────────── */
export function Input({ value, onChange, placeholder, type = 'text', disabled }) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="admin-input"
            style={{
                width: '100%',
                padding: '9px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '9px',
                fontSize: '13px',
                color: '#1e293b',
                background: disabled ? '#f8fafc' : '#fff',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                boxSizing: 'border-box',
                cursor: disabled ? 'not-allowed' : 'text',
                opacity: disabled ? 0.65 : 1,
            }}
        />
    )
}

/* ─── Select (custom styled) ──────────────────────────────────── */
export function Select({ value, onChange, options }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    // Close on outside click
    useEffect(() => {
        if (!open) return
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    const selected = options.find((o) => String(o.value) === String(value)) ?? options[0]

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            {/* Trigger */}
            <div
                className={`admin-custom-select-trigger ${open ? 'open' : ''}`}
                onClick={() => setOpen((p) => !p)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '9px',
                    fontSize: '13px',
                    color: '#1e293b',
                    background: '#fff',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
                }}
            >
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selected?.label ?? '—'}
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        color: '#94a3b8',
                        flexShrink: 0,
                        transition: 'transform 0.18s ease',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        marginLeft: '6px',
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

            {/* Dropdown list */}
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                        zIndex: 200,
                        maxHeight: '220px',
                        overflowY: 'auto',
                        animation: 'adminFadeUp 0.15s ease',
                        padding: '4px',
                    }}
                >
                    {options.map((o) => (
                        <div
                            key={o.value}
                            className={`admin-dropdown-option ${String(o.value) === String(value) ? 'selected' : ''}`}
                            onClick={() => {
                                onChange(o.value)
                                setOpen(false)
                            }}
                            style={{
                                padding: '8px 12px',
                                fontSize: '13px',
                                color: '#374151',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'background 0.1s, color 0.1s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            {String(o.value) === String(value) && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ color: '#4f46e5', flexShrink: 0 }}
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                            <span style={{ marginLeft: String(o.value) !== String(value) ? '21px' : 0 }}>
                                {o.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ─── FilterSelect (for inline filter bars — native but styled) ─ */
export function FilterSelect({ value, onChange, options, placeholder }) {
    return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="admin-select-native"
                style={{
                    appearance: 'none',
                    padding: '8px 34px 8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '9px',
                    fontSize: '13px',
                    color: value ? '#1e293b' : '#94a3b8',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    fontFamily: 'inherit',
                }}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            {/* Chevron icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    position: 'absolute',
                    right: '10px',
                    color: '#94a3b8',
                    pointerEvents: 'none',
                }}
            >
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </div>
    )
}

/* ─── Toggle ──────────────────────────────────────────────────── */
export function Toggle({ checked, onChange }) {
    return (
        <div
            onClick={() => onChange(!checked)}
            className="admin-toggle"
            style={{
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                background: checked
                    ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                    : '#cbd5e1',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.22s ease',
                flexShrink: 0,
                boxShadow: checked ? '0 2px 8px rgba(79,70,229,0.3)' : 'none',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '3px',
                    left: checked ? '23px' : '3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                    transition: 'left 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            />
        </div>
    )
}

/** Simple hook — replaces Redux while mock data is used */
export function useMockState(initial) {
    return useState(initial)
}
