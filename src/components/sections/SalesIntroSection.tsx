// src/components/sections/SalesIntroSection.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Share2, Star } from "lucide-react"

export type SalesIntroSectionProps = {
    /** 오른쪽 배경 패턴 이미지 URL (반복) */
    patternUrl?: string
    /** 하단 메인 이미지(건물) */
    heroImage: string
    /** 상단 좌측 작은 문구 */
    eyebrow?: string
    /** 메인 타이틀 */
    title: string
    /** 배지들 (예: 분양중, 공사완료) */
    badges?: string[]
    /** 전화번호 (예: "053.754.3600") */
    phone?: string
    /** 섹션 className 확장 */
    className?: string
}

export const SalesIntroSection: React.FC<SalesIntroSectionProps> = ({
                                                                        patternUrl,
                                                                        heroImage,
                                                                        eyebrow = "동대구역을 품은 센트럴 라이프",
                                                                        title = "e편한세상 동대구역 센텀스퀘어",
                                                                        badges = ["분양중", "공사완료"],
                                                                        phone = "053.754.3600",
                                                                        className,
                                                                    }) => {
    return (
        <section
            id="intro"
            className={cn(
                "relative w-full",
                "bg-background text-foreground",
                className
            )}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* 좌측: 텍스트 & 액션 & 이미지 */}
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

                {/* 우측: 패턴 배경 (데스크탑에서만 표시, 고정 스티키) */}
                <div className="relative hidden lg:block">
                    <div
                        className={cn(
                            "sticky",
                            // 네브바 고정 높이를 고려해 상단에 붙임
                            "top-[var(--nav-h,64px)]",
                            // 화면 남은 높이만큼만
                            "h-[calc(100vh-var(--nav-h,64px))]"
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
                        {/* 패턴 밝기/톤 조절용 살짝의 오버레이 (원하면 지워도 됨) */}
                        <div className="absolute inset-0 bg-white/0" />
                    </div>
                </div>
            </div>
        </section>
    )
}
