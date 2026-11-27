// src/components/nav/SideDots.tsx
// PC 화면 오른쪽 가운데의 점 내비게이션: 지금 보고 있는 섹션을 표시하고, 누르면 그 섹션으로 이동
// (호반써밋 사이트의 SideNav와 같은 방식. 휴대폰·태블릿에서는 숨김)
import * as React from "react"
import { cn } from "@/lib/utils"

export type SideDotItem = {
    label: string
    /** 이 항목이 가리키는 섹션 요소 */
    getEl: () => HTMLElement | null
}

export const SideDots: React.FC<{
    items: SideDotItem[]
    onSelect: (el: HTMLElement | null) => void
}> = ({ items, onSelect }) => {
    const [active, setActive] = React.useState(-1)
    const [visible, setVisible] = React.useState(false)

    React.useEffect(() => {
        const compute = () => {
            const line = window.innerHeight * 0.4
            let idx = -1
            items.forEach((it, i) => {
                const el = it.getEl()
                if (el && el.getBoundingClientRect().top <= line) idx = i
            })
            setActive(idx)
            setVisible(window.scrollY > 600 && idx >= 0)
        }
        compute()
        window.addEventListener("scroll", compute, { passive: true })
        window.addEventListener("resize", compute)
        return () => {
            window.removeEventListener("scroll", compute)
            window.removeEventListener("resize", compute)
        }
    }, [items])

    return (
        <nav
            aria-label="섹션 바로가기"
            className={cn(
                "fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-1 transition-all duration-300 lg:flex xl:right-8",
                visible ? "opacity-100" : "pointer-events-none translate-x-3 opacity-0"
            )}
        >
            {items.map((it, i) => {
                const isActive = i === active
                return (
                    <button
                        key={it.label}
                        type="button"
                        tabIndex={visible ? 0 : -1}
                        onClick={() => onSelect(it.getEl())}
                        aria-current={isActive}
                        className="group flex cursor-pointer items-center gap-3 py-1.5"
                    >
                        {/* 이름: 지금 보는 섹션은 항상 표시, 나머지는 마우스를 올리면 표시 (호반써밋과 같은 방식) */}
                        <span
                            className={cn(
                                "rounded-full px-3 py-1 text-[11px] font-medium transition-all duration-300",
                                isActive
                                    ? "bg-brand text-white"
                                    : "translate-x-2 bg-white text-neutral-500 opacity-0 shadow-sm group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                            )}
                        >
                            {it.label}
                        </span>
                        {/* 점 */}
                        <span
                            className={cn(
                                "flex h-3 w-3 items-center justify-center rounded-full border-2 transition-colors duration-300",
                                isActive ? "border-brand" : "border-neutral-300 group-hover:border-neutral-500"
                            )}
                        >
                            <span
                                className={cn(
                                    "h-1.5 w-1.5 rounded-full bg-brand transition-transform duration-300",
                                    isActive ? "scale-100" : "scale-0"
                                )}
                            />
                        </span>
                    </button>
                )
            })}
        </nav>
    )
}
