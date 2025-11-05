// src/components/sections/HousePhotoRail.tsx
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"

/* ======================== Types ======================== */
export type RoomKind =
    | "거실"
    | "주방"
    | "침실"
    | "욕실"
    | "드레스룸"
    | "현관"
    | "발코니"
    | "기타"
    | "모델"
    | "상가"

export type HousePhoto = {
    id: string | number
    src: string
    alt: string
    room: RoomKind
    caption?: string
    width?: number
    height?: number
}

export type HousePhotoRailProps = {
    photos: HousePhoto[]
    className?: string
    /** 기본 선택 필터 (없으면 전체) */
    defaultFilter?: RoomKind | "전체"
    /** 카드 높이(px) — 반응형은 clamp 사용 */
    cardHeight?: number
    /** 썸네일 높이(px) */
    thumbHeight?: number
    /** 다크/라이트 상관없이 테두리 옅게 줄지 */
    subtleBorder?: boolean
    /** 라이트박스 비활성화 (이미지 클릭 시 확대 안함) */
    disableLightbox?: boolean
}

/* ======================== Component ======================== */
export const HousePhotoGallery: React.FC<HousePhotoRailProps> = ({
                                                                     photos,
                                                                     className,
                                                                     defaultFilter = "전체",
                                                                     cardHeight = 260,
                                                                     thumbHeight = 68,
                                                                     subtleBorder = true,
                                                                     disableLightbox = false,
                                                                 }) => {
    const [filter, setFilter] = React.useState<RoomKind | "전체">(defaultFilter)
    const [open, setOpen] = React.useState(false)
    const [lightIdx, setLightIdx] = React.useState(0)

    // 좌우 버튼 노출 판단 (이미지 레일)
    const [canScroll, setCanScroll] = React.useState(false)
    // 필터 칩 레일 오버플로우 판단 (모바일 전용)
    const [canScrollFilters, setCanScrollFilters] = React.useState(false)

    const railRef = React.useRef<HTMLDivElement>(null)
    const filterRailRef = React.useRef<HTMLDivElement>(null)

    const filtered = React.useMemo(
        () => (filter === "전체" ? photos : photos.filter((p) => p.room === filter)),
        [filter, photos]
    )

    // 필터 목록 자동 생성
    const rooms: (RoomKind | "전체")[] = React.useMemo(() => {
        const set = new Set<RoomKind>(photos.map((p) => p.room))
        return ["전체", ...Array.from(set)]
    }, [photos])

    const updateArrows = React.useCallback(() => {
        const el = railRef.current
        if (!el) return
        setCanScroll(el.scrollWidth > el.clientWidth + 1)
    }, [])

    const updateFilterArrows = React.useCallback(() => {
        const el = filterRailRef.current
        if (!el) return
        setCanScrollFilters(el.scrollWidth > el.clientWidth + 1)
    }, [])

    // 스크롤 이동
    const scrollBy = (dx: number) => {
        railRef.current?.scrollBy({ left: dx, behavior: "smooth" })
    }

    // 마우스로 드래그 스크롤
    const drag = React.useRef<{ x: number; sx: number; isDown: boolean }>({
        x: 0,
        sx: 0,
        isDown: false,
    })
    const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        const el = railRef.current
        if (!el) return
        drag.current = { x: e.clientX, sx: el.scrollLeft, isDown: true }
        el.classList.add("cursor-grabbing")
    }
    const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (!drag.current.isDown) return
        const el = railRef.current
        if (!el) return
        const dx = e.clientX - drag.current.x
        el.scrollLeft = drag.current.sx - dx
    }
    const onMouseUp: React.MouseEventHandler<HTMLDivElement> = () => {
        const el = railRef.current
        if (!el) return
        drag.current.isDown = false
        el.classList.remove("cursor-grabbing")
    }
    const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
        if (!drag.current.isDown) return
        drag.current.isDown = false
        railRef.current?.classList.remove("cursor-grabbing")
    }

    // 수평 휠(트랙패드) 지원
    React.useEffect(() => {
        const el = railRef.current
        if (!el) return
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
            if (e.ctrlKey) return
            el.scrollBy({ left: e.deltaY, behavior: "auto" })
            e.preventDefault()
        }
        el.addEventListener("wheel", onWheel, { passive: false })
        return () => el.removeEventListener("wheel", onWheel)
    }, [])

    // 라이트박스 키보드 이동
    React.useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight")
                setLightIdx((i) => (i + 1) % Math.max(filtered.length, 1))
            else if (e.key === "ArrowLeft")
                setLightIdx((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1))
            else if (e.key === "Escape") setOpen(false)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [open, filtered.length])

    // 터치 스와이프 (라이트박스)
    const touchRef = React.useRef<{ x: number; y: number } | null>(null)
    const onTouchStart = (e: React.TouchEvent) => {
        const t = e.touches[0]
        touchRef.current = { x: t.clientX, y: t.clientY }
    }
    const onTouchEnd = (e: React.TouchEvent) => {
        if (!touchRef.current) return
        const t = e.changedTouches[0]
        const dx = t.clientX - touchRef.current.x
        if (Math.abs(dx) > 40)
            setLightIdx(
                (i) => (i + (dx < 0 ? 1 : -1) + filtered.length) % filtered.length
            )
        touchRef.current = null
    }

    const openAt = (i: number) => {
        if (disableLightbox) return
        setLightIdx(i)
        setOpen(true)
    }

    // 이미지 로드 후 / 필터 변경 / 리사이즈 시 버튼 노출 재계산
    const onImgLoad = () => setTimeout(updateArrows, 80)

    React.useEffect(() => {
        const el = railRef.current
        if (!el) return

        const onScroll = () => updateArrows()
        el.addEventListener("scroll", onScroll, { passive: true })
        const onResize = () => updateArrows()
        window.addEventListener("resize", onResize)

        const ro = new ResizeObserver(() => updateArrows())
        ro.observe(el)
        const mo = new MutationObserver(() => updateArrows())
        mo.observe(el, { childList: true, subtree: true, attributes: true })

        const timers = [
            setTimeout(updateArrows, 30),
            setTimeout(updateArrows, 150),
            setTimeout(updateArrows, 400),
        ]

        return () => {
            timers.forEach(clearTimeout)
            el.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onResize)
            ro.disconnect()
            mo.disconnect()
        }
    }, [filtered.length, updateArrows])

    React.useEffect(() => {
        const t = setTimeout(updateArrows, 60)
        return () => clearTimeout(t)
    }, [filter, updateArrows])

    // 모바일 필터 레일 관찰
    React.useEffect(() => {
        const el = filterRailRef.current
        if (!el) return
        const ro = new ResizeObserver(() => updateFilterArrows())
        ro.observe(el)
        const timers = [
            setTimeout(updateFilterArrows, 20),
            setTimeout(updateFilterArrows, 120),
        ]
        window.addEventListener("resize", updateFilterArrows)
        return () => {
            timers.forEach(clearTimeout)
            ro.disconnect()
            window.removeEventListener("resize", updateFilterArrows)
        }
    }, [rooms.length, updateFilterArrows])

    return (
        <section className={cn("w-full py-10 md:py-14", className)}>
            {/* ===== 헤더 ===== */}
            <div className="container mx-auto max-w-6xl px-4">
                {/* 타이틀 / 데스크탑 필터 */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs md:text-sm text-muted-foreground/80">실내 사진</p>
                        <h2
                            className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight
                         break-keep whitespace-nowrap md:whitespace-normal"
                        >
                            갤러리
                        </h2>
                    </div>

                    {/* 데스크탑: 랩핑 버튼 */}
                    <div className="hidden md:flex flex-wrap gap-2 justify-end shrink-0">
                        {rooms.map((r) => (
                            <Button
                                key={r}
                                variant={filter === r ? "default" : "outline"}
                                className={cn(
                                    "h-8 rounded-2xl px-3",
                                    filter === r
                                        ? "shadow-sm"
                                        : "border-border/50 text-foreground/80 hover:text-foreground"
                                )}
                                onClick={() => setFilter(r)}
                            >
                                {r}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* 모바일: 가로 스크롤 칩 레일 */}
                <div className="relative md:hidden mt-3">
                    {/* 좌/우 페이드 그라데이션 (오버플로우 있을 때만) */}
                    <div
                        className={cn(
                            "pointer-events-none absolute left-0 top-0 h-full w-6 z-10",
                            "bg-gradient-to-r from-background to-transparent transition-opacity",
                            canScrollFilters ? "opacity-100" : "opacity-0"
                        )}
                    />
                    <div
                        className={cn(
                            "pointer-events-none absolute right-0 top-0 h-full w-6 z-10",
                            "bg-gradient-to-l from-background to-transparent transition-opacity",
                            canScrollFilters ? "opacity-100" : "opacity-0"
                        )}
                    />

                    <div
                        ref={filterRailRef}
                        className={cn(
                            "flex items-center gap-2 overflow-x-auto",
                            "snap-x snap-mandatory px-1",
                            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        )}
                    >
                        {rooms.map((r) => (
                            <Button
                                key={`m-${r}`}
                                variant={filter === r ? "default" : "outline"}
                                className={cn(
                                    "h-9 rounded-2xl px-3 whitespace-nowrap snap-start",
                                    filter === r
                                        ? "shadow-sm"
                                        : "border-border/50 text-foreground/80"
                                )}
                                onClick={() => setFilter(r)}
                            >
                                {r}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== 가로 스냅 레일 ===== */}
            <div className="container mx-auto max-w-6xl px-4 mt-4">
                <div className="relative">
                    {/* 좌/우 버튼: 항상 DOM에 두고 투명도만 토글 */}
                    <div
                        className={cn(
                            "pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center transition-opacity",
                            canScroll ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="pointer-events-auto rounded-full bg-background/70 backdrop-blur hover:bg-background"
                            onClick={() => scrollBy(-window.innerWidth * 0.8)}
                            aria-label="왼쪽으로"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </div>
                    <div
                        className={cn(
                            "pointer-events-none absolute inset-y-0 right-0 z-20 flex items-center transition-opacity",
                            canScroll ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="pointer-events-auto rounded-full bg-background/70 backdrop-blur hover:bg-background"
                            onClick={() => scrollBy(window.innerWidth * 0.8)}
                            aria-label="오른쪽으로"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    <div
                        ref={railRef}
                        className={cn(
                            "group relative flex gap-4 overflow-x-auto overflow-y-hidden",
                            "scroll-smooth snap-x snap-mandatory",
                            "px-0 py-1 select-none cursor-grab",
                            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        )}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseLeave}
                    >
                        {filtered.map((p, i) => (
                            <figure
                                key={p.id}
                                className={cn(
                                    "snap-start shrink-0 overflow-hidden",
                                    "rounded-2xl bg-white shadow-sm transition hover:shadow-lg",
                                    subtleBorder && "border border-black/5 dark:border-white/10"
                                )}
                                style={{
                                    height: `clamp(200px, ${cardHeight}px, 50vh)`,
                                    aspectRatio: "3 / 2",
                                }}
                            >
                                <button
                                    type="button"
                                    className="relative block h-full w-full"
                                    onClick={() => openAt(i)}
                                >
                                    <img
                                        src={p.src}
                                        alt={p.alt}
                                        className="h-full w-full object-cover"
                                        draggable={false}
                                        onLoad={onImgLoad}
                                    />

                                    {/* 상단 라벨 */}
                                    <div className="pointer-events-none absolute left-2 top-2">
                                        <Badge variant="secondary">{p.room}</Badge>
                                    </div>

                                    {/* 하단 캡션 그라데이션 */}
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2">
                                        <div className="rounded-xl bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                                            <p className="truncate text-sm font-medium text-white">
                                                {p.caption ?? p.alt}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </figure>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== Lightbox ===== */}
            {!disableLightbox && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent
                        className="max-w-5xl w-[96vw] p-0 overflow-hidden [&>button]:hidden"
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    >
                        {/* 상단 바 */}
                        <div className="flex items-center justify-between px-3 py-2 border-b bg-background/80 backdrop-blur">
                            <div className="flex items-center gap-2 min-w-0">
                                <Badge>{filtered[lightIdx]?.room}</Badge>
                                <span className="text-sm font-medium truncate max-w-[60vw]">
                  {filtered[lightIdx]?.caption ?? filtered[lightIdx]?.alt}
                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" asChild className="rounded-lg" title="새 탭에서 보기">
                                    <a href={filtered[lightIdx]?.src} target="_blank" rel="noreferrer">
                                        <Maximize2 className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="rounded-lg"
                                    onClick={() => setOpen(false)}
                                    title="닫기"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* 이미지 영역 */}
                        <div className="relative bg-black/80">
                            <button
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 hover:bg-black/60"
                                onClick={() =>
                                    setLightIdx((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1))
                                }
                                aria-label="이전"
                            >
                                <ChevronLeft className="h-6 w-6 text-white" />
                            </button>
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 hover:bg-black/60"
                                onClick={() => setLightIdx((i) => (i + 1) % Math.max(filtered.length, 1))}
                                aria-label="다음"
                            >
                                <ChevronRight className="h-6 w-6 text-white" />
                            </button>

                            <img
                                src={filtered[lightIdx]?.src}
                                alt={filtered[lightIdx]?.alt}
                                className="mx-auto max-h-[78svh] w-auto object-contain select-none"
                                draggable={false}
                            />
                        </div>

                        {/* 썸네일 바 */}
                        <div className="flex gap-2 overflow-x-auto border-t p-3">
                            {filtered.map((p, i) => (
                                <button
                                    key={`thumb-${p.id}`}
                                    onClick={() => setLightIdx(i)}
                                    className={cn(
                                        "flex-shrink-0 overflow-hidden rounded-lg border",
                                        i === lightIdx
                                            ? "border-orange-500 ring-2 ring-orange-500/30"
                                            : "border-transparent"
                                    )}
                                    style={{ height: thumbHeight, width: Math.round(thumbHeight * (3 / 2)) }}
                                    aria-label={`${p.room} 미리보기`}
                                >
                                    <img
                                        src={p.src}
                                        alt={p.alt}
                                        className="h-full w-full object-cover"
                                        draggable={false}
                                    />
                                </button>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </section>
    )
}
