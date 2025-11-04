// src/components/sections/ProjectOverviewTabs.tsx
"use client"

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

export type ProjectOverviewTabsProps = {
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
        <section className={cn("container mx-auto px-4 md:px-6 py-10 md:py-14", className)}>
            {/* 헤더 */}
            <div className="text-center mb-8 md:mb-10">
                <p className="text-sm md:text-base text-muted-foreground">
                    동대구역을 품은 센트럴 라이프, e편한세상 동대구역 센텀스퀘어 중·대형 평면 구성 공동주택 총 322세대 일반분양
                </p>
                <h2 className="mt-2 text-2xl md:text-4xl font-extrabold tracking-tight">사업개요</h2>
            </div>

            {/* 탭 */}
            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="w-full justify-center gap-1 bg-muted/60 rounded-xl p-1">
                    <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow">
                        사업개요
                    </TabsTrigger>
                    <TabsTrigger value="perspective" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow">
                        투시도
                    </TabsTrigger>
                    <TabsTrigger value="brand" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow">
                        브랜드
                    </TabsTrigger>
                </TabsList>

                {/* ───────── 사업개요 ───────── */}
                <TabsContent value="overview" className="mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 좌: 히어로 */}
                        <figure className="rounded-xl overflow-hidden border border-border/60 bg-muted/30">
                            <img src={overviewHero} alt="" className="w-full h-full object-cover" draggable={false} />
                        </figure>

                        {/* 우: 표 + 단위 토글 */}
                        <div className="rounded-xl border bg-background">
                            <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b">
                                <h3 className="font-semibold">타입별 면적표</h3>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className={cn("px-2 py-1 rounded-md", !usePyeong && "bg-muted")}>㎡(전용/공급)</span>
                                    <label className="inline-flex items-center gap-2 text-muted-foreground">
                                        <input
                                            type="checkbox"
                                            checked={usePyeong}
                                            onChange={(e) => setUsePyeong(e.target.checked)}
                                            className="h-4 w-4 accent-primary"
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
                                <table className="min-w-[700px] w-full text-sm">
                                    <thead className="bg-muted/60">
                                    <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left [&>th]:font-semibold">
                                        <th className="w-[72px]">타입</th>
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
                                            <tr key={`${r.type}-${i}`} className="border-t">
                                                <td className="px-3 py-2 whitespace-nowrap">
                            <span className="inline-flex items-center gap-2" title={r.type}>
                              {r.color && (
                                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: r.color }} />
                              )}
                                <span className="font-medium">{r.type}</span>
                            </span>
                                                </td>
                                                <td className="px-3 py-2">{fmt(r.households, 0)}세대</td>
                                                <td className="px-3 py-2">{fmt(ex)}</td>
                                                <td className="px-3 py-2">{fmt(sup)}</td>
                                                <td className="px-3 py-2">{r.ratio ? `${fmt(r.ratio)}%` : "—"}</td>
                                            </tr>
                                        )
                                    })}
                                    <tr className="border-t bg-muted/40">
                                        <td className="px-3 py-2 font-semibold">합계</td>
                                        <td className="px-3 py-2 font-semibold">322세대</td>
                                        <td className="px-3 py-2">—</td>
                                        <td className="px-3 py-2">—</td>
                                        <td className="px-3 py-2 font-semibold">100%</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 스펙 */}
                    <div className="mt-8 rounded-xl border bg-background">
                        <div className="px-4 md:px-6 py-4 border-b">
                            <h3 className="font-semibold">사업개요</h3>
                        </div>
                        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                            {specList.map((s, i) => (
                                <div key={i} className="flex items-center justify-between border-b sm:border-none pb-3 sm:pb-0">
                                    <span className="text-muted-foreground">{s.label}</span>
                                    <span className="font-medium text-right">{s.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="px-4 md:px-6 pb-5 mt-2">
                            <ul className="text-[12px] leading-relaxed text-muted-foreground space-y-1">
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
                <TabsContent value="perspective" className="mt-8">
                    {perspectiveImages.length === 0 ? (
                        <EmptyState label="등록된 투시도가 없습니다." />
                    ) : (
                        <ImageMasonry images={perspectiveImages} />
                    )}
                </TabsContent>

                {/* ───────── 브랜드 ───────── */}
                <TabsContent value="brand" className="mt-8">
                    {brandImages.length === 0 ? (
                        <EmptyState label="등록된 브랜드 자료가 없습니다." />
                    ) : brandImages.length === 1 ? (
                        // ✅ 1장일 때: 중앙 정렬 + 크게
                        <figure className="mx-auto w-full max-w-5xl md:max-w-6xl rounded-2xl overflow-hidden border shadow-sm">
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
        </section>
    )
}

/* ───────── 보조 UI ───────── */
const EmptyState: React.FC<{ label: string }> = ({ label }) => (
    <div className="rounded-xl border bg-muted/20 p-10 text-center text-muted-foreground">{label}</div>
)

const ImageMasonry: React.FC<{ images: string[] }> = ({ images }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, i) => (
            <figure key={i} className="rounded-xl overflow-hidden border">
                <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
            </figure>
        ))}
    </div>
)
