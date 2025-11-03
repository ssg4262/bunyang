// src/components/sections/QuoteHeadline.tsx
"use client"

import React from "react"
import { cn } from "@/lib/utils"

type Align = "center" | "left"

export type QuoteHeadlineProps = {
    /** 메인 타이틀 (줄바꿈 유지) */
    title: string
    /** 서브 문구 */
    subtitle?: string
    /** 하단 이미지 (선택) */
    imageSrc?: string
    imageAlt?: string
    /** 정렬 */
    align?: Align
    /** 외부 클래스 */
    className?: string
    /** 이미지 최대 너비 (Tailwind 클래스) */
    imageMaxWClass?: string
}

export const QuoteHeadline: React.FC<QuoteHeadlineProps> = ({
                                                                title,
                                                                subtitle,
                                                                imageSrc,
                                                                imageAlt = "",
                                                                align = "center",
                                                                className,
                                                                imageMaxWClass = "max-w-[960px]",
                                                            }) => {
    const alignCls =
        align === "left" ? "items-start text-left" : "items-center text-center"

    return (
        <section
            className={cn("w-full bg-white py-10 md:py-14 lg:py-16", className)}
            aria-label="문구 헤드라인"
        >
            <div
                className={cn(
                    "container mx-auto px-6 flex flex-col gap-4 max-w-5xl",
                    alignCls
                )}
            >
                {/* 작은 따옴표 */}
                <span
                    aria-hidden
                    className="select-none text-[28px] md:text-[32px] leading-none text-neutral-400"
                >
          &ldquo;
        </span>

                {/* 타이틀 */}
                <h2
                    className={cn(
                        "whitespace-pre-line font-extrabold tracking-tight",
                        "text-[22px] sm:text-[28px] md:text-[34px] lg:text-[38px]",
                        "leading-[1.35] text-neutral-800"
                    )}
                >
                    {title}
                </h2>

                {/* 서브 */}
                {subtitle && (
                    <p className="text-neutral-500 text-[14px] md:text-[16px] mt-1">
                        {subtitle}
                    </p>
                )}

                {/* 하단 이미지 */}
                {imageSrc && (
                    <div
                        className={cn(
                            "w-full mt-6",
                            align === "center" ? "mx-auto" : "",
                            imageMaxWClass
                        )}
                    >
                        <img
                            src={imageSrc as any}
                            alt={imageAlt}
                            className="w-full h-auto object-cover rounded-none select-none"
                            draggable={false}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}
