// src/components/carousel/PromoCarousel.tsx
"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {smartDial} from "@/lib/smartDial.ts";

export type CarouselSlide = {
    image: string // 배경 이미지 URL
    headline: string
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
                                                            }) => {
    const [index, setIndex] = React.useState(() => clampIndex(initial, slides.length))
    const [controls, setControls] = React.useState(false)
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
                "rounded-none",
                heightClass,
                "border border-white/10 bg-black",
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

                        {/* 어둡게 그라데이션 오버레이 */}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.35)_40%,rgba(0,0,0,0.6)_100%)]" />

                        {/* 콘텐츠 */}
                        <div className="relative z-10 h-full w-full px-5 md:px-10 pb-[env(safe-area-inset-bottom)] pt-[var(--head-safe)]">
                            <div className="h-full max-w-4xl flex flex-col justify-end md:justify-center gap-4 py-8">
                                {s.badge && (
                                    <span className="w-fit rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] tracking-wide text-white/90">
                    {s.badge}
                  </span>
                                )}
                                <h2 className="whitespace-pre-line text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow">
                                    {s.headline}
                                </h2>
                                {s.sub && (
                                    <p className="text-sm md:text-base text-white/80 max-w-2xl">
                                        {s.sub}
                                    </p>
                                )}
                                {s.ctaLabel && (
                                    <div className="pt-2">
                                        <Button
                                            onClick={() =>
                                                smartDial("053-760-4818", {
                                                    desktopApp: "facetime",
                                                    onFail: () => alert("앱을 찾을 수 없습니다. tel로 직접 걸어주세요: 053-760-4818"),
                                                })}
                                            type="button"
                                            size="lg"
                                            className="rounded-xl cursor-pointer"
                                            data-carousel-interactive="true"
                                            // onClick={() => showControls(2000)}
                                        >
                                            {s.ctaLabel}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* arrows: 데스크톱은 hover 시, 모바일은 터치 시 잠깐 노출 */}
            {showArrows && count > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="이전 슬라이드"
                        onClick={() => { prev(); showControls(1500) }}
                        data-carousel-interactive="true"
                        className={cn(baseArrow, "left-3 md:left-4 z-20", controls ? visibleArrow : hiddenArrow)}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="다음 슬라이드"
                        onClick={() => { next(); showControls(1500) }}
                        data-carousel-interactive="true"
                        className={cn(baseArrow, "right-3 md:right-4 z-20", controls ? visibleArrow : hiddenArrow)}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </>
            )}

            {/* indicators */}
            {showIndicators && count > 1 && (
                <div className="absolute bottom-3 md:bottom-5 left-0 right-0 flex items-center justify-center gap-2 z-20">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`${i + 1}번째로 이동`}
                            onClick={() => { go(i); showControls(1500) }}
                            data-carousel-interactive="true"
                            className={cn(
                                "h-1.5 w-6 rounded-full transition-all",
                                i === index ? "bg-white/90 w-8" : "bg-white/40 hover:bg-white/60"
                            )}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

const baseArrow =
    "absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 w-10 rounded-full " +
    "bg-white/85 text-black shadow-lg ring-1 ring-black/10 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-opacity duration-200"
const hiddenArrow = "opacity-0 pointer-events-none"
const visibleArrow = "opacity-100 pointer-events-auto"

function normalizeIndex(i: number, len: number) {
    if (len === 0) return 0
    return ((i % len) + len) % len
}
function clampIndex(i: number, len: number) {
    if (len === 0) return 0
    return Math.max(0, Math.min(i, len - 1))
}
