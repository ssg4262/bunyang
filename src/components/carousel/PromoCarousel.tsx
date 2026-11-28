// src/components/carousel/PromoCarousel.tsx
"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, ChevronLeft, ChevronRight } from "@/components/common/icons"
import {smartDial} from "@/lib/smartDial.ts";

export type CarouselSlide = {
    image: string // 배경 이미지 URL
    headline: string
    /** 제목 아래 주황 띠로 강조할 문구 */
    highlight?: string
    sub?: string
    badge?: string
    /** 슬라이드 하단 좌측(또는 중앙) 버튼 라벨. (링크 없음, 단순 버튼) */
    ctaLabel?: string
}

type HeightMode = "viewportMinusNav" | "fillParent"

export type PromoCarouselProps = {
    slides: CarouselSlide[]
    /** 자동 슬라이드 전환(ms). 0 또는 undefined면 자동 전환 끔 */
    autoMs?: number
    /** 인디케이터(점) 표시 */
    showIndicators?: boolean
    /** 좌우 화살표 표시 */
    showArrows?: boolean
    /** 외부 컨테이너 클래스 */
    className?: string
    /** 초기 인덱스 */
    initial?: number
    /** 인덱스 변경 콜백 */
    onSlideChange?: (index: number) => void
    /** 네브바 높이를 CSS 변수로 주입(오버레이일 때 상단 패딩에 사용) */
    topOffsetPx?: number
    /** 높이 모드: 100svh-네브바 or 부모 높이 꽉 채우기(오버레이 시 사용) */
    heightMode?: HeightMode
    /** 슬라이드 위 작은 라벨 줄에 표시할 단지명 */
    projectName?: string
    /** '관심고객 등록' 버튼 클릭 시 (없으면 버튼 숨김) */
    onRegisterClick?: () => void
}

