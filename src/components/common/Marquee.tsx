// src/components/common/Marquee.tsx
// 키워드가 옆으로 천천히 흐르는 띠 (호반써밋 사이트의 MarqueeTicker와 같은 방식)
import * as React from "react"
import { cn } from "@/lib/utils"

type MarqueeProps = {
    items: string[]
    className?: string
    /** 한 바퀴 도는 시간(초). 클수록 느림 */
    speed?: number
    separator?: string
}

export const Marquee: React.FC<MarqueeProps> = ({ items, className, speed = 40, separator = "·" }) => {
    const row = (hidden: boolean) => (
        <span className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
            {items.map((t, i) => (
                <React.Fragment key={i}>
                    <span className="px-5 md:px-7">{t}</span>
                    <span className="text-brand">{separator}</span>
                </React.Fragment>
            ))}
        </span>
    )
    return (
        <div className={cn("overflow-hidden whitespace-nowrap", className)}>
            <div className="marquee-track inline-flex" style={{ animationDuration: `${speed}s` }}>
                {row(false)}
                {row(true)}
            </div>
        </div>
    )
}
