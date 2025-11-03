// src/components/navigation/PromoNavbar.tsx
// 모바일: 히어로 구간 투명/오버레이, 데스크탑: 기존 불투명
// 항상 라이트모드 강제 (다크 토글 제거)

"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Menu, Phone } from "lucide-react"

export type NavItem = {
    label: string
    badge?: string
    disabled?: boolean
}

export type PromoNavbarProps = {
    brand?: string
    nav: NavItem[]
    contactLabel?: string // 예: "상담 053-760-4818"
    sticky?: boolean
    className?: string
    rightSlot?: React.ReactNode
    onItemClick?: (item: NavItem, index: number) => void
    onBrandClick?: () => void
    /** 히어로(캐러셀) 루트 선택자 (예: "#hero"). 못 찾으면 스크롤 적을 때를 히어로로 간주 */
    heroSelector?: string
}

export const PromoNavbar: React.FC<PromoNavbarProps> = ({
                                                            brand = "분양홍보",
                                                            nav,
                                                            contactLabel,
                                                            sticky = true,
                                                            className,
                                                            rightSlot,
                                                            onItemClick,
                                                            onBrandClick,
                                                            heroSelector = "#hero",
                                                        }) => {
    const [active, setActive] = React.useState<number>(0)
    const [overHero, setOverHero] = React.useState<boolean>(true)
    const [isMobile, setIsMobile] = React.useState<boolean>(false)
    const rootRef = React.useRef<HTMLElement>(null)

    // 항상 라이트모드 고정
    React.useEffect(() => {
        const root = document.documentElement
        root.classList.remove("dark")
        try { localStorage.setItem("theme", "light") } catch {}
    }, [])

    // 모바일 여부 추적
    React.useEffect(() => {
        const mql = window.matchMedia("(max-width: 767.98px)")
        const handler = () => setIsMobile(mql.matches)
        handler()
        mql.addEventListener?.("change", handler)
        return () => mql.removeEventListener?.("change", handler)
    }, [])

    // 히어로 위에 있는지 판단(모바일에서만 동작). 데스크탑은 항상 불투명 모드.
    React.useEffect(() => {
        const headerEl = rootRef.current
        const heroEl =
            (heroSelector && (document.querySelector(heroSelector) as HTMLElement | null)) ||
            (document.querySelector("[data-hero]") as HTMLElement | null) ||
            null

        const getHeaderH = () => headerEl?.getBoundingClientRect().height ?? 64

        const compute = () => {
            if (!isMobile) { setOverHero(false); return } // 데스크탑: 항상 불투명
            const headerH = getHeaderH()
            if (!heroEl) { setOverHero(window.scrollY < headerH + 32); return }
            const rect = heroEl.getBoundingClientRect()
            setOverHero(rect.bottom > headerH + 8)
        }

        compute()
        const onScroll = () => compute()
        const onResize = () => compute()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onResize)
        const ro = new ResizeObserver(compute)
        if (heroEl) ro.observe(heroEl)
        if (headerEl) ro.observe(headerEl)
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onResize)
            ro.disconnect()
        }
    }, [heroSelector, isMobile])

    // 스타일 전환: 모바일+히어로에서만 투명
    const headerBase =
        "z-50 border-b transition-colors duration-300 ease-out will-change-[background-color,color]"
    const headerMode =
        isMobile && overHero
            ? "border-transparent bg-transparent"
            : "border-border/60 bg-background/80 backdrop-blur"

    const textMain = isMobile && overHero ? "text-white drop-shadow" : "text-foreground"
    const navActive =
        isMobile && overHero ? "bg-white/15 text-white" : "bg-primary/10 text-primary"
    const navIdle =
        isMobile && overHero
            ? "text-white/85 hover:text-white hover:bg-white/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"

    return (
        <header
            ref={rootRef}
            className={cn(headerBase, sticky ? "sticky top-0" : undefined, headerMode, className)}
        >
            {/* 모바일 히어로 위에서만 가독성 보정 오버레이 */}
            {isMobile && overHero && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-transparent"
                />
            )}

            <div className="container mx-auto h-16 px-4 flex items-center justify-between gap-3 relative">
                {/* 좌측: 브랜드 + 데스크톱 네비 */}
                <div className="flex items-center gap-3 min-w-0">
                    <Button
                        type="button"
                        variant="ghost"
                        className={cn("h-10 px-3 font-semibold text-base md:text-lg", textMain, isMobile && overHero && "hover:text-white/90")}
                        onClick={onBrandClick}
                    >
                        {brand}
                    </Button>

                    <nav className="hidden md:flex items-center gap-1">
                        {nav.map((item, idx) => (
                            <Button
                                key={`${item.label}-${idx}`}
                                type="button"
                                variant="ghost"
                                disabled={item.disabled}
                                onClick={() => { setActive(idx); onItemClick?.(item, idx) }}
                                className={cn("rounded-xl px-3 py-2 text-sm transition-colors", active === idx ? navActive : navIdle)}
                            >
                <span className={cn("truncate", isMobile && overHero && "drop-shadow")}>
                  {item.label}
                </span>
                                {item.badge && (
                                    <span
                                        className={cn(
                                            "ml-2 rounded-md px-1.5 py-0.5 text-[10px] leading-none",
                                            isMobile && overHero ? "bg-white/15 text-white" : "bg-primary/10 text-primary"
                                        )}
                                    >
                    {item.badge}
                  </span>
                                )}
                            </Button>
                        ))}
                    </nav>
                </div>

                {/* 우측: 액션들 (라이트 고정: 토글 제거) */}
                <div className="flex items-center gap-2">
                    {contactLabel && (
                        <Button
                            type="button"
                            variant={isMobile && overHero ? "outline" : "default"}
                            className={cn("hidden sm:inline-flex rounded-xl", isMobile && overHero && "border-white/30 text-white bg-white/10 hover:bg-white/20")}
                        >
                            <Phone className="mr-2 h-4 w-4" /> {contactLabel}
                        </Button>
                    )}

                    {rightSlot}

                    <MobileMenu
                        brand={brand}
                        nav={nav}
                        contactLabel={contactLabel}
                        onItemClick={(item, idx) => { setActive(idx); onItemClick?.(item, idx) }}
                        overHeroMobile={isMobile && overHero}
                    />
                </div>
            </div>
        </header>
    )
}

