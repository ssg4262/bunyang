// src/components/sections/SalesIntroSection.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Share2, Star } from "lucide-react"

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
    const rightAlignCls =
        rightAlign === "left" ? "items-start text-left" : "items-center text-center"

    return (
        <section
            id="intro"
            className={cn("relative w-full bg-background text-foreground", className)}
        >
            {/* 모바일 1컬럼, 데스크탑 2컬럼 / 양쪽 동일한 px/py로 간격 일치 */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* ============== 왼쪽: 기존 인트로 (구현/비율 그대로 유지) ============== */}
                <div className="container mx-auto w-full max-w-5xl px-6 py-10 md:py-14 lg:py-16">
                    {/* 배지들 */}
                    <div className="flex flex-wrap gap-2">
                        {badges.map((b, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-[12px] font-semibold text-white"
                            >
                {b}
              </span>
                        ))}
                    </div>

                    {/* 타이틀 */}
                    <div className="mt-5 space-y-2">
                        <p className="text-muted-foreground text-sm md:text-base">{eyebrow}</p>
                        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                            {title}
                        </h1>
                    </div>

                    {/* 액션 */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Button type="button" variant="outline" className="rounded-xl">
                            <Star className="mr-2 h-4 w-4" />
                            관심고객 등록
                        </Button>
                        <Button type="button" variant="ghost" className="rounded-xl">
                            <Share2 className="mr-2 h-4 w-4" />
                            SNS 공유
                        </Button>
                    </div>

                    {/* 전화 */}
                    <div className="mt-5 flex items-end gap-2">
                        <span className="text-sm text-muted-foreground">분양문의</span>
                        <strong className="text-3xl md:text-4xl font-extrabold tracking-wider">
                            {phone}
                        </strong>
                    </div>

                    {/* 이미지 */}
                    <div className="mt-8">
                        <img
                            src={heroImage as any}
                            alt=""
                            className="w-full max-w-[680px] object-cover rounded-none"
                            draggable={false}
                        />
                    </div>
                </div>

                {/* ============== 오른쪽: 따옴표 + 헤드라인 + 서브 (+선택 이미지) ============== */}
                {/* sticky 제거 → 왼쪽과 함께 자연스럽게 스크롤 */}
                <div
                    className={cn(
                        "px-6 py-10 md:py-14 lg:py-16", // ← 왼쪽과 같은 세팅으로 간격 일치
                        patternUrl ? "relative" : ""
                    )}
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
                    <div className={cn("w-full max-w-[980px] mx-auto flex flex-col gap-4", rightAlignCls)}>
                        {/* 작은 따옴표 */}
                        <span
                            aria-hidden
                            className="select-none text-[28px] md:text-[32px] leading-none text-neutral-400"
                        >
              &ldquo;
            </span>

                        {/* 메인 헤드라인 */}
                        <h2
                            className={cn(
                                "whitespace-pre-line font-extrabold tracking-tight",
                                "text-[22px] sm:text-[28px] md:text-[34px] lg:text-[38px]",
                                "leading-[1.35] text-neutral-800"
                            )}
                        >
                            {rightTitle}
                        </h2>

                        {/* 서브 카피 */}
                        {rightSubtitle && (
                            <p className="text-neutral-500 text-[14px] md:text-[16px] mt-1">
                                {rightSubtitle}
                            </p>
                        )}

                        {/* (선택) 하단 이미지 */}
                        {rightImageSrc && (
                            <div className={cn("w-full mt-6", rightAlign === "center" ? "mx-auto" : "")}>
                                <img
                                    src={rightImageSrc as any}
                                    alt={rightImageAlt}
                                    className="w-full h-auto object-cover rounded-none select-none"
                                    draggable={false}
                                />
                            </div>
                        )}
                    </div>

                    {/* 필요하면 밝기/톤 오버레이 */}
                    {/* <div className="pointer-events-none absolute inset-0 bg-white/0" /> */}
                </div>
            </div>
        </section>
    )
}
