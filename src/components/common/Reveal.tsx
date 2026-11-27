// src/components/common/Reveal.tsx
// 스크롤해서 화면에 들어올 때 아래에서 살짝 올라오며 나타나는 효과
// (호반써밋 사이트의 RevealOnScroll과 같은 값: 0.6초, 한 번만 실행)
import * as React from "react"
import { cn } from "@/lib/utils"

type RevealProps = {
    children: React.ReactNode
    className?: string
    /** 시작을 늦출 시간(초). 여러 개를 차례로 보여줄 때 사용 */
    delay?: number
    /** 감쌀 태그 (기본 div) */
    as?: "div" | "section" | "li" | "figure" | "header"
}

export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, as = "div" }) => {
    const ref = React.useRef<HTMLElement | null>(null)
    const [shown, setShown] = React.useState(false)

    React.useEffect(() => {
        const el = ref.current
        // 관찰 기능이 없는 환경에서는 바로 보여 줌 (내용이 숨은 채로 남지 않게)
        if (!el || typeof IntersectionObserver === "undefined") {
            setShown(true)
            return
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setShown(true)
                    io.disconnect()
                }
            },
            // 화면 아래에서 80px쯤 올라왔을 때 시작
            { rootMargin: "0px 0px -80px 0px", threshold: 0 }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    const Tag = as as React.ElementType
    return (
        <Tag
            ref={ref}
            className={cn("reveal", shown && "reveal-in", className)}
            style={delay ? { transitionDelay: `${delay}s` } : undefined}
        >
            {children}
        </Tag>
    )
}
