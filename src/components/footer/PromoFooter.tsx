// src/components/layout/PromoFooter.tsx
"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ArrowUp } from "@/components/common/icons"
import elifeCloud from "@/assets/logo/elife-cloud.png"
import {smartDial} from "@/lib/smartDial.ts";

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
                                                            phone = "010-4539-8505",
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
                "bg-[#0e0e0e] text-white",
                showTopDivider && "border-t border-white/10",
                className
            )}
            aria-label="사이트 푸터"
        >
            {/* 상단 영역: 브랜드/연락처 + 네비게이션 */}
            <div className="mx-auto max-w-7xl section-padding py-12 md:py-16">
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                    {/* Brand & Contact */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <img src={elifeCloud} alt="" className="h-5 w-auto shrink-0 select-none" draggable={false} />
                                <h3 className="text-[18px] md:text-[20px] font-extrabold tracking-[-0.03em]">{brand}</h3>
                            </div>
                            {tagline && (
                                <p className="mt-2 text-[13px] text-white/50">{tagline}</p>
                            )}
                        </div>

                        <div className="text-[13px] leading-relaxed text-white/60">
                            <div className="space-y-0.5">
                                {addressLines.map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Nav groups */}
                    {navGroups.map((g, idx) => (
                        <div key={idx} className="flex flex-col gap-3">
                            <h4 className="label-caps text-white/40">{g.title}</h4>
                            <div className="grid gap-2">
                                {g.items.map((label, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className="text-left text-[14px] text-white/70 transition-colors hover:text-white"
                                        onClick={() => onClickGhost(label)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* 전화 + 맨 위로 */}
                    <div className="flex flex-col gap-5 md:items-end">
                        <button
                            type="button"
                            className="cursor-pointer text-left md:text-right"
                            onClick={() =>
                                smartDial("010-4539-8505", {
                                    desktopApp: "facetime",
                                    onFail: () => alert("앱을 찾을 수 없습니다. tel로 직접 걸어주세요: 010-4539-8505"),
                                })}
                        >
                            <span className="flex items-center gap-1.5 text-[12px] font-medium tracking-[0.04em] text-white/50 md:justify-end">
                                분양문의
                            </span>
                            <span className="mt-1 block text-[28px] md:text-[32px] font-extrabold leading-none tracking-[-0.03em] text-white transition-colors hover:text-brand">
                                {phone}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={scrollTop}
                            className="inline-flex h-11 w-fit cursor-pointer items-center gap-2 border border-white/25 px-5 text-[13px] font-medium text-white/80 transition-colors hover:border-white hover:text-white"
                        >
                            <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
                            맨 위로
                        </button>
                    </div>
                </div>
            </div>

            {/* 하단 바: 사업자 표기/디스클레이머/카피라이트 */}
            <div className="border-t border-white/10">
                <div className="mx-auto max-w-7xl section-padding py-7 md:py-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        {(bizName || bizRep || bizRegNo) && (
                            <div className="text-xs text-white/40 space-y-0.5">
                                {bizName && <div>{bizName}</div>}
                                {bizRep && <div>{bizRep}</div>}
                                {bizRegNo && <div>{bizRegNo}</div>}
                            </div>
                        )}

                        <div className="max-w-3xl text-[11px] md:text-xs text-white/40 leading-relaxed">
                            {bottomNote}
                        </div>
                    </div>

                    <div className="mt-5 text-[11px] md:text-xs text-white/30">
                        © {year} {brand}. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}
