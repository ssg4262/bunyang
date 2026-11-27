// src/components/sections/SectionHeader.tsx
// 모든 섹션 제목을 같은 모양으로 맞추기 위한 공용 헤더
import { Reveal } from "@/components/common/Reveal"
import * as React from "react"
import { cn } from "@/lib/utils"

type SectionHeaderProps = {
    /** 제목 위 작은 영문 라벨 (예: "OVERVIEW") */
    eyebrow?: string
    title: React.ReactNode
    /** 제목 아래 설명 문구 */
    description?: React.ReactNode
    /** lg: 큰 섹션 시작, md: 같은 묶음 안의 하위 섹션 */
    size?: "lg" | "md"
    /** 어두운 배경 위에서 사용 */
    dark?: boolean
    className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    eyebrow,
    title,
    description,
    size = "lg",
    dark = false,
    className,
}) => {
    if (size === "md") {
        // 하위 섹션: 얇은 윗선 + 작은 제목
        return (
            <Reveal className={cn("mb-5 md:mb-7 border-t pt-5 md:pt-6", dark ? "border-white/15" : "border-line", className)}>
                <h2
                    className={cn(
                        "text-[19px] md:text-[24px] font-bold tracking-[-0.03em]",
                        dark ? "text-white" : "text-ink"
                    )}
                >
                    {title}
                </h2>
                {description && (
                    <p className={cn("mt-2 text-sm md:text-[15px] leading-relaxed", dark ? "text-white/60" : "text-neutral-500")}>
                        {description}
                    </p>
                )}
            </Reveal>
        )
    }

    return (
        <Reveal className={cn("mb-9 md:mb-14 w-full text-left", className)}>
            {eyebrow && (
                <p className={cn("label-caps mb-3 md:mb-4", dark ? "text-white/50" : "text-neutral-500")}>
                    {eyebrow}
                </p>
            )}
            <h2
                className={cn(
                    "heading-display text-[30px] md:text-[44px] lg:text-[52px]",
                    dark ? "text-white" : "text-ink"
                )}
            >
                {title}
            </h2>
            <div aria-hidden className="mt-5 md:mt-6 h-px w-12 bg-brand" />
            {description && (
                <p
                    className={cn(
                        "mt-5 md:mt-6 max-w-2xl text-[15px] md:text-[17px] leading-relaxed",
                        dark ? "text-white/60" : "text-neutral-500"
                    )}
                >
                    {description}
                </p>
            )}
        </Reveal>
    )
}
