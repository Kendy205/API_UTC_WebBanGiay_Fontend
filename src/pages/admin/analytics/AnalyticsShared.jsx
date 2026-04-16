export const STATUS_COLORS_MAP = {
    Pending: '#f59e0b',
    Confirmed: '#6366f1',
    Shipping: '#3b82f6',
    Completed: '#10b981',
    Cancelled: '#ef4444',
}

export const BarChart = ({ data }) => {
    if (!data || data.length === 0)
        return (
            <div
                style={{
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    fontSize: '13px',
                }}
            >
                Không có dữ liệu
            </div>
        )
    const max = Math.max(...data.map((d) => d.revenue), 1)
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '6px',
                height: '140px',
                padding: '0 4px',
            }}
        >
            {data.map((d) => (
                <div
                    key={d.date}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    <div style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>
                        {d.revenue > 0 ? `${Math.round(d.revenue / 1000000)}M` : ''}
                    </div>
                    <div
                        style={{
                            width: '100%',
                            background: 'linear-gradient(180deg,#6366f1,#a855f7)',
                            borderRadius: '4px 4px 0 0',
                            flex: 'none',
                            height: `${Math.max(4, (d.revenue / max) * 110)}px`,
                            transition: 'height 0.4s ease',
                        }}
                    />
                    <div
                        style={{
                            fontSize: '9px',
                            color: '#94a3b8',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {d.date}
                    </div>
                </div>
            ))}
        </div>
    )
}

export const MonthChart = ({ data }) => {
    if (!data || data.length === 0)
        return (
            <div
                style={{
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    fontSize: '13px',
                }}
            >
                Không có dữ liệu
            </div>
        )
    const max = Math.max(...data.map((d) => d.revenue), 1)
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px' }}>
            {data.map((d) => (
                <div
                    key={d.month}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                        {d.revenue > 0 ? `${Math.round(d.revenue / 1000000)}M` : ''}
                    </div>
                    <div
                        style={{
                            width: '100%',
                            background:
                                d.revenue > 0 ? 'linear-gradient(180deg,#10b981,#34d399)' : '#f1f5f9',
                            borderRadius: '4px 4px 0 0',
                            height: `${Math.max(4, (d.revenue / max) * 90)}px`,
                        }}
                    />
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                        {d.month}
                    </div>
                </div>
            ))}
        </div>
    )
}
