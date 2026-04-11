import { useState } from 'react'
import { MOCK_SETTINGS } from '../adminMockData'
import { PageHeader, Btn, FormField, Input, Toggle } from '../adminShared'

export default function SettingsPage() {
    const [form, setForm] = useState({ ...MOCK_SETTINGS })
    const [saved, setSaved] = useState(false)

    const f = (k) => (v) => { setForm((p) => ({ ...p, [k]: v })); setSaved(false) }

    const handleSave = () => {
        // dispatch(updateAdminSettingsThunk(form))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const Section = ({ title, children }) => (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>{title}</div>
            {children}
        </div>
    )

    return (
        <div style={{ maxWidth: '640px' }}>
            <PageHeader title="Cài đặt hệ thống" subtitle="Cấu hình chung cho cửa hàng" />

            <Section title="🏪 Thông tin cửa hàng">
                <FormField label="Tên cửa hàng"><Input value={form.siteName} onChange={f('siteName')} placeholder="ShopApp" /></FormField>
                <FormField label="Email hỗ trợ"><Input type="email" value={form.contactEmail} onChange={f('contactEmail')} /></FormField>
                <FormField label="Đơn vị tiền tệ"><Input value={form.currency} onChange={f('currency')} /></FormField>
            </Section>

            <Section title="🚚 Vận chuyển & Thuế">
                <FormField label="Miễn phí vận chuyển từ (VND)"><Input type="number" value={form.freeShippingThreshold} onChange={(v) => f('freeShippingThreshold')(Number(v))} /></FormField>
                <FormField label="Thuế suất mặc định (%)"><Input type="number" value={form.defaultTaxRate} onChange={(v) => f('defaultTaxRate')(Number(v))} /></FormField>
                <FormField label="Ngưỡng cảnh báo tồn kho"><Input type="number" value={form.lowStockThreshold} onChange={(v) => f('lowStockThreshold')(Number(v))} /></FormField>
            </Section>

            <Section title="⚙️ Tính năng hệ thống">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>Chế độ bảo trì</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Tạm dừng truy cập từ khách hàng</div>
                        </div>
                        <Toggle checked={form.maintenanceMode} onChange={f('maintenanceMode')} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>Cho phép đăng ký</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Người dùng mới có thể tạo tài khoản</div>
                        </div>
                        <Toggle checked={form.allowRegistration} onChange={f('allowRegistration')} />
                    </div>
                </div>
            </Section>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Btn onClick={handleSave}>💾 Lưu thay đổi</Btn>
                {saved && <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>✓ Đã lưu thành công!</div>}
            </div>
        </div>
    )
}
