// src/components/navigation/PromoNavbar.tsx
// 링크 없이 디자인만 구현된 네브바 컴포넌트 (shadcn/ui + Tailwind)
// - 최신 React + TypeScript
// - 화살표 함수 스타일
// - react-router-dom 미사용 (순수 UI)

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
import { Menu, Phone, Sun, Moon } from "lucide-react"

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
}

// 전화번호 텍스트에서 숫자(+ 포함)만 뽑아 tel: 링크 생성
const toTelHref = (label?: string) => {
    if (!label) return "tel:"
    const m = label.match(/[+]?[0-9][0-9\\- ]{5,}/)
    const raw = m ? m[0] : label
    return `tel:${raw.replace(/[^+\\d]/g, "")}`
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
                                                        }) => {
    const [active, setActive] = React.useState<number>(0)

    const toggleTheme = React.useCallback(() => {
        const root = document.documentElement
        const isDark = root.classList.contains("dark")
        root.classList.toggle("dark", !isDark)
        try {
            localStorage.setItem("theme", !isDark ? "dark" : "light")
        } catch { /* empty */ }
    }, [])

    React.useEffect(() => {
        try {
            const saved = localStorage.getItem("theme")
            if (saved) document.documentElement.classList.toggle("dark", saved === "dark")
        } catch { /* empty */ }
    }, [])

    return (
        <header
            className={cn(
                "z-50 border-b border-border/60 bg-background/80 backdrop-blur",
                sticky ? "sticky top-0" : undefined,
                className
            )}
        >
            <div className="container mx-auto h-16 px-4 flex items-center justify-between gap-3">
                {/* 좌측: 브랜드 + 데스크톱 네비 */}
                <div className="flex items-center gap-3 min-w-0">
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-10 px-3 font-semibold text-base md:text-lg"
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
                                onClick={() => {
                                    setActive(idx)
                                    onItemClick?.(item, idx)
                                }}
                                className={cn(
                                    "rounded-xl px-3 py-2 text-sm transition-colors",
                                    active === idx
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                )}
                            >
                                <span className="truncate">{item.label}</span>
                                {item.badge && (
                                    <span className="ml-2 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] leading-none text-primary">
                    {item.badge}
                  </span>
                                )}
                            </Button>
                        ))}
                    </nav>
                </div>

                {/* 우측: 액션들 */}
                <div className="flex items-center gap-2">
                    {contactLabel && (
                        // 데스크톱: tel: 링크 (shadcn Button asChild)
                        <Button asChild variant="default" className="hidden sm:inline-flex rounded-xl">
                            <a href={toTelHref(contactLabel)} aria-label={`${contactLabel}로 전화하기`}>
                                <Phone className="mr-2 h-4 w-4" /> {contactLabel}
                            </a>
                        </Button>
                    )}

                    {rightSlot}

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-xl relative"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Theme</span>
                    </Button>

                    <MobileMenu
                        brand={brand}
                        nav={nav}
                        contactLabel={contactLabel}
                        onItemClick={(item, idx) => {
                            setActive(idx)
                            onItemClick?.(item, idx)
                        }}
                    />
                </div>
            </div>
        </header>
    )
}

/* 모바일 시트 메뉴 (링크 없음) */
const MobileMenu: React.FC<{
    brand: string
    nav: NavItem[]
    contactLabel?: string
    onItemClick?: (item: NavItem, index: number) => void
}> = ({ brand, nav, contactLabel, onItemClick }) => (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden rounded-xl">
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
                    {/* 모바일: 시트 닫히면서 tel: 링크로 이동 (SheetClose + Button asChild + a) */}
                    <SheetClose asChild>
                        <Button asChild className="w-full rounded-xl">
                            <a href={toTelHref(contactLabel)} aria-label={`${contactLabel}로 전화하기`}>
                                <Phone className="mr-2 h-4 w-4" /> {contactLabel}
                            </a>
                        </Button>
                    </SheetClose>
                </div>
            )}
        </SheetContent>
    </Sheet>
)
