// src/components/sections/ProjectOverviewTabs.tsx
"use client"

import { CountUp } from "@/components/common/CountUp"
import { Reveal } from "@/components/common/Reveal"
import { TAB_LIST, TAB_TRIGGER } from "@/components/sections/tabStyles"
import { SectionHeader } from "@/components/sections/SectionHeader"
import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/* ───────── 타입 ───────── */
export type UnitRow = {
    type: string
    households: number
    areaExclusive: number
    areaSupply: number
    ratio?: number
    color?: string
}
export type SpecItem = { label: string; value: React.ReactNode }

export type StatItem = { value: number; unit: string; label: string }

export type ProjectOverviewTabsProps = {
    /** 탭 위에 크게 보여 줄 핵심 숫자 (선택) */
    stats?: StatItem[]
    overviewHero: string
    unitRows: UnitRow[]
    specList: SpecItem[]
    perspectiveImages?: string[]
    brandImages?: string[]
    defaultTab?: "overview" | "perspective" | "brand"
    className?: string
}

/* ───────── 유틸 ───────── */
const m2ToPyeong = (m2: number) => m2 / 3.305785
const fmt = (n: number, d = 2) =>
    new Intl.NumberFormat("ko-KR", { maximumFractionDigits: d }).format(n)

/* ───────── 컴포넌트 ───────── */
export const ProjectOverviewTabs: React.FC<ProjectOverviewTabsProps> = ({
                                                                            stats = [],
                                                                            overviewHero,
                                                                            unitRows,
                                                                            specList,
                                                                            perspectiveImages = [],
                                                                            brandImages = [],
                                                                            defaultTab = "overview",
                                                                            className,
                                                                        }) => {
    const [usePyeong, setUsePyeong] = React.useState(false)

    return (
        <section className={cn("mx-auto max-w-7xl section-padding py-16 md:py-28", className)}>
            <SectionHeader
                eyebrow="OVERVIEW"
                title="사업개요"
                description="동대구역을 품은 센트럴 라이프, e편한세상 동대구역 센텀스퀘어 중·대형 평면 구성 공동주택 총 322세대 일반분양"
            />

            {/* 탭 */}
            {/* 핵심 숫자 */}
            {stats.length > 0 && (
                <div className="mb-12 md:mb-20 grid grid-cols-2 gap-px border-y border-line bg-line md:grid-cols-4">
                    {stats.map((st, i) => (
                        <Reveal key={st.label} delay={i * 0.08} className="bg-white px-4 py-8 md:py-11 text-center">
                            <div className="heading-display text-[38px] md:text-[54px] text-ink">
                                <CountUp to={st.value} />
                                <span className="ml-1 text-[15px] md:text-[18px] font-bold tracking-[-0.02em]">{st.unit}</span>
                            </div>
                            <div className="mt-2 text-[12px] md:text-[13px] font-medium tracking-[0.04em] text-neutral-500">
                                {st.label}
                            </div>
                        </Reveal>
                    ))}
                </div>
            )}

            <Reveal delay={0.08}>
            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className={TAB_LIST}>
                    <TabsTrigger value="overview" className={TAB_TRIGGER}>
                        사업개요
                    </TabsTrigger>
                    <TabsTrigger value="perspective" className={TAB_TRIGGER}>
                        투시도
                    </TabsTrigger>
                    <TabsTrigger value="brand" className={TAB_TRIGGER}>
                        브랜드
                    </TabsTrigger>
                </TabsList>

                {/* ───────── 사업개요 ───────── */}
                <TabsContent value="overview" className={cn("mt-8 md:mt-12", TAB_FADE)}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
                        {/* 좌: 히어로 */}
                        <figure className="overflow-hidden bg-surface">
                            <img src={overviewHero} alt="" className="w-full h-full object-cover" draggable={false} />
                        </figure>

                        {/* 우: 표 + 단위 토글 */}
                        <div>
                            <div className="flex items-end justify-between gap-3 border-b-2 border-ink pb-3">
                                <h3 className="text-[17px] md:text-[19px] font-bold tracking-[-0.03em]">타입별 면적표</h3>
                                <div className="flex items-center gap-3 text-[13px]">
                                    <span className={cn(!usePyeong ? "font-semibold text-ink" : "text-neutral-400")}>㎡(전용/공급)</span>
                                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-neutral-500">
                                        <input
                                            type="checkbox"
                                            checked={usePyeong}
                                            onChange={(e) => setUsePyeong(e.target.checked)}
                                            className="h-4 w-4 accent-[#fc671a]"
                                        />
                                        평(공급기준)
                                    </label>
                                </div>
                            </div>

                            <div
                                className={cn(
                                    "relative overflow-x-auto",
                                    "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                )}
                            >
                                <table className="w-full text-[13px] sm:text-[14px] tabular-nums">
                                    <thead>
                                    <tr className="[&>th]:px-1.5 sm:[&>th]:px-2 [&>th]:py-3 [&>th]:text-left [&>th]:text-[12px] [&>th]:font-medium [&>th]:text-neutral-500 [&>th]:whitespace-nowrap">
                                        <th className="w-[60px] sm:w-[72px]">타입</th>
                                        <th>세대수</th>
                                        <th>{usePyeong ? "전용(평)" : "전용(㎡)"}</th>
                                        <th>{usePyeong ? "공급(평)" : "공급(㎡)"}</th>
                                        <th>구성비</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {unitRows.map((r, i) => {
                                        const ex = usePyeong ? m2ToPyeong(r.areaExclusive) : r.areaExclusive
                                        const sup = usePyeong ? m2ToPyeong(r.areaSupply) : r.areaSupply
                                        return (
                                            <tr key={`${r.type}-${i}`} className="border-t border-line">
                                                <td className="px-1.5 sm:px-2 py-2.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-2" title={r.type}>
                              {r.color && (
                                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                              )}
                                <span className="font-semibold">{r.type}</span>
                            </span>
                                                </td>
                                                <td className="px-1.5 sm:px-2 py-2.5 text-neutral-700 whitespace-nowrap">{fmt(r.households, 0)}세대</td>
                                                <td className="px-1.5 sm:px-2 py-2.5 text-neutral-700 whitespace-nowrap">{fmt(ex)}</td>
                                                <td className="px-1.5 sm:px-2 py-2.5 text-neutral-700 whitespace-nowrap">{fmt(sup)}</td>
                                                <td className="px-1.5 sm:px-2 py-2.5 text-neutral-700 whitespace-nowrap">{r.ratio ? `${fmt(r.ratio)}%` : "—"}</td>
                                            </tr>
                                        )
                                    })}
                                    <tr className="border-t border-ink bg-surface">
                                        <td className="px-1.5 sm:px-2 py-3 font-bold">합계</td>
                                        <td className="px-1.5 sm:px-2 py-3 font-bold">322세대</td>
                                        <td className="px-1.5 sm:px-2 py-2.5 text-neutral-700 whitespace-nowrap">—</td>
                                        <td className="px-1.5 sm:px-2 py-2.5 text-neutral-700 whitespace-nowrap">—</td>
                                        <td className="px-1.5 sm:px-2 py-3 font-bold">100%</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 스펙 */}
                    <div className="mt-12 md:mt-16">
                        <div className="border-b-2 border-ink pb-3">
                            <h3 className="text-[17px] md:text-[19px] font-bold tracking-[-0.03em]">사업개요</h3>
                        </div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
                            {specList.map((s, i) => (
                                <div key={i} className="flex items-baseline justify-between gap-4 border-b border-line py-3.5 text-[14px] md:text-[15px]">
                                    <dt className="shrink-0 text-neutral-500">{s.label}</dt>
                                    <dd className="font-semibold text-right text-ink">{s.value}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-6">
                            <ul className="text-[12px] leading-relaxed text-neutral-400 space-y-1">
                                <li>※ 유니트 및 면적은 소비자의 이해를 돕기 위한 것으로 건축설계변경 등에 따라 변경될 수 있습니다.</li>
                                <li>※ 본 페이지의 이미지와 도면은 소비자의 이해를 돕기 위한 것으로 변경될 수 있습니다.</li>
                                <li>※ 일부 품목은 분양가 제외 품목일 수 있으니 주택전시관에서 반드시 확인하시기 바랍니다.</li>
                                <li>※ 입면 디자인, 발코니 설치 등은 호수별로 다르게 설계될 수 있습니다.</li>
                                <li>※ 본 홍보물은 분양 승인 시 제출된 것으로 실제 시공 시 변경될 수 있습니다.</li>
                            </ul>
                        </div>
                    </div>
                </TabsContent>

                {/* ───────── 투시도 ───────── */}
                <TabsContent value="perspective" className={cn("mt-8 md:mt-12", TAB_FADE)}>
                    {perspectiveImages.length === 0 ? (
                        <EmptyState label="등록된 투시도가 없습니다." />
                    ) : (
                        <ImageMasonry images={perspectiveImages} />
                    )}
                </TabsContent>

                {/* ───────── 브랜드 ───────── */}
                <TabsContent value="brand" className={cn("mt-8 md:mt-12", TAB_FADE)}>
                    {brandImages.length === 0 ? (
                        <EmptyState label="등록된 브랜드 자료가 없습니다." />
                    ) : brandImages.length === 1 ? (
                        // ✅ 1장일 때: 중앙 정렬 + 크게
                        <figure className="w-full overflow-hidden">
                            <img
                                src={brandImages[0]}
                                alt=""
                                className="w-full h-auto object-contain md:object-cover"
                                draggable={false}
                            />
                        </figure>
                    ) : (
                        <ImageMasonry images={brandImages} />
                    )}
                </TabsContent>
            </Tabs>
            </Reveal>
        </section>
    )
}

// 탭을 바꿀 때 내용이 살짝 떠오르며 나타남
const TAB_FADE = "animate-in fade-in-0 slide-in-from-bottom-2 duration-500"

/* ───────── 보조 UI ───────── */
const EmptyState: React.FC<{ label: string }> = ({ label }) => (
    <div className="bg-surface p-10 text-center text-neutral-500">{label}</div>
)

const ImageMasonry: React.FC<{ images: string[] }> = ({ images }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {images.map((src, i) => (
            <figure key={i} className="overflow-hidden bg-surface">
                <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
            </figure>
        ))}
    </div>
)
