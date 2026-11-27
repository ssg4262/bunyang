// src/components/common/CountUp.tsx
// 화면에 들어오면 0에서 목표 숫자까지 올라가는 숫자
import * as React from "react"

export const CountUp: React.FC<{ to: number; duration?: number; className?: string }> = ({
    to,
    duration = 1400,
    className,
}) => {
    const ref = React.useRef<HTMLSpanElement | null>(null)
    const reduce =
        typeof window !== "undefined" &&
        !!window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const [val, setVal] = React.useState(reduce ? to : 0)

    React.useEffect(() => {
        const el = ref.current
        if (reduce || !el || typeof IntersectionObserver === "undefined") {
            setVal(to)
            return
        }
        let timer: number | undefined
        const io = new IntersectionObserver(
            (entries) => {
                if (!entries.some((e) => e.isIntersecting)) return
                io.disconnect()
                const start = Date.now()
                // 타이머 방식: 화면이 가려져 있어도 끝 값까지 반드시 도달
                timer = window.setInterval(() => {
                    const t = Math.min(1, (Date.now() - start) / duration)
                    const eased = 1 - Math.pow(1 - t, 3)
                    setVal(Math.round(to * eased))
                    if (t >= 1 && timer) window.clearInterval(timer)
                }, 30)
            },
            { rootMargin: "0px 0px -60px 0px" }
        )
        io.observe(el)
        return () => {
            io.disconnect()
            if (timer) window.clearInterval(timer)
        }
    }, [to, duration, reduce])

    return (
        <span ref={ref} className={className}>
            {val.toLocaleString()}
        </span>
    )
}