/* 모바일 시트 메뉴 (링크 없음) - 모바일 히어로 위에선 밝은 톤 */
const MobileMenu: React.FC<{
    brand: string
    nav: NavItem[]
    contactLabel?: string
    onItemClick?: (item: NavItem, index: number) => void
    overHeroMobile?: boolean
}> = ({ brand, nav, contactLabel, onItemClick, overHeroMobile }) => (
    <Sheet>
        <SheetTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className={cn("md:hidden rounded-xl", overHeroMobile && "border-white/30 text-white bg-white/10 hover:bg-white/20")}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
            </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[320px] sm:w-[380px]">
            <SheetHeader>
                <SheetTitle>{brand}</SheetTitle>
            </SheetHeader>

            <div className="mt-6 grid gap-1">
                {nav.map((item, idx) => (
                    <SheetClose key={`${item.label}-${idx}`} asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full rounded-xl justify-start"
                            disabled={item.disabled}
                            onClick={() => onItemClick?.(item, idx)}
                        >
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                                <span className="ml-2 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] leading-none text-primary">
                  {item.badge}
                </span>
                            )}
                        </Button>
                    </SheetClose>
                ))}
            </div>

            {contactLabel && (
                <div className="mt-6">
                    <SheetClose asChild>
                        <Button type="button" className="w-full rounded-xl">
                            <Phone className="mr-2 h-4 w-4" /> {contactLabel}
                        </Button>
                    </SheetClose>
                </div>
            )}
        </SheetContent>
    </Sheet>
)

/* ----------------------------- 사용 팁 -----------------------------
- 캐러셀 루트에 id="hero" 또는 data-hero 달아주세요.
- 데스크탑은 항상 불투명, 모바일만 투명/오버레이 전환됩니다.
------------------------------------------------------------------- */
