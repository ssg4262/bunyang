// src/components/sections/SectionHeader.tsx
// 모든 섹션 제목을 같은 모양으로 맞추기 위한 공용 헤더
import * as React from "react"
import { cn } from "@/lib/utils"

type SectionHeaderProps = {
    /** 제목 위 작은 주황 라벨 (예: "단지정보") */
    eyebrow?: string
    title: React.ReactNode
    /** 제목 아래 설명 문구 */
    description?: React.ReactNode
    /** lg: 큰 섹션 시작, md: 같은 묶음 안의 하위 섹션 */
    size?: "lg" | "md"
    className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    eyebrow,
    title,
    description,
    size = "lg",
    className,
}) => (
    <div className={cn("flex flex-col items-center text-center break-keep", size === "lg" ? "mb-8 md:mb-12" : "mb-5 md:mb-8", className)}>
        {eyebrow && (
            <p className="text-xs md:text-sm font-semibold tracking-[0.18em] text-orange-600">
                {eyebrow}
            </p>
        )}
        <h2
            className={cn(
                "font-extrabold tracking-tight text-gray-900",
                eyebrow && "mt-2",
                size === "lg" ? "text-[26px] md:text-4xl" : "text-xl md:text-[28px]"
            )}
        >
            {title}
        </h2>
        {description && (
            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-gray-500">
                {description}
            </p>
        )}
    </div>
)
