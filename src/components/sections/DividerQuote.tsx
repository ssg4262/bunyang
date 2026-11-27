// src/components/sections/DividerQuote.tsx
// 섹션 사이 문구 띠: 어두운 배경에 한 문장 (호반써밋 사이트의 DividerSection과 같은 방식)
import * as React from "react"
import { Reveal } from "@/components/common/Reveal"

export const DividerQuote: React.FC<{ quote: string; author?: string }> = ({ quote, author }) => (
    <div className="relative overflow-hidden bg-[#0e0e0e] py-20 md:py-36">
        {/* 좌우 가는 선 장식 */}
        <div aria-hidden className="absolute left-[8%] top-1/2 hidden h-px w-[22%] -translate-y-1/2 bg-gradient-to-r from-transparent to-white/15 md:block" />
        <div aria-hidden className="absolute right-[8%] top-1/2 hidden h-px w-[22%] -translate-y-1/2 bg-gradient-to-l from-transparent to-white/15 md:block" />

        <Reveal className="mx-auto max-w-3xl px-6 text-center">
            <p className="heading-display break-keep text-[22px] leading-snug text-white md:text-[32px] lg:text-[38px]">
                {quote}
            </p>
            {author && (
                <span className="mt-6 flex items-center justify-center gap-3 text-[12px] font-medium tracking-[0.06em] text-white/55">
                    <span aria-hidden className="h-px w-6 bg-brand" />
                    {author}
                </span>
            )}
        </Reveal>
    </div>
)
