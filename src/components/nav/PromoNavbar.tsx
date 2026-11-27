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
import { ChevronDown, ChevronUp } from "@/components/common/icons"
import { smartDial } from "@/lib/smartDial"
import elifeCloud from "@/assets/logo/elife-cloud.png"

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
  /** 브랜드 텍스트 앞에 붙는 로고 이미지 (기본: e편한세상 구름 로고, null이면 숨김) */
  brandLogo?: string | null
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

// "분양문의 010-0000-0000" → 앞 글자는 옅게, 번호는 굵게 (아이콘 없이 글자만)
const PhoneLabel: React.FC<{ text: string }> = ({ text }) => {
  const m = text.match(/^(.*?)\s*([0-9][0-9\-. ]+)$/)
  if (!m) return <>{text}</>
  return (
      <>
        {m[1] && <span className="text-[13px] font-medium opacity-70">{m[1]}</span>}
        <span>{m[2]}</span>
      </>
  )
}

const NAV_LINK =
    "inline-flex items-center gap-1.5 whitespace-nowrap py-2 text-[14px] font-semibold tracking-[0.01em] transition-colors disabled:opacity-40"
const NAV_BADGE = "text-[10px] font-bold tracking-normal text-brand"

/* ───────────────────────── 본컴포넌트 ───────────────────────── */
export const PromoNavbar: React.FC<PromoNavbarProps> = ({
                                                          brand = "분양홍보",
                                                          brandLogo = elifeCloud,
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
      // 히어로가 없는 페이지는 항상 흰 헤더
      if (!heroEl) {
        setOverHeroMobile(false)
        return
      }
      const rect = heroEl.getBoundingClientRect()
      setOverHeroMobile(rect.bottom > navH + 8)
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
  const overHero = overHeroMobile // 히어로 이미지 위에 떠 있는 동안(모든 화면 크기)
  const headerMode = overHero
      ? "border-transparent bg-transparent"
      : "border-neutral-200/70 bg-white/90 backdrop-blur-md"

  const textMain = overHero ? "text-white" : "text-ink"
  const navActive = overHero ? "text-white" : "text-brand"
  const navIdle = overHero
      ? "text-white/70 hover:text-white"
      : "text-neutral-500 hover:text-ink"

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
                "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ease-out",
                "pt-[max(0px,env(safe-area-inset-top))]",
                headerMode,
                className
            )}
        >
          {/* 히어로 위에서만 글자가 읽히도록 옅은 그라데이션 */}
          {overHero && (
              <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-transparent"
              />
          )}

          <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 section-padding">
            {/* 좌측: 브랜드 + 데스크탑 네비 */}
            <div className="flex min-w-0 items-center gap-6 xl:gap-10">
              {/* 브랜드: e편한세상 구름 로고 + 단지명 */}
              <NavLink
                  to={brandHref}
                  onClick={onBrandClick}
                  aria-label={brand}
                  className={cn(
                      "flex h-10 min-w-0 shrink-0 items-center gap-2 sm:gap-2.5",
                      textMain
                  )}
              >
                {brandLogo && (
                    <img
                        src={brandLogo}
                        alt=""
                        className="h-[18px] sm:h-5 w-auto shrink-0 select-none"
                        draggable={false}
                    />
                )}
                <span className="truncate text-[15px] sm:text-[17px] font-extrabold leading-none tracking-[-0.03em]">
                  {brand}
                </span>
              </NavLink>

              <nav className="hidden xl:flex items-center gap-7 min-w-0">
                {nav.map((item, idx) => {
                  const routeActive =
                      !!item.href &&
                      (location.pathname === item.href || location.pathname.startsWith(item.href + "/"))

                  return item.href ? (
                      <NavLink key={`${item.label}-${idx}`} to={item.href}>
                        <button
                            type="button"
                            disabled={item.disabled}
                            className={cn(NAV_LINK, routeActive ? navActive : navIdle)}
                        >
                          {item.label}
                          {item.badge && <span className={NAV_BADGE}>{item.badge}</span>}
                        </button>
                      </NavLink>
                  ) : (
                      <button
                          key={`${item.label}-${idx}`}
                          type="button"
                          disabled={item.disabled}
                          onClick={() => handleScrollOrRoute(item, idx)}
                          className={cn(NAV_LINK, navIdle)}
                      >
                        {item.label}
                        {item.badge && <span className={NAV_BADGE}>{item.badge}</span>}
                      </button>
                  )
                })}
              </nav>
            </div>

            {/* 우측: 액션들 */}
            <div className="flex items-center gap-2 shrink-0">
              {contactLabel && (
                  <button
                      type="button"
                      className={cn(
                          "hidden sm:inline-flex cursor-pointer items-center gap-2 text-[15px] font-bold tracking-[0.02em] transition-colors",
                          overHero ? "text-white hover:text-white/80" : "text-ink hover:text-brand"
                      )}
                      onClick={() =>
                          smartDial("010-4539-8505", {
                            desktopApp: "facetime",
                            onFail: () =>
                                alert("앱을 찾을 수 없습니다. tel로 직접 걸어주세요: 010-4539-8505"),
                          })
                      }
                  >
                    <PhoneLabel text={contactLabel} />
                  </button>
              )}

              {rightSlot}

              <MobileMenu
                  brand={brand}
                  nav={nav}
                  contactLabel={contactLabel}
                  onItemClick={onItemClick}
                  overHeroMobile={overHero}
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
            className={cn("w-full", overHero ? "hidden" : "block")}
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
          <button
              type="button"
              aria-label="메뉴 열기"
              className={cn(
                  "xl:hidden -mr-2 inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-70",
                  overHeroMobile ? "text-white" : "text-ink"
              )}
          >
            {/* 표준 3줄 햄버거: 테두리·배경 없이 선만 */}
            <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden
            >
              <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
            </svg>
          </button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[320px] sm:w-[380px] gap-0 border-l-0 px-7 pt-6">
          <SheetHeader className="p-0">
            <SheetTitle className="sr-only">{brand}</SheetTitle>
            <p className="label-caps text-neutral-400">Menu</p>
          </SheetHeader>

          <div className="mt-6 overflow-y-auto max-h-[calc(100vh-150px)] pb-6">
            {nav.map((section, idx) => {
              const isGroup = !!section.children?.length
              const isOpen = !!openMap[idx]

              return (
                  <div key={`${section.label}-${idx}`} className="border-b border-neutral-100 py-[18px]">
                    {isGroup ? (
                        <button
                            type="button"
                            onClick={() => toggle(idx)}
                            className="w-full flex items-center justify-between"
                        >
                          <h3
                              className={cn(
                                  "text-[21px] leading-[1.2] font-bold tracking-[-0.03em]",
                                  isOpen || isRouteActive(section.href)
                                      ? "text-brand"
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
                                    "w-full text-left text-[21px] leading-[1.2] font-bold tracking-[-0.03em]",
                                    isRouteActive(section.href)
                                        ? "text-brand"
                                        : section.disabled
                                            ? "text-gray-300"
                                            : "text-gray-900 hover:text-brand"
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
                                  "w-full text-left text-[21px] leading-[1.2] font-bold tracking-[-0.03em]",
                                  section.disabled ? "text-gray-300" : "text-gray-900 hover:text-brand"
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
                                              "block w-full text-left text-[16px] leading-6",
                                              isRouteActive(child.href)
                                                  ? "text-brand"
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
                                            "block w-full text-left text-[16px] leading-6",
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
                <div className="mt-8">
                  <SheetClose asChild>
                    <Button
                        type="button"
                        className="h-12 w-full rounded-none bg-ink text-[14px] font-semibold tracking-[0.02em] text-white shadow-none hover:bg-black"
                        onClick={() =>
                            smartDial("010-4539-8505", {
                              desktopApp: "facetime",
                              onFail: () =>
                                  alert("앱을 찾을 수 없습니다. tel로 직접 걸어주세요: 010-4539-8505"),
                            })
                        }
                    >
                      {contactLabel}
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
