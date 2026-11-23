// src/components/sections/HouseTypeSelector.tsx
"use client"

import { SectionHeader } from "@/components/sections/SectionHeader"
import React, { useRef } from "react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import h79A from "@/assets/main/houseType/79A.png"
import h79B from "@/assets/main/houseType/79B.png"

import h84A from "@/assets/main/houseType/84A.png"
import h84B from "@/assets/main/houseType/84B.png"
import h84C from "@/assets/main/houseType/84C.png"

import h107A from "@/assets/main/houseType/107A.png"
import h107B from "@/assets/main/houseType/107B.png"

import h125A from "@/assets/main/houseType/125A.png"
import h125B from "@/assets/main/houseType/125B.png"
import h125C from "@/assets/main/houseType/125C.png"
import h125D from "@/assets/main/houseType/125D.png"
import h125E from "@/assets/main/houseType/125E.png"

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
    const [usePyung, setUsePyung] = React.useState(true)
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
            image: (h84A as unknown as string),
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
            image: (h84B as unknown as string),
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
            image: (h84C as unknown as string),
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
            image: (h107A as unknown as string),
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
            image: (h107B as unknown as string),
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
            image: (h125A as unknown as string),
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
            image: (h125B as unknown as string),
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
            image: (h125C as unknown as string),
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
            image: (h125D as unknown as string),
            details: {
                전용: 125.8938,
                주거공용: 35.7621,
                공급: 161.6559,
                기타공용: 81.8160,
                계약: 243.4719,
            },
        },
        {
            label: "125m²E형",
            areaM2: 125.4919,
            units: 20,
            image: (h125E as unknown as string),
            details: {
                전용: 125.4919,
                주거공용: 36.0016,
                공급: 161.4935,
                기타공용: 81.5548,
                계약: 243.0483,
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
        <section className="w-full bg-white py-16 md:py-28">
            <div className="mx-auto max-w-7xl section-padding">
                <SectionHeader
                    eyebrow="UNIT PLAN"
                    title="세대평면도"
                    description="동대구역 초역세권의 중심, e편한세상 동대구역 센텀스퀘어. 중·대형 평면으로 구성된 총 322세대 일반분양 공동주택"
                />

                {/* 탭 바: 밑줄형, 가로 스크롤 */}
                <div className="relative w-full border-b border-line">
                    <button
                        onClick={() => scrollBy("left")}
                        className="absolute left-0 top-0 z-10 flex h-full w-7 items-start justify-start bg-white pt-0.5 md:hidden"
                        aria-label="이전 타입들 보기"
                    >
                        <ChevronLeft className="h-5 w-5 text-neutral-400" strokeWidth={1.5} />
                    </button>

                    <div
                        ref={scrollRef}
                        className={cn(
                            "flex gap-6 md:gap-8 overflow-x-auto scroll-smooth mx-7 md:mx-0",
                            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        )}
                    >
                        {types.map((t, i) => (
                            <button
                                key={t.label}
                                onClick={() => setSelected(i)}
                                className={cn(
                                    "relative flex-shrink-0 whitespace-nowrap pb-3.5 text-[15px] md:text-[17px] font-semibold transition-colors",
                                    "after:absolute after:inset-x-0 after:-bottom-px after:h-[2px]",
                                    i === selected
                                        ? "text-ink after:bg-ink"
                                        : "text-neutral-400 hover:text-ink after:bg-transparent"
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => scrollBy("right")}
                        className="absolute right-0 top-0 z-10 flex h-full w-7 items-start justify-end bg-white pt-0.5 md:hidden"
                        aria-label="다음 타입들 보기"
                    >
                        <ChevronRight className="h-5 w-5 text-neutral-400" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="mt-9 md:mt-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-9 lg:gap-16 items-start">
                    {/* 이미지 */}
                    <div className="order-2 lg:order-1 w-full">
                        <img
                            src={active.image}
                            alt={active.label}
                            className="w-full"
                            draggable={false}
                        />
                    </div>

                    {/* 선택 정보 (공급 기준) */}
                    <div className="order-1 lg:order-2 lg:sticky lg:top-24">
                        <p className="label-caps text-neutral-500">Type</p>
                        <div className="mt-2 flex items-end justify-between gap-4">
                            <h3 className="heading-display text-[40px] md:text-[56px] text-ink">{headlineText}</h3>
                            <p className="pb-1.5 text-[15px] font-semibold text-brand">{active.units}세대</p>
                        </div>

                        {/* 단위 토글 (공급 기준으로 표기 안내) */}
                        <div className="mt-5 flex items-center gap-2.5 text-[13px] text-neutral-500">
                            <span className={cn(!usePyung && "font-semibold text-ink")}>㎡</span>
                            <Switch checked={usePyung} onCheckedChange={setUsePyung} />
                            <span className={cn(usePyung && "font-semibold text-ink")}>평</span>
                            <span className="text-neutral-400">(공급면적 기준)</span>
                        </div>

                        {/* 상세 면적 */}
                        <dl className="mt-7 border-t-2 border-ink text-[14.5px] md:text-[15px]">
                            {([
                                ["주거 전용면적", active.details.전용],
                                ["주거 공용면적", active.details.주거공용],
                                ["공급면적", active.details.공급],
                                ["기타 공용면적", active.details.기타공용],
                                ["계약면적", active.details.계약],
                            ] as const).map(([label, value]) => (
                                <div key={label} className="flex items-baseline justify-between border-b border-line py-3.5">
                                    <dt className="text-neutral-500">{label}</dt>
                                    <dd className="font-semibold tabular-nums text-ink">{convert(value)}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {/* 유의사항 */}
                <div className="mt-10 md:mt-14 w-full text-left text-neutral-400 text-[12px] md:text-[13px] leading-relaxed space-y-1 break-keep">
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
