// src/components/sections/HouseTypeSelector.tsx
"use client"

import React, { useRef } from "react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import h79A from "@/assets/main/houseType/79A.png"
import h79B from "@/assets/main/houseType/79B.png"

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

    // 정확한 평 변환 상수
    const SQM_PER_PYUNG = 3.305785

    const types: HouseType[] = [
        {
            label: "79m²A형",
            areaM2: 79.774,
            units: 1,
            image: (h79A as unknown as string),
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
            areaM2: 79.8927,
            units: 1,
            image: (h79B as unknown as string),
            details: {
                전용: 79.8927,
                주거공용: 23.0455,
                공급: 102.9382,
                기타공용: 51.9208,
                계약: 154.859,
            },
        },
        {
            label: "84m²A형",
            areaM2: 84.7113,
            units: 132,
            image: "/images/type-84a.png",
            details: {
                전용: 84.7113,
                주거공용: 24.6465,
                공급: 109.3578,
                기타공용: 55.0523,
                계약: 164.4101,
            },
        },
        {
            label: "84m²B형",
            areaM2: 84.9165,
            units: 18,
            image: "/images/type-84b.png",
            details: {
                전용: 84.9165,
                주거공용: 24.3610,
                공급: 109.2775,
                기타공용: 55.1856,
                계약: 164.4632,
            },
        },
        {
            label: "84m²C형",
            areaM2: 84.9463,
            units: 18,
            image: "/images/type-84c.png",
            details: {
                전용: 84.9463,
                주거공용: 24.3398,
                공급: 109.2861,
                기타공용: 55.2050,
                계약: 164.4912,
            },
        },
        {
            label: "107m²A형",
            areaM2: 107.8806,
            units: 18,
            image: "/images/type-107a.png",
            details: {
                전용: 107.8806,
                주거공용: 30.2790,
                공급: 138.1596,
                기타공용: 70.1096,
                계약: 208.2692,
            },
        },
        {
            label: "107m²B형",
            areaM2: 107.6682,
            units: 20,
            image: "/images/type-107b.png",
            details: {
                전용: 107.6682,
                주거공용: 30.0035,
                공급: 137.6717,
                기타공용: 69.9715,
                계약: 207.6433,
            },
        },
        {
            label: "125m²A형",
            areaM2: 125.7263,
            units: 38,
            image: "/images/type-125a.png",
            details: {
                전용: 125.7263,
                주거공용: 35.7885,
                공급: 161.5148,
                기타공용: 81.7072,
                계약: 243.2220,
            },
        },
        {
            label: "125m²B형",
            areaM2: 125.9086,
            units: 18,
            image: "/images/type-125b.png",
            details: {
                전용: 125.9086,
                주거공용: 36.2387,
                공급: 162.1473,
                기타공용: 81.8256,
                계약: 243.9729,
            },
        },
        {
            label: "125m²C형",
            areaM2: 125.7459,
            units: 18,
            image: "/images/type-125c.png",
            details: {
                전용: 125.7459,
                주거공용: 36.2975,
                공급: 162.0434,
                기타공용: 81.7199,
                계약: 243.7633,
            },
        },
        {
            label: "125m²D형",
            areaM2: 125.8938,
            units: 20,
            image: "/images/type-125d.png",
            details: {
                전용: 125.8938,
                주거공용: 35.7621,
                공급: 161.6559,
                기타공용: 81.8160,
                계약: 243.4719,
            },
        },
    ]

    const active = types[selected]

    // 현재 선택 타입의 "A형/B형…" 접미어
    const typeSuffix = React.useMemo(() => {
        const m = active.label.match(/[A-Z]형/)
        return m ? m[0] : ""
    }, [active.label])

    // 표 셀 표시용 공통 변환
    const convert = (v: number) => {
        if (usePyung) return `${(v / SQM_PER_PYUNG).toFixed(2)}평`
        return `${v.toFixed(3)}m²`
    }

    const scrollBy = (dir: "left" | "right") => {
        if (!scrollRef.current) return
        const container = scrollRef.current
        const amount = container.clientWidth * 0.6
        container.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
    }

    // 헤드라인: 공급 기준으로 ㎡/평 전환 + A형/B형 접미어
    const headlineText = usePyung
        ? `${Math.round(active.details.공급 / SQM_PER_PYUNG)}평${typeSuffix}`
        : `${active.details.공급.toFixed(1)}m²${typeSuffix}`

    return (
        <section className="w-full bg-white py-12 md:py-16 text-center">
            <div className="container mx-auto px-6 max-w-6xl flex flex-col items-center">
                {/* 헤드라인 */}
                <div className="text-center mb-8 md:mb-10">
                    <p className="text-sm md:text-base text-muted-foreground">
                        동대구역 초역세권의 중심, e편한세상 동대구역 센텀스퀘어.
                        중·대형 평면으로 구성된 총 322세대 일반분양 공동주택
                    </p>
                    <h2 className="mt-2 text-2xl md:text-4xl font-extrabold tracking-tight">세대안내</h2>
                </div>

                {/* 탭 바 */}
                <div className="relative w-full border-y border-gray-200 bg-gray-50">
                    <button
                        onClick={() => scrollBy("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 px-2 bg-gradient-to-r from-gray-50 to-transparent h-full flex items-center"
                        aria-label="이전 타입들 보기"
                    >
                        <ChevronLeft className="text-gray-400 hover:text-orange-500 transition h-5 w-5" />
                    </button>

                    <div
                        ref={scrollRef}
                        className={cn(
                            "flex overflow-x-auto snap-x snap-mandatory scroll-smooth",
                            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        )}
                    >
                        {types.map((t, i) => (
                            <button
                                key={t.label}
                                onClick={() => setSelected(i)}
                                className={cn(
                                    "flex-shrink-0 px-6 py-3 text-sm md:text-base font-medium transition-all snap-start whitespace-nowrap",
                                    i === selected
                                        ? "bg-[#FF5A1F] text-white"
                                        : "text-gray-600 hover:text-gray-800"
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => scrollBy("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 px-2 bg-gradient-to-l from-gray-50 to-transparent h-full flex items-center"
                        aria-label="다음 타입들 보기"
                    >
                        <ChevronRight className="text-gray-400 hover:text-orange-500 transition h-5 w-5" />
                    </button>
                </div>

                {/* 선택 정보 (공급 기준) */}
                <div className="mt-12 flex flex-col items-center gap-3">
                    <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800">{headlineText}</h3>
                    <p className="text-gray-500 text-lg">{active.units}세대</p>
                </div>

                {/* 단위 토글 (공급 기준으로 표기 안내) */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span>㎡ (공급면적)</span>
                    <Switch checked={usePyung} onCheckedChange={setUsePyung} />
                    <span>평 (공급면적)</span>
                </div>

                {/* 이미지 */}
                <div className="mt-12 w-full flex justify-center">
                    <img
                        src={active.image}
                        alt={active.label}
                        className="w-full max-w-3xl mx-auto rounded-md"
                        draggable={false}
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

                {/* 유의사항 */}
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
