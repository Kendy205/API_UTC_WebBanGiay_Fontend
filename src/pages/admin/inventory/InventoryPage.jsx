import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { PageHeader, Btn, Modal, FormField, Select, badge, fmt } from '../adminShared'
import Pagination from '../../../components/common/Pagination'
import {
    fetchInventoryMovementsThunk,
    createInventoryMovementThunk,
    fetchAdminProductsThunk,
    fetchAdminColorsThunk,
    fetchAdminSizesThunk,
} from '../../../redux/actions/admin/adminProductAction'
import { setPage } from '../../../redux/slices/admin/adminProductSlice'

// ── Constants ─────────────────────────────────────────────────────────────────
const MOVEMENT_TYPES = [
    { value: 'IN',     label: '📦 Nhập hàng (IN)',         color: '#10b981' },
    { value: 'OUT',    label: '📤 Xuất hàng (OUT)',         color: '#ef4444' },
    { value: 'ADJUST', label: '⚙️ Điều chỉnh (ADJUST)',    color: '#f59e0b' },
]

const REF_TYPES = [
    { value: 'manual_adjust',  label: '✍️ Điều chỉnh thủ công' },
    { value: 'purchase_order', label: '🛒 Nhập từ nhà cung cấp' },
    { value: 'return',         label: '↩️ Hoàn hàng từ khách' },
    { value: 'order',          label: '📋 Xuất theo đơn hàng' },
]

