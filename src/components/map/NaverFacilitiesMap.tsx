// src/components/map/NaverFacilitiesMap.tsx
"use client"

import React from "react"
import { loadNaverMap } from "@/lib/naverMapLoader"

type Poi = { name: string; lat: number; lng: number; category?: string }

export type NaverFacilitiesMapProps = {
    /** Naver Cloud Platform 지도 client id (Vite: import.meta.env.VITE_NAVER_MAP_CLIENT_ID) */
    clientId: string
    /** 현장 좌표 (대략 동대구역 인근, 필요시 수정) */
    center: { lat: number; lng: number }
    /** 주변시설 목록 */
    pois?: Poi[]
    /** 초기 줌 */
    zoom?: number
    /** className / style 로 크기 제어할 컨테이너 */
    className?: string
    style?: React.CSSProperties
}

export const NaverFacilitiesMap: React.FC<NaverFacilitiesMapProps> = ({
                                                                          clientId,
                                                                          center,
                                                                          pois,
                                                                          zoom = 14,
                                                                          className,
                                                                          style,
                                                                      }) => {
    const wrapRef = React.useRef<HTMLDivElement>(null)
    const mapRef = React.useRef<any>(null)
    const [mapType, setMapType] = React.useState<"NORMAL" | "SATELLITE">("NORMAL")

    // 기본 샘플 POI (가까운 오프셋으로 분포시킴)
    const defaultPois: Poi[] = React.useMemo(() => {
        const off = (dx: number, dy: number) => ({
            lat: center.lat + dy * 0.01,
            lng: center.lng + dx * 0.01,
        })
        return [
            { name: "경북대학교", ...off(0.08, -0.02) },
            { name: "대구역", ...off(-0.08, -0.02) },
            { name: "동대구역", ...off(0.04, 0.0) },
            { name: "신세계백화점 대구", ...off(0.03, 0.01) },
            { name: "대구시청 별관", ...off(-0.05, -0.03) },
            { name: "칠성시장", ...off(-0.03, -0.01) },
            { name: "대구의료원", ...off(-0.06, 0.02) },
            { name: "대구은행", ...off(0.02, -0.05) },
            { name: "수성구청", ...off(0.09, -0.03) },
            { name: "대구교육대학교", ...off(0.06, -0.06) },
            { name: "국채보상공원", ...off(-0.02, -0.03) },
            { name: "동촌유원지", ...off(0.14, 0.03) },
            { name: "대구가톨릭대병원", ...off(-0.01, -0.06) },
            { name: "두류공원", ...off(-0.12, -0.08) },
            { name: "엑스코", ...off(0.02, 0.10) },
        ]
    }, [center])

    const poiData = pois && pois.length ? pois : defaultPois

    React.useEffect(() => {
        let map: any
        let markers: any[] = []
        let infoWindows: any[] = []
        let siteOverlay: any

        loadNaverMap(clientId).then((naver) => {
            if (!wrapRef.current) return
            map = new naver.maps.Map(wrapRef.current, {
                center: new naver.maps.LatLng(center.lat, center.lng),
                zoom,
                mapTypeId: naver.maps.MapTypeId[mapType],
                zoomControl: true,
                zoomControlOptions: { position: naver.maps.Position.LEFT_CENTER },
                scaleControl: true,
                logoControl: true,
                mapDataControl: false,
            })
            mapRef.current = map

            // 현장 라벨 (오렌지 타원)
            const $el = document.createElement("div")
            $el.style.cssText =
                "padding:4px 10px;border-radius:999px;border:2px solid #ff7a37;background:#fff;color:#ff7a37;font-weight:700;font-size:12px;box-shadow:0 1px 2px rgba(0,0,0,.1)"
            $el.innerText = "현장"
            siteOverlay = new naver.maps.CustomOverlay({
                position: new naver.maps.LatLng(center.lat, center.lng),
                content: $el,
                zIndex: 100,
                xAnchor: 0.5,
                yAnchor: 1.4,
            })

            siteOverlay.setMap(map)

            // 주변시설 마커
            poiData.forEach((p) => {
                const pin = document.createElement("div")
                pin.style.cssText =
                    "width:18px;height:18px;background:#2f3542;border-radius:50% 50% 50% 0;transform:rotate(45deg);box-shadow:0 1px 2px rgba(0,0,0,.25)"
                const m = new naver.maps.Marker({
                    position: new naver.maps.LatLng(p.lat, p.lng),
                    map,
                    icon: { content: pin, anchor: new naver.maps.Point(9, 18) },
                    zIndex: 10,
                })
                const iw = new naver.maps.InfoWindow({
                    content: `<div style="padding:6px 8px;font-size:12px;white-space:nowrap">${p.name}</div>`,
                    backgroundColor: "#fff",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    disableAnchor: true,
                })
                naver.maps.Event.addListener(m, "click", () => {
                    infoWindows.forEach((w) => w.close())
                    iw.open(map, m)
                })
                markers.push(m)
                infoWindows.push(iw)
            })
        })

        return () => {
            // 지도 언마운트 시 간단 정리
            markers.forEach((m) => m.setMap(null))
            infoWindows.forEach((w) => w.close())
            if (siteOverlay) siteOverlay.setMap(null)
            markers = []
            infoWindows = []
        }
    }, [clientId, center, zoom, poiData, mapType])

    return (
        <div className={["relative h-full w-full", className].filter(Boolean).join(" ")} style={style}>
            {/* 상단 좌측: 일반/위성 토글 */}
            <div className="absolute left-3 top-3 z-[1] flex gap-2">
                <button
                    onClick={() => setMapType("NORMAL")}
                    className={`rounded-md border px-2 py-1 text-xs ${mapType === "NORMAL" ? "bg-white" : "bg-white/70 hover:bg-white"}`}
                >
                    일반
                </button>
                <button
                    onClick={() => setMapType("SATELLITE")}
                    className={`rounded-md border px-2 py-1 text-xs ${mapType === "SATELLITE" ? "bg-white" : "bg-white/70 hover:bg-white"}`}
                >
                    위성
                </button>
            </div>

            {/* 네이버 지도 컨테이너 */}
            <div ref={wrapRef} className="absolute inset-0" />
        </div>
    )
}