export const PromoCarousel: React.FC<PromoCarouselProps> = ({
                                                                slides,
                                                                autoMs = 6000,
                                                                showIndicators = true,
                                                                showArrows = true,
                                                                className,
                                                                initial = 0,
                                                                onSlideChange,
                                                                topOffsetPx = 0,
                                                                heightMode = "fillParent", // ⬅ 기본값: 부모 높이 채우기(오버레이용)
                                                                projectName,
                                                                onRegisterClick,
                                                            }) => {
    const [index, setIndex] = React.useState(() => clampIndex(initial, slides.length))
    const [, setControls] = React.useState(false)
    const timerRef = React.useRef<number | null>(null)
    const hideControlsRef = React.useRef<number | null>(null)
    const wrapRef = React.useRef<HTMLDivElement | null>(null)
    const downX = React.useRef<number | null>(null)
    const isHovering = React.useRef(false)

    const count = slides.length
    const go = React.useCallback((next: number) => setIndex(() => normalizeIndex(next, count)), [count])
    const next = React.useCallback(() => go(index + 1), [go, index])
    const prev = React.useCallback(() => go(index - 1), [go, index])

    const showControls = React.useCallback((ms = 1800) => {
        setControls(true)
        if (hideControlsRef.current) window.clearTimeout(hideControlsRef.current)
        hideControlsRef.current = window.setTimeout(() => setControls(false), ms)
    }, [])
    const hideControls = React.useCallback(() => {
        if (hideControlsRef.current) window.clearTimeout(hideControlsRef.current)
        hideControlsRef.current = null
        setControls(false)
    }, [])

    // autoplay
    React.useEffect(() => {
        if (!autoMs || autoMs < 1000 || count <= 1) return
        if (timerRef.current) window.clearInterval(timerRef.current)
        timerRef.current = window.setInterval(() => {
            if (!isHovering.current && !document.hidden) {
                setIndex((i) => normalizeIndex(i + 1, count))
            }
        }, autoMs)
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [autoMs, count])

    // 콜백
    React.useEffect(() => { onSlideChange?.(index) }, [index, onSlideChange])

    // 데스크톱 hover 시 컨트롤 고정 노출
    React.useEffect(() => {
        const el = wrapRef.current
        if (!el) return
        const onEnter = () => { isHovering.current = true; showControls(999999) }
        const onLeave = () => { isHovering.current = false; hideControls() }
        el.addEventListener("mouseenter", onEnter)
        el.addEventListener("mouseleave", onLeave)
        return () => {
            el.removeEventListener("mouseenter", onEnter)
            el.removeEventListener("mouseleave", onLeave)
        }
    }, [showControls, hideControls])

    // 스와이프
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement
        if (target.closest('[data-carousel-interactive="true"]')) return
        downX.current = e.clientX
        ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
        showControls()
    }
    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (downX.current == null) return
        const delta = e.clientX - downX.current
        const threshold = 40
        if (delta > threshold) prev()
        else if (delta < -threshold) next()
        downX.current = null
    }

    // 키보드 접근성
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowLeft") { prev(); showControls(1500) }
        else if (e.key === "ArrowRight") { next(); showControls(1500) }
    }
    const onFocusCapture = () => showControls(999999)
    const onBlurCapture = () => hideControls()

    // CSS 변수 주입: 네브바 높이 & 상단 세이프 패딩
    const styleVar = {
        ["--nav-h" as any]: `${topOffsetPx}px`,
        ["--head-safe" as any]: `calc(var(--nav-h, 0px) + 12px)`,
    } as React.CSSProperties

    const heightClass =
        heightMode === "fillParent"
            ? "h-full" // 부모 컨테이너 높이 100% (헤더가 100svh)
            : "h-[calc(100svh-var(--nav-h,0px))] md:h-auto md:aspect-[21/9]" // 이전 방식

    return (
        <section
            ref={wrapRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="프로모션 케러셀"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onFocusCapture={onFocusCapture}
            onBlurCapture={onBlurCapture}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            style={styleVar}
            className={cn(
                "relative overflow-hidden select-none group",
                heightClass,
                "bg-black",
                className
            )}
        >
            {/* Slides track */}
            <div
                className="h-full w-full flex transition-transform duration-500"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {slides.map((s, i) => (
                    <article
                        key={i}
                        className="relative shrink-0 w-full h-full"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} / ${count}`}
                    >
                        {/* 배경 이미지 */}
                        <img
                            src={s.image as any}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                            draggable={false}
                        />

                        {/* 글자가 읽히도록: 아래쪽과 왼쪽을 어둡게 */}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.1)_30%,rgba(0,0,0,0.78)_68%,rgba(0,0,0,0.9)_100%)] md:bg-[linear-gradient(180deg,rgba(0,0,0,0.38)_0%,rgba(0,0,0,0.12)_38%,rgba(0,0,0,0.72)_100%)]" />
                        <div className="absolute inset-0 hidden md:block bg-[linear-gradient(90deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,0)_75%)]" />

                        {/* 콘텐츠 */}
                        <div className="relative z-10 mx-auto h-full w-full max-w-7xl section-padding pb-[env(safe-area-inset-bottom)] pt-[var(--head-safe)]">
                            <div className="flex h-full max-w-3xl flex-col justify-end md:justify-center pb-20 md:pb-10">
                                {/* 번호 — 선 — 단지명 */}
                                <div className="flex items-center gap-3 text-white/70">
                                    <span className="label-caps tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                                    <span aria-hidden className="h-px w-10 bg-white/40" />
                                    <span className="text-[12px] md:text-[13px] font-medium tracking-[0.06em]">
                                        {projectName ?? s.badge}
                                    </span>
                                    {projectName && s.badge && (
                                        <span className="text-[11px] font-bold tracking-[0.04em] text-brand">{s.badge}</span>
                                    )}
                                </div>

                                <h2 className="heading-display mt-4 md:mt-5 whitespace-pre-line text-[clamp(21px,6.1vw,30px)] sm:text-[36px] lg:text-[44px] 2xl:text-[52px] text-white">
                                    {renderEmphasis(s.headline)}
                                </h2>
                                {s.highlight && (
                                    <>
                                        <span aria-hidden className="mt-5 md:mt-7 block h-px w-14 bg-white/45" />
                                        <p className="heading-display mt-5 md:mt-7 whitespace-pre-line text-[clamp(21px,6.1vw,30px)] sm:text-[36px] lg:text-[44px] 2xl:text-[52px] text-white">
                                            {renderEmphasis(s.highlight)}
                                        </p>
                                    </>
                                )}
                                {s.sub && (
                                    <p className="mt-4 md:mt-5 max-w-xl text-[14px] md:text-[17px] font-light leading-relaxed text-white/75">
                                        {s.sub}
                                    </p>
                                )}

                                {(s.ctaLabel || onRegisterClick) && (
                                    <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-2.5">
                                        {onRegisterClick && (
                                            <button
                                                type="button"
                                                data-carousel-interactive="true"
                                                onClick={onRegisterClick}
                                                className="inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 bg-brand px-7 text-[14px] font-semibold tracking-[0.04em] text-white transition-colors hover:bg-brand-dark"
                                            >
                                                관심고객 등록
                                                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                                            </button>
                                        )}
                                        {s.ctaLabel && (
                                            <button
                                                type="button"
                                                data-carousel-interactive="true"
                                                onClick={() =>
                                                    smartDial("010-4539-8505", {
                                                        desktopApp: "facetime",
                                                        onFail: () =>
                                                            alert("앱을 찾을 수 없습니다. tel로 직접 걸어주세요: 010-4539-8505"),
                                                    })
                                                }
                                                className="inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 bg-white px-7 text-[14px] font-bold tracking-[0.02em] text-ink transition-colors hover:bg-white/90"
                                            >
                                                {s.ctaLabel}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* arrows + 번호: 오른쪽 아래 */}
            {count > 1 && (showArrows || showIndicators) && (
                <div className="absolute bottom-6 md:bottom-10 inset-x-0 z-20 pointer-events-none">
                    <div className="mx-auto flex max-w-7xl items-center justify-between section-padding">
                        {showIndicators ? (
                            <div className="pointer-events-auto flex items-center gap-2">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        aria-label={`${i + 1}번째로 이동`}
                                        onClick={() => { go(i); showControls(1500) }}
                                        data-carousel-interactive="true"
                                        className="group/ind flex h-6 items-center"
                                    >
                                        <span
                                            className={cn(
                                                "block h-[2px] transition-all duration-300",
                                                i === index ? "w-12 bg-white" : "w-6 bg-white/35 group-hover/ind:bg-white/60"
                                            )}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 label-caps tabular-nums text-white/70">
                                    {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                                </span>
                            </div>
                        ) : <span />}

                        {showArrows && (
                            <div className="pointer-events-auto hidden md:flex items-center">
                                <button
                                    type="button"
                                    aria-label="이전 슬라이드"
                                    onClick={() => { prev(); showControls(1500) }}
                                    data-carousel-interactive="true"
                                    className={baseArrow}
                                >
                                    <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                                </button>
                                <button
                                    type="button"
                                    aria-label="다음 슬라이드"
                                    onClick={() => { next(); showControls(1500) }}
                                    data-carousel-interactive="true"
                                    className={cn(baseArrow, "-ml-px")}
                                >
                                    <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}

const baseArrow =
    "inline-flex h-12 w-12 items-center justify-center border border-white/30 text-white transition-colors " +
    "hover:bg-white hover:text-black focus:outline-none focus-visible:bg-white focus-visible:text-black"

function normalizeIndex(i: number, len: number) {
    if (len === 0) return 0
    return ((i % len) + len) % len
}
function clampIndex(i: number, len: number) {
    if (len === 0) return 0
    return Math.max(0, Math.min(i, len - 1))
}

// "*강조*" 로 감싼 부분만 주황색으로 표시
function renderEmphasis(text: string) {
    return text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
            <span key={i} className="text-brand">{part.slice(1, -1)}</span>
        ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
        )
    )
}
