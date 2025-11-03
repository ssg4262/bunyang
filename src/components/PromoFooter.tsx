// src/components/layout/PromoFooter.tsx
"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, ArrowUp, Building2 } from "lucide-react"

export type FooterNavGroup = {
    title: string
    items: string[] // 디자인만: 클릭 시 콘솔 로그만
}

export type PromoFooterProps = {
    brand?: string
    tagline?: string
    phone?: string
    addressLines?: string[] // ["대구광역시 ...", "동대구역 센텀스퀘어 ..."]
    bizName?: string        // 시행/시공/분양대행 등 명칭
    bizRep?: string         // 대표자 명
    bizRegNo?: string       // 사업자등록번호
    navGroups?: FooterNavGroup[]
    bottomNote?: string     // 하단 고지/디스클레이머
    showTopDivider?: boolean
    className?: string
}

export const PromoFooter: React.FC<PromoFooterProps> = ({
                                                            brand = "e편한세상 동대구역 센텀스퀘어",
                                                            tagline = "동대구 최중심 라이프",
                                                            phone = "053-760-4818",
                                                            addressLines = ["대구광역시 동구 동대구역 앞 일대"],
                                                            bizName = "시행 · 시공: (주)예시건설",
                                                            bizRep = "대표: 홍길동",
                                                            bizRegNo = "사업자등록번호: 123-45-67890",
                                                            navGroups = [
                                                                { title: "안내", items: ["사업개요", "단지정보", "입지", "오시는길"] },
                                                                { title: "고객지원", items: ["상담문의", "관심고객 등록", "홍보자료"] },
                                                            ],
                                                            bottomNote = "본 홍보물의 내용은 인·허가 및 사업추진 과정에서 변경될 수 있으며, 실제와 차이가 있을 수 있습니다. 자세한 사항은 분양사무소에 문의하시기 바랍니다.",
                                                            showTopDivider = true,
                                                            className,
                                                        }) => {
    const year = React.useMemo(() => new Date().getFullYear(), [])

    const onClickGhost = (label: string) => {
        // 디자인만: 동작 없이 로그만 남김
        console.log("[Footer] click:", label)
    }

    const scrollTop = () => {
        try { window.scrollTo({ top: 0, behavior: "smooth" }) } catch {
            window.scrollTo(0, 0)
        }
    }

    return (
        <footer
            className={cn(
                "bg-background text-foreground",
                showTopDivider && "border-t border-border/60",
                className
            )}
            aria-label="사이트 푸터"
        >
            {/* 상단 영역: 브랜드/연락처 + 네비게이션 */}
            <div className="container mx-auto px-6 py-10 md:py-14 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand & Contact */}
                    <div className="flex flex-col gap-4 md:col-span-1">
                        <div>
                            <div className="flex items-center gap-2">
                                <Building2 className="h-6 w-6" />
                                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">{brand}</h3>
                            </div>
                            {tagline && (
                                <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
                            )}
                        </div>

                        <div className="mt-2 grid gap-2">
                            <Button type="button" variant="default" className="rounded-xl justify-start">
                                <Phone className="mr-2 h-4 w-4" />
                                분양문의 {phone}
                            </Button>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <div className="space-y-0.5">
                                    {addressLines.map((line, i) => (
                                        <div key={i}>{line}</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 맨 위로 */}
                        <div className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl"
                                onClick={scrollTop}
                            >
                                <ArrowUp className="mr-2 h-4 w-4" />
                                맨 위로
                            </Button>
                        </div>
                    </div>

                    {/* Nav groups */}
                    {navGroups.map((g, idx) => (
                        <div key={idx} className="flex flex-col gap-3">
                            <h4 className="text-sm font-semibold tracking-wide text-muted-foreground">
                                {g.title}
                            </h4>
                            <div className="grid gap-2">
                                {g.items.map((label, i) => (
                                    <Button
                                        key={i}
                                        type="button"
                                        variant="ghost"
                                        className="justify-start rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                        onClick={() => onClickGhost(label)}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 하단 바: 사업자 표기/디스클레이머/카피라이트 */}
            <div className="border-t border-border/60">
                <div className="container mx-auto px-6 py-6 md:py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="text-xs text-muted-foreground space-y-0.5">
                            <div>{bizName}</div>
                            <div>{bizRep}</div>
                            <div>{bizRegNo}</div>
                        </div>

                        <div className="text-[11px] md:text-xs text-muted-foreground md:text-right leading-relaxed">
                            {bottomNote}
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-muted-foreground">
                        © {year} {brand}. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}
