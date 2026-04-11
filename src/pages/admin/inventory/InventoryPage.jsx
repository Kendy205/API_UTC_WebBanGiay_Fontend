import { useState } from 'react'
import { MOCK_INVENTORY } from '../adminMockData'
import { PageHeader, Btn, Table, Modal, FormField, Input, useMockState, badge } from '../adminShared'

export default function InventoryPage() {
    const [items, setItems] = useMockState(MOCK_INVENTORY)
    const [filterLow, setFilterLow] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [stockVal, setStockVal] = useState('')
    const [thresholdVal, setThresholdVal] = useState('')

    const displayed = filterLow ? items.filter((x) => x.stock <= x.lowStockThreshold) : items

    const openEdit = (item) => {
        setEditItem(item)
        setStockVal(String(item.stock))
        setThresholdVal(String(item.lowStockThreshold))
    }
    const handleSave = () => {
        setItems((p) => p.map((x) => x.productId === editItem.productId
            ? { ...x, stock: Number(stockVal), lowStockThreshold: Number(thresholdVal) }
            : x
        ))
        setEditItem(null)
    }

    const cols = [
        { key: 'sku', label: 'SKU', render: (v) => <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6366f1' }}>{v}</span> },
        { key: 'productName', label: 'Sản phẩm', render: (v) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{v}</span> },
        {
            key: 'stock', label: 'Tồn kho',
            render: (v, row) => <span style={{ fontWeight: '700', color: v <= row.lowStockThreshold ? '#ef4444' : '#10b981', fontSize: '15px' }}>{v}</span>
        },
        { key: 'sold', label: 'Đã bán', render: (v) => <span style={{ color: '#64748b' }}>{v}</span> },
        { key: 'lowStockThreshold', label: 'Ngưỡng cảnh báo' },
        {
            key: '_status', label: 'Tình trạng',
            render: (_, row) => {
                const low = row.stock <= row.lowStockThreshold
                const out = row.stock === 0
                return <span style={badge(out ? '#ef4444' : low ? '#f59e0b' : '#10b981')}>
                    {out ? 'Hết hàng' : low ? 'Sắp hết' : 'Bình thường'}
                </span>
            }
        },
        {
            key: '_a', label: 'Thao tác', render: (_, row) => (
                <Btn small variant="secondary" onClick={() => openEdit(row)}>Cập nhật</Btn>
            )
        },
    ]

    return (
        <div>
            <PageHeader
                title="Tồn kho"
                subtitle={`${items.filter((x) => x.stock <= x.lowStockThreshold).length} sản phẩm sắp hết hàng`}
                action={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={filterLow} onChange={(e) => setFilterLow(e.target.checked)} />
                            Chỉ hiện sắp hết
                        </label>
                    </div>
                }
            />
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <Table columns={cols} data={displayed} keyField="productId" />
            </div>

            <Modal open={!!editItem} title="Cập nhật tồn kho" onClose={() => setEditItem(null)}>
                {editItem && (
                    <>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>{editItem.productName}</div>
                        <FormField label="Số lượng tồn kho"><Input type="number" value={stockVal} onChange={setStockVal} /></FormField>
                        <FormField label="Ngưỡng cảnh báo (sắp hết)"><Input type="number" value={thresholdVal} onChange={setThresholdVal} /></FormField>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                            <Btn variant="secondary" onClick={() => setEditItem(null)}>Hủy</Btn>
                            <Btn onClick={handleSave}>Lưu</Btn>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    )
}
