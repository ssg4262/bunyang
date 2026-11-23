// src/components/sections/SalesIntroSection.tsx
"use client"

import React from "react"
// import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// import { Share2, Star } from "lucide-react"

type Align = "center" | "left"

export type SalesIntroSectionProps = {
    /** (왼쪽) 하단 메인 이미지(건물) */
    heroImage: string
    /** (왼쪽) 상단 좌측 작은 문구 */
    eyebrow?: string
    /** (왼쪽) 메인 타이틀 */
    title: string
    /** (왼쪽) 배지들 */
    badges?: string[]
    /** (왼쪽) 분양문의 전화번호 */
    phone?: string
    /** 섹션 className 확장 */
    className?: string

    /* --------- 우측 헤드라인 영역 --------- */
    /** 우측 메인 헤드라인 */
    rightTitle?: string
    /** 우측 서브 문구 */
    rightSubtitle?: string
    /** 우측 정렬 */
    rightAlign?: Align
    /** 우측 하단 이미지(선택) */
    rightImageSrc?: string
    rightImageAlt?: string

    /** (선택) 우측 배경에 패턴을 깔고 싶을 때 */
    patternUrl?: string
}

export const SalesIntroSection: React.FC<SalesIntroSectionProps> = ({
                                                                        // 왼쪽(기존) 기본값
                                                                        eyebrow = "동대구역을 품은 센트럴 라이프",
                                                                        title = "e편한세상 동대구역 센텀스퀘어",
                                                                        badges = ["분양중", "공사완료"],
                                                                        phone = "053.754.3600",
                                                                        heroImage,
                                                                        className,

                                                                        // 우측 기본값 (캡처 톤)
                                                                        rightTitle = "복합환승센터와 더블 초역세권을 품은 완벽한 일상",
                                                                        rightSubtitle = "동대구역 바로 앞 입지를 누리는 프리미엄 라이프",
                                                                        rightAlign = "center",
                                                                        rightImageSrc,
                                                                        rightImageAlt = "",

                                                                        patternUrl,
                                                                    }) => {
    void rightAlign

    return (
        <section id="intro" className={cn("relative w-full bg-white text-ink", className)}>
            <div className="mx-auto max-w-7xl section-padding py-16 md:py-28">
                <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
                    {/* ============== 왼쪽: 단지 소개 ============== */}
                    <div>
                        <p className="text-[13px] md:text-[14px] font-medium tracking-[0.02em] text-neutral-500">{eyebrow}</p>
                        <h1 className="heading-display mt-3 md:mt-4 text-[30px] md:text-[44px] lg:text-[52px]">
                            {title}
                        </h1>
                        <div aria-hidden className="mt-5 md:mt-6 h-px w-12 bg-brand" />

                        {/* 상태 + 전화 */}
                        <div className="mt-7 md:mt-9 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-y border-line py-5 md:py-6">
                            <div>
                                <p className="text-[12px] font-medium tracking-[0.04em] text-neutral-500">분양문의</p>
                                <a
                                    href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                                    className="mt-1 block text-[28px] md:text-[34px] font-extrabold leading-none tracking-[-0.03em] text-ink transition-colors hover:text-brand"
                                >
                                    {phone}
                                </a>
                            </div>
                            {badges.length > 0 && (
                                <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-semibold text-ink">
                                    {badges.map((b, i) => (
                                        <li key={i} className="inline-flex items-center gap-1.5">
                                            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* 이미지 */}
                        <div className="mt-8 md:mt-10">
                            <img
                                src={heroImage as string}
                                alt=""
                                className="w-full object-cover"
                                draggable={false}
                            />
                        </div>
                    </div>

                    {/* ============== 오른쪽: 헤드라인 + 서브 + 이미지 ============== */}
                    <div
                        className={cn(patternUrl ? "relative" : "")}
                        style={
                            patternUrl
                                ? ({
                                    backgroundImage: `url("${patternUrl}")`,
                                    backgroundRepeat: "repeat",
                                    backgroundSize: "560px auto",
                                    backgroundPosition: "center",
                                } as React.CSSProperties)
                                : undefined
                        }
                    >
                        <p className="label-caps text-neutral-500">Location</p>
                        <h2 className="mt-3 md:mt-4 whitespace-pre-line text-[24px] md:text-[32px] lg:text-[36px] font-bold leading-[1.28] tracking-[-0.035em] text-ink">
                            {rightTitle}
                        </h2>
                        {rightSubtitle && (
                            <p className="mt-4 text-[14.5px] md:text-[17px] leading-relaxed text-neutral-500">
                                {rightSubtitle}
                            </p>
                        )}

                        {rightImageSrc && (
                            <div className="mt-8 md:mt-10 w-full">
                                <img
                                    src={rightImageSrc as string}
                                    alt={rightImageAlt}
                                    className="w-full h-auto object-cover select-none"
                                    draggable={false}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
