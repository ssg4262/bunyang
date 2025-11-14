// src/components/nav/PromoNavbar.tsx
"use client"

import React from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
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

/* ───────────────────────── 타입 ───────────────────────── */
export type NavItem = {
  label: string
  badge?: string
  disabled?: boolean
  /** 라우팅 경로 (있으면 NavLink로 이동 & 경로 기반 활성화) */
  href?: string
  /** 섹션 하위 항목 */
  children?: NavItem[]
}

export type PromoNavbarProps = {
  brand?: string
  /** 브랜드 클릭 시 이동할 경로 (예: "/bunyang") */
  brandHref?: string
  /** 데스크탑 상단 네비 + 모바일 패널 섹션/항목 (children 지원) */
  nav: NavItem[]
  contactLabel?: string
  className?: string
  rightSlot?: React.ReactNode
  /** href 없는 항목 클릭 시 호출(예: 스크롤 이동) — /bunyang에 있을 때만 사용됨 */
  onItemClick?: (item: NavItem, index: number) => void
  onBrandClick?: () => void
  /** 히어로(캐러셀) 루트 선택자. 예: "#hero" (없으면 data-hero, 마지막 폴백은 스크롤량) */
  heroSelector?: string
  /** 헤더 높이 변경 시 부모에 전달(캐러셀 상단 패딩 등에 활용) */
  onHeightChange?: (h: number) => void
  /** 모바일 패널 하단 퀵링크 */
  mobileFooterLinks?: { label: string; onClick?: () => void }[]
}