const EMPTY_FORM = {
    variantId: '',
    movementType: 'IN',
    quantity: '',
    referenceType: 'manual_adjust',
    referenceId: '',
    note: '',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function typeBadge(type) {
    const found = MOVEMENT_TYPES.find(t => t.value === type)
    return (
        <span style={{
            fontSize: '11px', fontWeight: '700',
            color: found?.color ?? '#64748b',
            background: (found?.color ?? '#64748b') + '18',
            borderRadius: '999px', padding: '3px 10px', display: 'inline-block',
        }}>
            {type}
        </span>
    )
}

function fmtDate(dt) {
    if (!dt) return '—'
    return new Date(dt).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

function StatCard({ label, value, color, sub }) {
    return (
        <div style={{
            background: '#fff', borderRadius: '16px', padding: '20px 24px',
            border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', gap: '6px',
        }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color }}>{value}</div>
            {sub && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{sub}</div>}
        </div>
    )
}

// ── Input inline ──────────────────────────────────────────────────────────────
function Input({ value, onChange, placeholder, type = 'text', style = {} }) {
    return (
        <input
            type={type}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0',
                borderRadius: '8px', fontSize: '13px', outline: 'none',
                background: '#fff', boxSizing: 'border-box', ...style,
            }}
        />
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InventoryPage() {
    const dispatch = useDispatch()
    const {
        items: products,
        colors, sizes,
        inventory, inventoryTotal, inventoryPage, inventoryTotalPages, inventoryLoading,
        pageSize,
    } = useSelector(s => s.adminProduct)

    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [filterType, setFilterType] = useState('')
    const [search, setSearch] = useState('')

    // --- Load ---
    useEffect(() => {
        dispatch(fetchInventoryMovementsThunk({ page: inventoryPage, pageSize: 15 }))
    }, [dispatch, inventoryPage])

    useEffect(() => {
        dispatch(fetchAdminProductsThunk({ pageSize: 999 }))
        dispatch(fetchAdminColorsThunk())
        dispatch(fetchAdminSizesThunk())
    }, [dispatch])

    // --- Build variant options from products ---
    const allVariants = products.flatMap(p =>
        (p.productVariants || []).map(v => ({
            ...v,
            productName: p.productName,
            label: `[${p.productName}] ${v.colorName || '?'} - ${v.sizeLabel || v.sizeSystem || '?'} (SKU: ${v.sku})`,
        }))
    )

    // --- Stats ---
    const totalIN = inventory.filter(m => m.movementType === 'IN').reduce((s, m) => s + m.quantity, 0)
    const totalOUT = inventory.filter(m => m.movementType === 'OUT').reduce((s, m) => s + m.quantity, 0)
    const totalADJ = inventory.filter(m => m.movementType === 'ADJUST').length

    // --- Filter ---
    const filtered = inventory.filter(m => {
        const matchType = filterType ? m.movementType === filterType : true
        const matchSearch = search
            ? (m.sku || m.note || m.referenceType || '').toLowerCase().includes(search.toLowerCase())
            : true
        return matchType && matchSearch
    })

    // --- Form ---
    const f = k => v => setForm(prev => ({ ...prev, [k]: v }))

    const handleSubmit = async () => {
        if (!form.variantId) return message.warning('Vui lòng chọn biến thể sản phẩm!')
        if (!form.quantity || Number(form.quantity) <= 0) return message.warning('Số lượng phải lớn hơn 0!')

        try {
            await dispatch(createInventoryMovementThunk({
                variantId: Number(form.variantId),
                movementType: form.movementType,
                quantity: Number(form.quantity),
                referenceType: form.referenceType || null,
                referenceId: form.referenceId ? Number(form.referenceId) : null,
                note: form.note || null,
            })).unwrap()
            message.success('Tạo phiếu nhập/xuất kho thành công!')
            setShowModal(false)
            setForm(EMPTY_FORM)
            dispatch(fetchInventoryMovementsThunk({ page: inventoryPage, pageSize: 15 }))
        } catch (err) {
            message.error(err || 'Lỗi khi tạo phiếu kho!')
        }
    }

    return (
        <div>
            <PageHeader
                title="Quản lý Kho"
                subtitle={`${inventoryTotal} phiếu nhập/xuất kho`}
                action={<Btn onClick={() => setShowModal(true)}>+ Tạo phiếu kho</Btn>}
            />

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
                <StatCard label="Tổng nhập (trang này)" value={`+${totalIN}`} color="#10b981" sub="Tổng số lượng các phiếu IN" />
                <StatCard label="Tổng xuất (trang này)" value={`-${totalOUT}`} color="#ef4444" sub="Tổng số lượng các phiếu OUT" />
                <StatCard label="Điều chỉnh (trang này)" value={totalADJ} color="#f59e0b" sub="Số phiếu ADJUST" />
            </div>

            {/* Filters */}
            <div style={{
                background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9',
                overflow: 'hidden', marginBottom: '0',
            }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="🔍 Tìm theo SKU, ghi chú, loại tài liệu..."
                        style={{
                            flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0',
                            borderRadius: '8px', fontSize: '13px', outline: 'none',
                        }}
                    />
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        style={{
                            padding: '8px 12px', border: '1px solid #e2e8f0',
                            borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none',
                        }}
                    >
                        <option value="">Tất cả loại</option>
                        {MOVEMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['#', 'Biến thể (Variant ID)', 'Loại', 'Số lượng', 'Loại tài liệu', 'Ref ID', 'Ghi chú', 'Thời gian'].map(h => (
                                    <th key={h} style={{
                                        padding: '10px 14px', textAlign: 'left',
                                        fontSize: '11px', fontWeight: '700', color: '#64748b',
                                        textTransform: 'uppercase', letterSpacing: '0.05em',
                                        borderBottom: '1px solid #f1f5f9',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryLoading ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                        Chưa có phiếu kho nào
                                    </td>
                                </tr>
                            ) : filtered.map((m, i) => (
                                <tr
                                    key={m.movementId}
                                    style={{
                                        borderBottom: '1px solid #f8fafc',
                                        background: i % 2 === 0 ? '#fff' : '#fafbfc',
                                        transition: 'background 0.1s',
                                    }}
                                >
                                    <td style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: '600' }}>
                                        #{m.movementId}
                                    </td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <div style={{ fontWeight: '600', color: '#334155' }}>Variant #{m.variantId}</div>
                                        {m.sku && <div style={{ fontSize: '11px', color: '#94a3b8' }}>SKU: {m.sku}</div>}
                                    </td>
                                    <td style={{ padding: '10px 14px' }}>{typeBadge(m.movementType)}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span style={{
                                            fontWeight: '700', fontSize: '14px',
                                            color: m.movementType === 'IN' ? '#10b981' : m.movementType === 'OUT' ? '#ef4444' : '#f59e0b',
                                        }}>
                                            {m.movementType === 'IN' ? '+' : m.movementType === 'OUT' ? '-' : '~'}{m.quantity}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', borderRadius: '6px', padding: '2px 8px' }}>
                                            {m.referenceType ?? '—'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 14px', color: '#64748b' }}>
                                        {m.referenceId ?? '—'}
                                    </td>
                                    <td style={{ padding: '10px 14px', color: '#64748b', maxWidth: '200px' }}>
                                        <span title={m.note}>{m.note ? (m.note.length > 40 ? m.note.slice(0, 40) + '...' : m.note) : '—'}</span>
                                    </td>
                                    <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: '12px' }}>
                                        {fmtDate(m.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <Pagination
                        currentPage={inventoryPage}
                        totalPages={inventoryTotalPages}
                        onPageChange={(p) => dispatch(setPage(p))}
                    />
                </div>
            </div>

            {/* ── Modal tạo phiếu ── */}
            <Modal
                open={showModal}
                title="Tạo phiếu nhập / xuất kho"
                onClose={() => { setShowModal(false); setForm(EMPTY_FORM) }}
                width={560}
            >
                {/* Loại phiếu */}
                <FormField label="Loại phiếu *">
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {MOVEMENT_TYPES.map(t => (
                            <button
                                key={t.value}
                                onClick={() => f('movementType')(t.value)}
                                style={{
                                    padding: '8px 16px', borderRadius: '8px', border: '2px solid',
                                    borderColor: form.movementType === t.value ? t.color : '#e2e8f0',
                                    background: form.movementType === t.value ? t.color + '18' : '#fff',
                                    color: form.movementType === t.value ? t.color : '#64748b',
                                    fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </FormField>

                {/* Biến thể */}
                <FormField label="Biến thể sản phẩm *">
                    <Select
                        value={String(form.variantId)}
                        onChange={f('variantId')}
                        options={[
                            { value: '', label: '-- Chọn biến thể --' },
                            ...allVariants.map(v => ({ value: String(v.variantId), label: v.label }))
                        ]}
                    />
                </FormField>

                {/* Số lượng */}
                <FormField label="Số lượng *">
                    <Input type="number" value={form.quantity} onChange={f('quantity')} placeholder="VD: 50" />
                </FormField>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {/* Loại tài liệu */}
                    <FormField label="Loại tài liệu">
                        <Select
                            value={form.referenceType}
                            onChange={f('referenceType')}
                            options={REF_TYPES.map(r => ({ value: r.value, label: r.label }))}
                        />
                    </FormField>

                    {/* Reference ID */}
                    <FormField label="Ref ID (Mã đơn hàng...)">
                        <Input type="number" value={form.referenceId} onChange={f('referenceId')} placeholder="VD: 123" />
                    </FormField>
                </div>

                {/* Ghi chú */}
                <FormField label="Ghi chú">
                    <textarea
                        value={form.note}
                        onChange={e => f('note')(e.target.value)}
                        placeholder="VD: Nhập hàng đợt 3 tháng 4/2026..."
                        rows={3}
                        style={{
                            width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0',
                            borderRadius: '8px', fontSize: '13px', outline: 'none',
                            resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
                        }}
                    />
                </FormField>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                    <Btn variant="secondary" onClick={() => { setShowModal(false); setForm(EMPTY_FORM) }}>Hủy</Btn>
                    <Btn onClick={handleSubmit}>Lưu phiếu kho</Btn>
                </div>
            </Modal>
        </div>
    )
}
