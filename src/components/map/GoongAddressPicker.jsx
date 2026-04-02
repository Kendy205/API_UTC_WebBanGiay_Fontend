import React, { useState } from 'react';
import axios from 'axios';
import Map, { Marker } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ BẢN ĐỒ KHÔNG BỊ VỠ VỤN

const GoongAddressPicker = ({ onAddressSelected }) => {
    // 1. Lấy Key từ file .env (Giữ nguyên như cũ)
    const TILES_KEY = import.meta.env.VITE_GOONG_TILES_KEY;
    const API_KEY = import.meta.env.VITE_GOONG_API_KEY;

    // 2. State quản lý
    const [viewState, setViewState] = useState({
        longitude: 105.8542, // Mặc định Hà Nội
        latitude: 21.0285,
        zoom: 14
    });

    const [markerPos, setMarkerPos] = useState({
        longitude: 105.8542,
        latitude: 21.0285
    });

    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // 3. Hàm xử lý gõ tìm kiếm (Giữ nguyên)
    const handleInputChange = async (e) => {
        const value = e.target.value;
        setSearchText(value);

        if (value.length > 2) {
            try {
                const response = await axios.get(
                    `https://rsapi.goong.io/Place/AutoComplete?api_key=${API_KEY}&input=${encodeURIComponent(value)}`
                );
                setSuggestions(response.data.predictions || []);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Lỗi gọi API Goong:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    // 4. Hàm xử lý khi chọn địa chỉ (Giữ nguyên logic)
    const handleSelectSuggestion = async (place) => {
        setSearchText(place.description);
        setShowSuggestions(false);

        try {
            const detailRes = await axios.get(
                `https://rsapi.goong.io/Place/Detail?api_key=${API_KEY}&place_id=${place.place_id}`
            );

            const location = detailRes.data.result.geometry.location;

            // Cập nhật vị trí bản đồ và ghim
            setViewState({
                longitude: location.lng,
                latitude: location.lat,
                zoom: 16
            });

            setMarkerPos({
                longitude: location.lng,
                latitude: location.lat
            });

            if (onAddressSelected) {
                onAddressSelected({
                    address: place.description,
                    lat: location.lat,
                    lng: location.lng
                });
            }
        } catch (error) {
            alert("Không thể lấy chi tiết địa chỉ này!");
        }
    };

    // Đường dẫn bản đồ của Goong
    const goongMapStyleUrl = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${TILES_KEY}`;

    return (
        <div style={{ width: '100%', position: 'relative', marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                Địa chỉ giao hàng:
            </label>

            <div style={{ position: 'relative', zIndex: 10 }}>
                <input
                    type="text"
                    value={searchText}
                    onChange={handleInputChange}
                    placeholder="Gõ để tìm địa chỉ nhà bạn..."
                    style={{
                        width: '100%', padding: '12px', borderRadius: '6px',
                        border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box'
                    }}
                />

                {showSuggestions && suggestions.length > 0 && (
                    <ul style={{
                        position: 'absolute', top: '100%', left: 0, right: 0,
                        backgroundColor: 'white', border: '1px solid #ddd',
                        listStyle: 'none', padding: 0, margin: 0,
                        maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        {suggestions.map((item) => (
                            <li
                                key={item.place_id}
                                onClick={() => handleSelectSuggestion(item)}
                                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                            >
                                {item.description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Bản đồ dùng lõi MapLibre siêu mượt, data Goong */}
            <div style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden', height: '350px' }}>
                <Map
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle={goongMapStyleUrl}
                    mapLib={maplibregl}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Marker longitude={markerPos.longitude} latitude={markerPos.latitude} anchor="bottom">
                        <div style={{ color: 'red', fontSize: '32px', transform: 'translateY(-10px)' }}>📍</div>
                    </Marker>
                </Map>
            </div>
        </div>
    );
};

export default GoongAddressPicker;