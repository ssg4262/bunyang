// src/components/sections/HouseTypeSelector.tsx
"use client"

import React, { useRef } from "react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import h79A from "@/assets/main/houseType/79A.png"

type HouseType = {
    label: string
    areaM2: number
    units: number
    image: string
    details: {
        전용: number
        주거공용: number
        공급: number
        기타공용: number
        계약: number
    }
}

export const HouseTypeSelector: React.FC = () => {
    const [selected, setSelected] = React.useState(0)
    const [usePyung, setUsePyung] = React.useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const types: HouseType[] = [
        {
            label: "79m²A형",
            areaM2: 79.774,
            units: 132,
            image: h79A,
            details: {
                전용: 79.774,
                주거공용: 23.1942,
                공급: 102.9682,
                기타공용: 51.8436,
                계약: 154.8118,
            },
        },
        {
            label: "79m²B형",
            areaM2: 79.7740,
            units: 120,
            image: "/images/type-79b.png",
            details: {
                전용: 79.7740,
                주거공용: 23.1942,
                공급: 102.9682,
                기타공용: 51.8436,
                계약: 154.8118,
            },
        },
        {
            label: "84m²A형",
            areaM2: 84.82,
            units: 130,
            image: "/images/type-84a.png",
            details: {
                전용: 84.82,
                주거공용: 25.31,
                공급: 110.13,
                기타공용: 53.55,
                계약: 163.68,
            },
        },
        {
            label: "84m²B형",
            areaM2: 84.65,
            units: 98,
            image: "/images/type-84b.png",
            details: {
                전용: 84.65,
                주거공용: 25.1,
                공급: 109.75,
                기타공용: 53.4,
                계약: 163.15,
            },
        },
        {
            label: "84m²C형",
            areaM2: 84.6,
            units: 90,
            image: "/images/type-84c.png",
            details: {
                전용: 84.6,
                주거공용: 25.0,
                공급: 109.6,
                기타공용: 53.2,
                계약: 162.8,
            },
        },
        {
            label: "107m²A형",
            areaM2: 107.42,
            units: 70,
            image: "/images/type-107a.png",
            details: {
                전용: 107.42,
                주거공용: 30.11,
                공급: 137.53,
                기타공용: 61.92,
                계약: 199.45,
            },
        },
        {
            label: "107m²B형",
            areaM2: 107.2,
            units: 60,
            image: "/images/type-107b.png",
            details: {
                전용: 107.2,
                주거공용: 29.9,
                공급: 137.1,
                기타공용: 61.5,
                계약: 198.6,
            },
        },
        {
            label: "125m²A형",
            areaM2: 125,
            units: 45,
            image: "/images/type-125a.png",
            details: {
                전용: 125,
                주거공용: 34.5,
                공급: 159.5,
                기타공용: 65.8,
                계약: 225.3,
            },
        },
    ]

    const active = types[selected]
    const ratio = 3.3058
    const convert = (v: number) => (usePyung ? (v / ratio).toFixed(2) + "평" : v.toFixed(4) + "m²")

    const scrollBy = (dir: "left" | "right") => {
        if (!scrollRef.current) return
        const container = scrollRef.current
        const amount = container.clientWidth * 0.6
        container.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
    }

    return (
        <section className="w-full bg-white py-12 md:py-16 text-center">
            <div className="container mx-auto px-6 max-w-6xl flex flex-col items-center">
                {/* 헤드라인 */}
                <div className="mb-10">
                    <div className="text-gray-400 text-3xl mb-2">“</div>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">
                        트렌디한 주거문화를 선도하는 혁신 주거평면 C2 House
                    </h2>
                    <div className="text-gray-400 text-3xl">”</div>
                </div>

                {/* 탭 바 */}
                <div className="relative w-full border-y border-gray-200 bg-gray-50">
                    <button
                        onClick={() => scrollBy("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 px-2 bg-gradient-to-r from-gray-50 to-transparent h-full flex items-center"
                    >
                        <ChevronLeft className="text-gray-400 hover:text-orange-500 transition h-5 w-5" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
                    >
                        {types.map((t, i) => (
                            <button
                                key={t.label}
                                onClick={() => setSelected(i)}
                                className={cn(
                                    "flex-shrink-0 px-6 py-3 text-sm md:text-base font-medium transition-all snap-start whitespace-nowrap",
                                    i === selected
                                        ? "bg-[#FF5A1F] text-white"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => scrollBy("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 px-2 bg-gradient-to-l from-gray-50 to-transparent h-full flex items-center"
                    >
                        <ChevronRight className="text-gray-400 hover:text-orange-500 transition h-5 w-5" />
                    </button>
                </div>

                {/* 선택 정보 */}
                <div className="mt-12 flex flex-col items-center gap-3">
                    <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                        {usePyung
                            ? (active.areaM2 / ratio).toFixed(1) + "평형"
                            : active.areaM2 + "m²형"}
                    </h3>
                    <p className="text-gray-500 text-lg">{active.units}세대</p>
                </div>

                {/* 단위 토글 */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span>㎡ (전용면적)</span>
                    <Switch checked={usePyung} onCheckedChange={setUsePyung} />
                    <span>평 (공급면적)</span>
                </div>

                {/* 이미지 */}
                <div className="mt-12 w-full flex justify-center">
                    <img
                        src={active.image}
                        alt={active.label}
                        className="w-full max-w-3xl mx-auto rounded-md"
                    />
                </div>

                {/* 상세 면적 */}
                <div className="mt-12 w-full max-w-4xl border-t border-b border-gray-300 py-6 text-left text-gray-700 text-sm md:text-base">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 px-4">
                        <div>주거 전용면적 <span className="font-semibold">{convert(active.details.전용)}</span></div>
                        <div>주거 공용면적 <span className="font-semibold">{convert(active.details.주거공용)}</span></div>
                        <div>공급면적 <span className="font-semibold">{convert(active.details.공급)}</span></div>
                        <div>기타 공용면적 <span className="font-semibold">{convert(active.details.기타공용)}</span></div>
                        <div>계약면적 <span className="font-semibold">{convert(active.details.계약)}</span></div>
                    </div>
                </div>

                {/* 하단 유의사항 */}
                <div className="mt-8 w-full max-w-4xl border-t border-gray-200 pt-5 text-left text-gray-500 text-[13px] leading-relaxed space-y-1">
                    <p>* 유니트 및 면적은 소비자의 이해를 돕기 위한 것으로 건축설계변경 및 그 이외의 사유로 변경될 수 있습니다.</p>
                    <p>* 본 홈페이지에 사용된 아이소메트릭 및 평면도는 소비자의 이해를 돕기 위한 것으로 건축설계변경 또는 그 외의 사유로 인해 변경될 수 있습니다.</p>
                    <p>* 일부 품목은 분양가 제외품목이오니 주택전시관에서 반드시 확인하시기 바랍니다.</p>
                    <p>* 입면 디자인을 위해 발코니 턱, 발코니 샤시 및 난간 설치는 동일 평형이라도 호수별로 다르게 설계될 수 있습니다.</p>
                    <p>* 본 홍보물은 분양 승인 시 제출된 것으로 실제 시공시 변경될 수 있음을 유념하시기 바랍니다.</p>
                </div>
            </div>
        </section>
    )
}