/* ───────────────────────── 본컴포넌트 ───────────────────────── */
export const PromoNavbar: React.FC<PromoNavbarProps> = ({
                                                          brand = "분양홍보",
                                                          brandHref = "/bunyang",
                                                          nav,
                                                          contactLabel,
                                                          className,
                                                          rightSlot,
                                                          onItemClick,
                                                          onBrandClick,
                                                          heroSelector = "#hero",
                                                          onHeightChange,
                                                          mobileFooterLinks = [],
                                                        }) => {
  // ✅ 경로/라우팅 훅
  const location = useLocation()
  const navigate = useNavigate()

  const [overHeroMobile, setOverHeroMobile] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false)
  const [navH, setNavH] = React.useState(64)
  const headerRef = React.useRef<HTMLElement>(null)

  // 현재 경로 -> 브랜드 활성화 표시용
  const isBrandActive = React.useMemo(
      () => location.pathname === brandHref || location.pathname.startsWith(brandHref + "/"),
      [location.pathname, brandHref]
  )

  // ✅ 다른 페이지에서 해시와 함께 도착했을 때 스크롤 처리
  React.useEffect(() => {
    // ✅ 정확히 /bunyang 페이지에 있고, 해시가 있을 때만 실행
    const isOnBunyangPage = location.pathname === brandHref || location.pathname === brandHref + "/"

    if (!isOnBunyangPage || !location.hash) return

    const hash = location.hash.slice(1) // "#overview" -> "overview"

    // 해시에 해당하는 nav 항목 찾기
    const targetItem = nav.find(item => {
      if (item.href) return false // href 있는 항목은 제외
      const normalizedLabel = item.label.replace(/\s/g, "").toLowerCase()
      return (
          (hash === "overview" && normalizedLabel.includes("사업개요")) ||
          (hash === "housetype" && normalizedLabel.includes("세대안내")) ||
          (hash === "complex" && normalizedLabel.includes("단지정보"))
      )
    })

    if (targetItem) {
      // 약간의 딜레이 후 스크롤 (페이지 렌더링 대기)
      const timer = setTimeout(() => {
        const targetIndex = nav.indexOf(targetItem)
        onItemClick?.(targetItem, targetIndex)
        // 해시 제거 (선택사항)
        // navigate(location.pathname, { replace: true })
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [location.pathname, location.hash, brandHref, nav, onItemClick])

  // 항상 라이트모드
  React.useEffect(() => {
    const root = document.documentElement
    root.classList.remove("dark")
    try {
      localStorage.setItem("theme", "light")
    } catch { /* empty */ }
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
    window.addEventListener("orientationchange", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
      window.removeEventListener("orientationchange", update)
    }
  }, [onHeightChange])

  // 모바일에서만 "히어로 위/아래" 판단
  React.useEffect(() => {
    const heroEl =
        (heroSelector && (document.querySelector(heroSelector) as HTMLElement | null)) ||
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

  // 스타일
  const headerMode =
      isMobile && overHeroMobile
          ? "border-transparent bg-transparent"
          : "border-border/60 bg-background/80 backdrop-blur"

  const textMain =
      isMobile && overHeroMobile ? "text-white drop-shadow" : "text-foreground"
  const navActive =
      isMobile && overHeroMobile ? "bg-white/15 text-white" : "bg-primary/10 text-primary"
  const navIdle =
      isMobile && overHeroMobile
          ? "text-white/85 hover:text-white hover:bg-white/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"

  // ✅ 라벨 -> 해시 매핑 함수
  const getLabelHash = (label: string): string => {
    const normalized = label.replace(/\s/g, "").toLowerCase()
    if (normalized.includes("사업개요")) return "overview"
    if (normalized.includes("세대안내")) return "housetype"
    if (normalized.includes("단지정보")) return "complex"
    return ""
  }

  // ✅ 스크롤/라우팅 공통 처리
  const handleScrollOrRoute = (item: NavItem, idx: number) => {
    if (item.disabled) return
    if (item.href) return // NavLink가 처리

    // ✅ 정확히 /bunyang 페이지에 있을 때만 스크롤
    const isOnBunyangPage = location.pathname === brandHref || location.pathname === brandHref + "/"

    if (isOnBunyangPage) {
      onItemClick?.(item, idx)
      return
    }

    // 다른 경로에서는 /bunyang으로 이동 + 해시 추가
    const hash = getLabelHash(item.label)
    if (hash) {
      navigate({ pathname: brandHref, hash: `#${hash}` })
    } else {
      navigate(brandHref)
    }
  }

  return (
      <>
        {/* 고정 헤더 */}
        <header
            ref={headerRef}
            className={cn(
                "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ease-out will-change-[background-color,color]",
                "pt-[max(0px,env(safe-area-inset-top))]",
                headerMode,
                className
            )}
        >
          {/* 모바일 히어로 위에서만 그라데이션 오버레이 */}
          {isMobile && overHeroMobile && (
              <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-transparent"
              />
          )}

          <div className="container mx-auto h-16 px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-3 relative">
            {/* 좌측: 브랜드 + 데스크탑 네비 */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button
                  type="button"
                  variant="ghost"
                  asChild
                  className={cn(
                      "h-10 px-2 sm:px-3 font-semibold",
                      "text-[clamp(14px,2.4vw,18px)] leading-tight",
                      textMain,
                      isBrandActive && !overHeroMobile && "text-primary",
                      isMobile && overHeroMobile && "hover:text-white/90",
                      "whitespace-pre-wrap break-keep"
                  )}
                  onClick={onBrandClick}
              >
                <NavLink to={brandHref}>{brand}</NavLink>
              </Button>

              <nav className="hidden md:flex items-center gap-1 min-w-0">
                {nav.map((item, idx) => {
                  const routeActive =
                      !!item.href &&
                      (location.pathname === item.href || location.pathname.startsWith(item.href + "/"))

                  return item.href ? (
                      <NavLink key={`${item.label}-${idx}`} to={item.href}>
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={item.disabled}
                            className={cn(
                                "rounded-xl px-3 py-2 text-sm transition-colors min-w-0",
                                "max-w-[20ch] truncate",
                                routeActive ? navActive : navIdle
                            )}
                            title={item.label}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                              <span className="ml-2 rounded-md px-1.5 py-0.5 text-[10px] leading-none bg-primary/10 text-primary">
                          {item.badge}
                        </span>
                          )}
                        </Button>
                      </NavLink>
                  ) : (
                      <Button
                          key={`${item.label}-${idx}`}
                          type="button"
                          variant="ghost"
                          disabled={item.disabled}
                          onClick={() => handleScrollOrRoute(item, idx)}
                          className={cn(
                              "rounded-xl px-3 py-2 text-sm transition-colors min-w-0",
                              "max-w-[20ch] truncate",
                              navIdle
                          )}
                          title={item.label}
                      >
                    <span className={cn("truncate", isMobile && overHeroMobile && "drop-shadow")}>
                      {item.label}
                    </span>
                        {item.badge && (
                            <span className="ml-2 rounded-md px-1.5 py-0.5 text-[10px] leading-none bg-primary/10 text-primary">
                        {item.badge}
                      </span>
                        )}
                      </Button>
                  )
                })}
              </nav>
            </div>

            {/* 우측: 액션들 */}
            <div className="flex items-center gap-2 shrink-0">
              {contactLabel && (
                  <Button
                      type="button"
                      variant="default"
                      className={cn(
                          "hidden sm:inline-flex cursor-pointer rounded-xl",
                          "bg-red-600 hover:bg-red-700 text-white border-none shadow-sm"
                      )}
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
              )}

              {rightSlot}

              <MobileMenu
                  brand={brand}
                  nav={nav}
                  contactLabel={contactLabel}
                  onItemClick={onItemClick}
                  overHeroMobile={isMobile && overHeroMobile}
                  footerLinks={mobileFooterLinks}
                  currentPath={location.pathname}
                  brandHref={brandHref}
                  onScrollOrRoute={(item) => handleScrollOrRoute(item, -1)}
              />
            </div>
          </div>
        </header>

        {/* 고정 헤더 자리 보정용 spacer */}
        <div
            aria-hidden
            style={{ height: `var(--nav-h, ${navH}px)` }}
            className={cn("w-full", isMobile && overHeroMobile ? "hidden" : "block")}
        />
      </>
  )
}

/* ───────────────────────── 모바일 메뉴 ───────────────────────── */
const MobileMenu: React.FC<{
  brand: string
  nav: NavItem[]
  contactLabel?: string
  onItemClick?: (item: NavItem, index: number) => void
  overHeroMobile?: boolean
  footerLinks?: { label: string; onClick?: () => void }[]
  currentPath: string
  brandHref: string
  onScrollOrRoute: (item: NavItem) => void
}> = ({
        brand,
        nav,
        contactLabel,
        onItemClick,
        overHeroMobile,
        footerLinks,
        currentPath,
        onScrollOrRoute,
      }) => {
  const [openMap, setOpenMap] = React.useState<Record<number, boolean>>(
      () => Object.fromEntries(nav.map((_, i) => [i, i === 0])) as Record<number, boolean>
  )
  const toggle = (i: number) =>
      setOpenMap((m) => ({
        ...m,
        [i]: !m[i],
      }))

  const isRouteActive = (href?: string) =>
      !!href && (currentPath === href || currentPath.startsWith(href + "/"))

  return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
              variant="outline"
              size="icon"
              className={cn(
                  "md:hidden rounded-xl",
                  overHeroMobile && "border-white/30 text-white bg-white/10 hover:bg-white/20"
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

          <div className="mt-2 overflow-y-auto max-h-[calc(100vh-160px)] pb-6">
            {nav.map((section, idx) => {
              const isGroup = !!section.children?.length
              const isOpen = !!openMap[idx]

              return (
                  <div key={`${section.label}-${idx}`} className="py-4">
                    {isGroup ? (
                        <button
                            type="button"
                            onClick={() => toggle(idx)}
                            className="w-full flex items-center justify-between"
                        >
                          <h3
                              className={cn(
                                  "text-[28px] leading-[1.2] font-extrabold tracking-tight",
                                  isOpen || isRouteActive(section.href)
                                      ? "text-orange-500"
                                      : "text-gray-900"
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
                    ) : section.href ? (
                        <SheetClose asChild>
                          <NavLink to={section.href}>
                            <button
                                type="button"
                                disabled={section.disabled}
                                className={cn(
                                    "w-full text-left text-[28px] leading-[1.2] font-extrabold tracking-tight",
                                    isRouteActive(section.href)
                                        ? "text-orange-500"
                                        : section.disabled
                                            ? "text-gray-300"
                                            : "text-gray-900 hover:text-orange-500"
                                )}
                            >
                              {section.label}
                            </button>
                          </NavLink>
                        </SheetClose>
                    ) : (
                        <SheetClose asChild>
                          <button
                              type="button"
                              disabled={section.disabled}
                              onClick={() => onScrollOrRoute(section)}
                              className={cn(
                                  "w-full text-left text-[28px] leading-[1.2] font-extrabold tracking-tight",
                                  section.disabled ? "text-gray-300" : "text-gray-900 hover:text-orange-500"
                              )}
                          >
                            {section.label}
                          </button>
                        </SheetClose>
                    )}

                    {isGroup && isOpen && (
                        <div className="mt-4 space-y-5 pl-1">
                          {section.children!.map((child, ci) =>
                              child.href ? (
                                  <SheetClose asChild key={`${child.label}-${ci}`}>
                                    <NavLink to={child.href}>
                                      <button
                                          type="button"
                                          disabled={child.disabled}
                                          className={cn(
                                              "block w-full text-left text-[20px] leading-6",
                                              isRouteActive(child.href)
                                                  ? "text-orange-500"
                                                  : child.disabled
                                                      ? "text-gray-300"
                                                      : "text-gray-700 hover:text-gray-900"
                                          )}
                                      >
                                        {child.label}
                                      </button>
                                    </NavLink>
                                  </SheetClose>
                              ) : (
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
                              )
                          )}
                        </div>
                    )}
                  </div>
              )
            })}

            {contactLabel && (
                <div className="mt-6">
                  <SheetClose asChild>
                    <Button
                        type="button"
                        className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white border-none shadow-sm"
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

          {footerLinks && footerLinks.length > 0 && (
              <div className="border-t pt-3 text-sm text-gray-400">
                <div className="flex items-center gap-3 flex-wrap">
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
