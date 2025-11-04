// src/components/navigation/PromoNavbar.tsx
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
import { Menu, Phone, ChevronDown, ChevronUp } from "lucide-react"
import { smartDial } from "@/lib/smartDial"

// ───────────────────────── 타입 ─────────────────────────
export type NavItem = {
  label: string
  badge?: string
  disabled?: boolean
  /** 섹션 하위 항목 (없으면 단일 항목) */
  children?: NavItem[]
}

export type PromoNavbarProps = {
  brand?: string
  /** 데스크탑 상단 네비 + 모바일 패널 섹션/항목 (children 지원) */
  nav: NavItem[]
  contactLabel?: string
  className?: string
  rightSlot?: React.ReactNode
  onItemClick?: (item: NavItem, index: number) => void
  onBrandClick?: () => void
  /** 히어로(캐러셀) 루트 선택자. 예: "#hero" (없으면 data-hero, 마지막 폴백은 스크롤량) */
  heroSelector?: string
  /** 헤더 높이 변경 시 부모에 전달(캐러셀 상단 패딩 등에 활용) */
  onHeightChange?: (h: number) => void
  /** 모바일 패널 하단 퀵링크 */
  mobileFooterLinks?: { label: string; onClick?: () => void }[]
}

// ───────────────────────── 본컴포넌트 ─────────────────────────
export const PromoNavbar: React.FC<PromoNavbarProps> = ({
  brand = "분양홍보",
  nav,
  contactLabel,
  className,
  rightSlot,
  onItemClick,
  onBrandClick,
  heroSelector = "#hero",
  onHeightChange,
  mobileFooterLinks = [
    { label: "공지사항" },
    { label: "이벤트" },
    { label: "고객문의" },
  ],
}) => {
  const [active, setActive] = React.useState(0)
  const [overHeroMobile, setOverHeroMobile] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false)
  const [navH, setNavH] = React.useState(64)
  const headerRef = React.useRef<HTMLElement>(null)

  // 항상 라이트모드
  React.useEffect(() => {
    const root = document.documentElement
    root.classList.remove("dark")
    try {
      localStorage.setItem("theme", "light")
    } catch {}
  }, [])

  // 모바일 판별
  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 767.98px)")
    const handler = () => setIsMobile(mql.matches)
    handler()
    mql.addEventListener?.("change", handler)
    return () => mql.removeEventListener?.("change", handler)
  }, [])

  // 헤더 높이 측정 + 부모 전달
  React.useLayoutEffect(() => {
    const update = () => {
      const h = headerRef.current?.getBoundingClientRect().height ?? 64
      setNavH(h)
      onHeightChange?.(h)
      headerRef.current?.style.setProperty("--nav-h", `${h}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    if (headerRef.current) ro.observe(headerRef.current)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [onHeightChange])

  // 모바일에서만 "히어로 위/아래" 판단 (데스크탑은 항상 불투명)
  React.useEffect(() => {
    const heroEl =
      (heroSelector &&
        (document.querySelector(heroSelector) as HTMLElement | null)) ||
      (document.querySelector("[data-hero]") as HTMLElement | null) ||
      null

    const compute = () => {
      if (!isMobile) {
        setOverHeroMobile(false)
        return
      }
      const headerH = navH
      if (!heroEl) {
        setOverHeroMobile(window.scrollY < headerH + 32)
        return
      }
      const rect = heroEl.getBoundingClientRect()
      setOverHeroMobile(rect.bottom > headerH + 8)
    }

    compute()
    const onScroll = () => compute()
    const onResize = () => compute()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    const ro = new ResizeObserver(compute)
    if (heroEl) ro.observe(heroEl)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      ro.disconnect()
    }
  }, [heroSelector, isMobile, navH])

  // 스타일: 모바일 히어로 위에서만 투명, 그 외엔 불투명
  const headerMode =
    isMobile && overHeroMobile
      ? "border-transparent bg-transparent"
      : "border-border/60 bg-background/80 backdrop-blur"

  const textMain =
    isMobile && overHeroMobile ? "text-white drop-shadow" : "text-foreground"
  const navActive =
    isMobile && overHeroMobile
      ? "bg-white/15 text-white"
      : "bg-primary/10 text-primary"
  const navIdle =
    isMobile && overHeroMobile
      ? "text-white/85 hover:text-white hover:bg-white/10"
      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"

  return (
    <>
      {/* 고정 헤더 */}
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ease-out will-change-[background-color,color]",
          headerMode,
          className
        )}
      >
        {/* 모바일 히어로 위에서만 그라데이션 오버레이로 가독성 확보 */}
        {isMobile && overHeroMobile && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-transparent"
          />
        )}

        <div className="container mx-auto h-16 px-4 flex items-center justify-between gap-3 relative">
          {/* 좌측: 브랜드 & 데스크탑 네비 */}
          <div className="flex items-center gap-3 min-w-0">
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "h-10 px-3 font-semibold text-base md:text-lg",
                textMain,
                isMobile && overHeroMobile && "hover:text-white/90"
              )}
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
                    active === idx ? navActive : navIdle
                  )}
                >
                  <span
                    className={cn(
                      "truncate",
                      isMobile && overHeroMobile && "drop-shadow"
                    )}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        "ml-2 rounded-md px-1.5 py-0.5 text-[10px] leading-none",
                        isMobile && overHeroMobile
                          ? "bg-white/15 text-white"
                          : "bg-primary/10 text-primary"
                      )}
                    >
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
              <Button
                type="button"
                variant={isMobile && overHeroMobile ? "outline" : "default"}
                className={cn(
                  "hidden sm:inline-flex cursor-pointer rounded-xl",
                  isMobile &&
                    overHeroMobile &&
                    "border-white/30 text-white bg-white/10 hover:bg-white/20"
                )}
                onClick={() =>
                  smartDial("053-760-4818", {
                    desktopApp: "facetime",
                    onFail: () =>
                      alert(
                        "앱을 찾을 수 없습니다. tel로 직접 걸어주세요: 053-760-4818"
                      ),
                  })
                }
              >
                <Phone className="mr-2 h-4 w-4" /> {contactLabel}
              </Button>
            )}

            {rightSlot}

            <MobileMenu
              brand={brand}
              nav={nav}
              contactLabel={contactLabel}
              onItemClick={(item, idx) => {
                setActive(idx)
                onItemClick?.(item, idx)
              }}
              overHeroMobile={isMobile && overHeroMobile}
              footerLinks={mobileFooterLinks}
            />
          </div>
        </div>
      </header>

      {/* 고정 헤더 자리 보정용 spacer:
          - 데스크탑: 항상 표시
          - 모바일: 히어로 위에서는 감춤(오버레이), 벗어나면 표시 */}
      <div
        aria-hidden
        style={{ height: `var(--nav-h, ${navH}px)` }}
        className={cn("w-full", isMobile && overHeroMobile ? "hidden" : "block")}
      />
    </>
  )
}

// ───────────────────────── 모바일 메뉴 (이미지 스타일) ─────────────────────────
const MobileMenu: React.FC<{
  brand: string
  nav: NavItem[]
  contactLabel?: string
  onItemClick?: (item: NavItem, index: number) => void
  overHeroMobile?: boolean
  footerLinks?: { label: string; onClick?: () => void }[]
}> = ({ brand, nav, contactLabel, onItemClick, overHeroMobile, footerLinks }) => {
  // 첫 섹션만 열림
  const [openMap, setOpenMap] = React.useState<Record<number, boolean>>(
    () => Object.fromEntries(nav.map((_, i) => [i, i === 0])) as Record<
      number,
      boolean
    >
  )
  const toggle = (i: number) =>
    setOpenMap((m) => ({
      ...m,
      [i]: !m[i],
    }))

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "md:hidden rounded-xl",
            overHeroMobile &&
              "border-white/30 text-white bg-white/10 hover:bg-white/20"
          )}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[340px] sm:w-[400px] px-5">
        <SheetHeader>
          <SheetTitle className="sr-only">{brand}</SheetTitle>
        </SheetHeader>

        {/* 목록 */}
        <div className="mt-2 overflow-y-auto max-h-[calc(100vh-160px)] pb-6">
          {nav.map((section, idx) => {
            const isGroup = !!section.children?.length
            const isOpen = !!openMap[idx]

            return (
              <div key={`${section.label}-${idx}`} className="py-4">
                {/* 섹션 헤더 */}
                {isGroup ? (
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between"
                  >
                    <h3
                      className={cn(
                        "text-[28px] leading-[1.2] font-extrabold tracking-tight",
                        isOpen ? "text-orange-500" : "text-gray-900"
                      )}
                    >
                      {section.label}
                    </h3>
                    {isOpen ? (
                      <ChevronUp className="h-6 w-6 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-500" />
                    )}
                  </button>
                ) : (
                  // 단일 항목(하위 없음) 클릭 즉시 이동
                  <SheetClose asChild>
                    <button
                      type="button"
                      disabled={section.disabled}
                      onClick={() => onItemClick?.(section, idx)}
                      className={cn(
                        "w-full text-left text-[28px] leading-[1.2] font-extrabold tracking-tight",
                        section.disabled
                          ? "text-gray-300"
                          : "text-gray-900 hover:text-orange-500"
                      )}
                    >
                      {section.label}
                    </button>
                  </SheetClose>
                )}

                {/* 하위 항목 */}
                {isGroup && isOpen && (
                  <div className="mt-4 space-y-5 pl-1">
                    {section.children!.map((child, ci) => (
                      <SheetClose asChild key={`${child.label}-${ci}`}>
                        <button
                          type="button"
                          disabled={child.disabled}
                          onClick={() => onItemClick?.(child, ci)}
                          className={cn(
                            "block w-full text-left text-[20px] leading-6",
                            child.disabled
                              ? "text-gray-300"
                              : "text-gray-700 hover:text-gray-900"
                          )}
                        >
                          {child.label}
                        </button>
                      </SheetClose>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* 연락처 버튼 */}
          {contactLabel && (
            <div className="mt-6">
              <SheetClose asChild>
                <Button
                  type="button"
                  className="w-full rounded-xl"
                  onClick={() =>
                    smartDial("053-760-4818", {
                      desktopApp: "facetime",
                      onFail: () =>
                        alert("앱을 찾을 수 없습니다. tel로 직접 걸어주세요: 053-760-4818"),
                    })
                  }
                >
                  <Phone className="mr-2 h-4 w-4" /> {contactLabel}
                </Button>
              </SheetClose>
            </div>
          )}
        </div>

        {/* 하단 퀵링크 */}
        {footerLinks && footerLinks.length > 0 && (
          <div className="border-t pt-3 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              {footerLinks.map((f, i) => (
                <React.Fragment key={`${f.label}-${i}`}>
                  <button
                    type="button"
                    onClick={f.onClick}
                    className="hover:text-gray-600"
                  >
                    {f.label}
                  </button>
                  {i < footerLinks.length - 1 && (
                    <span className="text-gray-300">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}