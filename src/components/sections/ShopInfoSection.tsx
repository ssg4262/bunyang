"use client";

// src/components/sections/ShopInfoSection.tsx
// - 모바일/데스크탑: 1장 캐러셀(이미지 단독) + 이미지 우상단 '분양문의' 버튼 + 하단 인디케이터
// - 캡션 잘림 방지(세로 overflow 허용)
// - 라이트박스: 완전 풀스크린(여백 0) + 투명 배경(Overlay/Content 모두 bg-transparent)
// - 이미지 밖 클릭 시 라이트박스 닫기
// - 이미지 스크롤바 노출 방지(overflow-hidden)
// - 좌우 화살표: 모바일/데스크탑 모두 항상 표시
// - 스와이프: 손가락/포인터 이동 추적하여 자연스러운 드래그 이동

import { Reveal } from "@/components/common/Reveal"
import { VIEWER_ARROW, VIEWER_BAR, VIEWER_CONTENT, VIEWER_COUNT, VIEWER_ICON_BTN, pad2 } from "@/components/sections/viewerStyles"
import { SectionHeader } from "@/components/sections/SectionHeader"
import React from "react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "@/components/common/icons";

/* ------------------------------------ Types ----------------------------------- */
export type ShopImage = {
    src: string;
    title?: string;
    subtitle?: string;
    badge?: string;
};

export type ShopInfoSectionProps = {
    items: ShopImage[];
    title?: string;
    className?: string;
    paddingXClass?: string; // 섹션 좌우 여백
    mobileHeightClass?: string; // 기본 h-auto
    desktopHeightClass?: string; // 기본 h-auto
    autoMs?: number;
    rounded?: boolean; // 이미지 모서리
    showCaption?: boolean; // 이미지 '아래' 타이틀/서브 표시
    onCallClick?: () => void; // 전화 버튼 클릭 시 커스텀 핸들러(선택)
};

/* ---------------------------------- Helpers ---------------------------------- */
const mod = (n: number, m: number) => ((n % m) + m) % m;

/* ================================ Main Section ================================ */
export const ShopInfoSection: React.FC<ShopInfoSectionProps> = ({
                                                                    items,
                                                                    title = "상가분양안내",
                                                                    className,
                                                                    paddingXClass = "section-padding",
                                                                    mobileHeightClass = "h-auto",
                                                                    desktopHeightClass = "h-auto",
                                                                    autoMs = 0,
                                                                    rounded = false,
                                                                    showCaption = true,
                                                                    onCallClick,
                                                                }) => {
    const [open, setOpen] = React.useState(false);
    const [lightIdx, setLightIdx] = React.useState(0);
    const count = items.length;

    const openAt = (i: number) => {
        setLightIdx(i);
        setOpen(true);
    };
    const goLight = (n: number) => setLightIdx((i) => mod(i + n, count));

    const handleCall = () => {
        onCallClick?.();
        if (!onCallClick) window.location.href = "tel:01045398505";
    };

    return (
        <section
            className={cn("mx-auto max-w-7xl w-full pt-16 md:pt-28 pb-12 md:pb-20", paddingXClass, className)}
        >
            {/* 타이틀 */}
            <header className="mb-9 md:mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <SectionHeader
                    eyebrow="COMMERCIAL"
                    title={title}
                    description="원하시는 호실·평형·분양가를 빠르게 상담받아 보세요."
                    className="mb-0 md:mb-0"
                />
                <a
                    href="tel:01045398505"
                    onClick={(e) => { if (onCallClick) { e.preventDefault(); handleCall(); } }}
                    className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 bg-ink px-7 text-[14px] font-semibold tracking-[0.02em] text-white transition-colors hover:bg-black"
                >
                    상가분양문의 010-4539-8505
                </a>
            </header>

            {/* 모바일 1-up 캐러셀 */}
            <Reveal delay={0.08} className="md:hidden">
                <CarouselBase
                    items={items}
                    itemsPerView={1}
                    heightClass={mobileHeightClass}
                    rounded={rounded}
                    autoMs={autoMs}
                    onOpenLightbox={openAt}
                    showCaption={showCaption}
                    onCall={handleCall}
                />
            </Reveal>

            {/* 데스크탑도 1-up(항상 한 장씩) */}
            <Reveal delay={0.08} className="hidden md:block">
                <CarouselBase
                    items={items}
                    itemsPerView={1}
                    heightClass={desktopHeightClass}
                    rounded={rounded}
                    autoMs={autoMs}
                    onOpenLightbox={openAt}
                    showCaption={showCaption}
                    onCall={handleCall}
                />
            </Reveal>

            {/* 라이트박스: 전체 화면 어두운 뷰어 (다른 팝업과 같은 모양) */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent showCloseButton={false} className={VIEWER_CONTENT}>
                    <DialogTitle className="sr-only">{title} 이미지 보기</DialogTitle>
                    <Lightbox
                        photos={items}
                        index={lightIdx}
                        onPrev={() => goLight(-1)}
                        onNext={() => goLight(+1)}
                        onClose={() => setOpen(false)}
                        onCall={handleCall}
                    />
                </DialogContent>
            </Dialog>
        </section>
    );
};

/* ================================ Generic Carousel ================================ */
type CarouselBaseProps = {
    items: ShopImage[];
    itemsPerView: number; // 1로 사용
    heightClass?: string; // 권장 h-auto
    rounded?: boolean;
    autoMs?: number;
    onOpenLightbox?: (index: number) => void;
    showCaption?: boolean;
    onCall?: () => void;
};

const CarouselBase: React.FC<CarouselBaseProps> = ({
                                                       items,
                                                       itemsPerView,
                                                       heightClass,
                                                       rounded = false,
                                                       autoMs = 0,
                                                       onOpenLightbox,
                                                       showCaption = true,
                                                       onCall,
                                                   }) => {
    const [index, setIndex] = React.useState(0);
    const count = items.length;

    const pageMax = Math.max(0, count - itemsPerView);
    const itemWidthPct = 100 / itemsPerView;

    // 드래그 상태 (손가락 추적 이동)
    const wrapRef = React.useRef<HTMLDivElement | null>(null);
    const startX = React.useRef<number | null>(null);
    const [dragPct, setDragPct] = React.useState(0); // 컨테이너 폭 대비 %

    const autoTimer = React.useRef<number | null>(null);

    const goTo = (n: number) =>
        setIndex(() => Math.max(0, Math.min(n, pageMax)));
    const prev = () => goTo(index - 1);
    const next = () => goTo(index + 1);

    // autoplay
    React.useEffect(() => {
        if (!autoMs || autoMs < 1000 || count <= itemsPerView) return;
        if (autoTimer.current) window.clearInterval(autoTimer.current);
        autoTimer.current = window.setInterval(() => {
            setIndex((i) => (i >= pageMax ? 0 : i + 1));
        }, autoMs);
        return () => {
            if (autoTimer.current) window.clearInterval(autoTimer.current);
            autoTimer.current = null;
        };
    }, [autoMs, count, itemsPerView, pageMax]);

    const getWidth = () => wrapRef.current?.clientWidth ?? 1;

    // swipe: 추적 이동
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-carousel-interactive="true"]')) return;
        startX.current = e.clientX;
        setDragPct(0);
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (startX.current == null) return;
        const dx = e.clientX - startX.current;
        setDragPct((dx / getWidth()) * 100); // px → %
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (startX.current == null) return;
        const dx = e.clientX - startX.current;
        const thresholdPx = Math.max(40, getWidth() * 0.08); // 8% 또는 40px
        if (dx > thresholdPx) prev();
        else if (dx < -thresholdPx) next();
        startX.current = null;
        setDragPct(0);
    };

    const pages = pageMax + 1;

    // 현재 인덱스 이동 + 드래그 오프셋 반영
    const basePct = -(index * itemWidthPct);
    const transformStyle = {
        transform: `translateX(calc(${basePct}% + ${dragPct}%))`,
    } as React.CSSProperties;

    return (
        <section
            ref={wrapRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={`${itemsPerView}-up carousel`}
            className={cn(
                "relative select-none group overflow-hidden",
                "bg-transparent border-0 rounded-none",
                "touch-pan-y overscroll-none",
                heightClass ?? "h-auto"
            )}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        >
            {/* 트랙 */}
            <div
                className="w-full flex transition-transform duration-300"
                style={transformStyle}
            >
                {items.map((it, i) => (
                    <div
                        key={i}
                        className="relative w-full"
                        style={{ flex: `0 0 ${itemWidthPct}%` }}
                    >
                        {/* 이미지 우상단 '분양문의' 버튼 */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCall?.();
                            }}
                            className={cn(
                                "absolute right-0 top-0 z-20",
                                "inline-flex items-center gap-1.5 px-3.5 py-2",
                                "text-[12px] md:text-[13px] font-semibold tracking-[0.02em]",
                                "bg-ink text-white hover:bg-black",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
                            )}
                            data-carousel-interactive="true"
                            aria-label="분양문의 전화걸기"
                        >
                            <span>분양문의 010-4539-8505</span>
                        </button>

                        {/* 이미지(클릭 → 라이트박스) */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenLightbox?.(i);
                            }}
                            className={cn(
                                "relative z-10 block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 overflow-hidden",
                                rounded ? "rounded-2xl" : "rounded-none"
                            )}
                            data-carousel-interactive="true"
                        >
                            <img
                                src={it.src}
                                alt={it.title ?? `slide ${i + 1}`}
                                className="block w-full h-auto object-contain select-none pointer-events-none"
                                draggable={false}
                            />
                        </button>

                        {/* 이미지 '아래' 캡션 */}
                        {showCaption && (it.title || it.subtitle) && (
                            <div className="mt-4 flex items-baseline gap-3">
                                {it.title && (
                                    <h3 className="text-[16px] md:text-[18px] font-bold tracking-[-0.03em] text-ink">
                                        {it.title}
                                    </h3>
                                )}
                                {it.subtitle && (
                                    <p className="text-[13px] md:text-[14px] text-neutral-500">
                                        {it.subtitle}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 좌우 화살표 (항상 보이기) */}
            {count > itemsPerView && (
                <>
                    <button
                        type="button"
                        aria-label="이전"
                        onClick={() => prev()}
                        data-carousel-interactive="true"
                        className={cn(
                            arrowBase,
                            "left-0 z-[5]",
                            "opacity-100 pointer-events-auto"
                        )}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="다음"
                        onClick={() => next()}
                        data-carousel-interactive="true"
                        className={cn(
                            arrowBase,
                            "right-0 z-[5]",
                            "opacity-100 pointer-events-auto"
                        )}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </>
            )}

            {/* 하단 인디케이터 */}
            {count > itemsPerView && (
                <div className="mt-5 flex items-center justify-start">
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: pages }).map((_, p) => (
                            <button
                                key={p}
                                type="button"
                                aria-label={`${p + 1}번째로 이동`}
                                aria-current={p === index ? "true" : "false"}
                                onClick={() => setIndex(p)}
                                data-carousel-interactive="true"
                                className={cn(
                                    "inline-block h-[2px] transition-all",
                                    p === index
                                        ? "bg-ink w-10"
                                        : "bg-neutral-300 w-5 hover:bg-neutral-500"
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

const arrowBase =
    "absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-11 w-11 bg-black/55 text-white hover:bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 transition-colors duration-200";

/* -------------------------------- 라이트박스 -------------------------------- */
interface LightboxProps {
    photos: ShopImage[];
    index: number;
    onPrev: () => void;
    onNext: () => void;
    onClose: () => void;
    onCall?: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
                                               photos,
                                               index,
                                               onPrev,
                                               onNext,
                                               onClose,
                                               onCall,
                                           }) => {
    const [loaded, setLoaded] = React.useState(false);
    const [uiVisible, setUiVisible] = React.useState(true);
    const [zoom, setZoom] = React.useState(1);
    const [tx, setTx] = React.useState(0);
    const [ty, setTy] = React.useState(0);

    const downX = React.useRef<number | null>(null);
    const downY = React.useRef<number | null>(null);
    const lastX = React.useRef<number | null>(null);
    const lastY = React.useRef<number | null>(null);
    const uiTimer = React.useRef<number | null>(null);
    const lastTap = React.useRef<number>(0);

    const imgRef = React.useRef<HTMLImageElement | null>(null);

    const isMobile =
        typeof window !== "undefined"
            ? window.matchMedia("(max-width: 767px)").matches
            : true;

    React.useEffect(() => {
        setLoaded(false);
        setZoom(1);
        setTx(0);
        setTy(0);
        kickUI();
    }, [index]);

    React.useEffect(
        () => () => {
            if (uiTimer.current) window.clearTimeout(uiTimer.current);
        },
        []
    );

    const kickUI = (ms = 1400) => {
        setUiVisible(true);
        if (uiTimer.current) window.clearTimeout(uiTimer.current);
        if (isMobile)
            uiTimer.current = window.setTimeout(() => setUiVisible(false), ms);
    };

    const toggleZoom = () => setZoom((z) => (z === 1 ? 2.5 : 1));

    const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowLeft") onPrev();
        else if (e.key === "ArrowRight") onNext();
        else if (e.key === "Escape") onClose();
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-lb-interactive="true"]')) return;

        const now = Date.now();
        const dt = now - lastTap.current;
        lastTap.current = now;
        if (dt < 260) {
            // 더블탭 → 줌 토글
            toggleZoom();
            kickUI(1200);
            return;
        }

        downX.current = e.clientX;
        downY.current = e.clientY;
        lastX.current = e.clientX;
        lastY.current = e.clientY;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        kickUI(1600);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (lastX.current == null || lastY.current == null) return;
        const dx = e.clientX - lastX.current;
        const dy = e.clientY - lastY.current;
        lastX.current = e.clientX;
        lastY.current = e.clientY;
        if (zoom > 1) {
            setTx((x) => x + dx);
            setTy((y) => y + dy);
        }
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (downX.current == null || downY.current == null) return;
        const totalDx = e.clientX - downX.current;
        const totalDy = e.clientY - downY.current;

        if (zoom === 1) {
            const absX = Math.abs(totalDx);
            const absY = Math.abs(totalDy);
            if (absY > 80 && absY > absX && totalDy > 0) {
                // 아래로 스와이프 → 닫기
                onClose();
            } else if (absX > 50 && absX > absY) {
                // 좌우 스와이프 → 내비
                if (totalDx > 0) onPrev();
                else onNext();
            }
        }

        downX.current = null;
        downY.current = null;
    };

    // 이미지 밖 클릭 시 닫기
    const onWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as Node;
        if (imgRef.current && imgRef.current.contains(target)) {
            // 이미지 위 클릭: 모바일에서는 UI 토글만
            if (isMobile) setUiVisible((v) => !v);
            return;
        }
        // 이미지 바깥 클릭: 닫기
        onClose();
    };

    const p = photos[index];

    return (
        <div
            className="relative h-full w-full touch-none select-none overflow-hidden outline-none"
            tabIndex={0}
            onKeyDown={onKey}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={onWrapperClick}
        >
            {/* 상단 바 + 우상단 분양문의 */}
            <div
                className={cn(
                    "absolute inset-x-0 top-0 z-20 transition-opacity",
                    "bg-gradient-to-b from-black/70 to-transparent",
                    VIEWER_BAR,
                    uiVisible ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="flex min-w-0 items-center gap-3" aria-live="polite">
                    <span className={VIEWER_COUNT}>
                        {pad2(index + 1)}
                        <span className="text-white/35"> / {pad2(photos.length)}</span>
                    </span>
                    {(p.title || p.subtitle) && (
                        <>
                            <span aria-hidden className="h-3 w-px bg-white/20" />
                            <span className="truncate text-[13px] md:text-[14px] text-white/70">
                                {p.title}
                                {p.title && p.subtitle && <span className="mx-1.5 text-white/30">·</span>}
                                {p.subtitle}
                            </span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        data-lb-interactive="true"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCall?.();
                        }}
                        className={cn(
                            "hidden sm:inline-flex h-9 items-center gap-1.5 px-4 mr-1",
                            "text-[13px] font-semibold tracking-[0.02em] bg-brand text-white",
                            "hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                        )}
                        aria-label="분양문의 전화걸기"
                    >
                        <span>분양문의 010-4539-8505</span>
                    </button>

                    <DialogClose asChild>
                        <button
                            type="button"
                            data-lb-interactive="true"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className={VIEWER_ICON_BTN}
                            aria-label="닫기"
                        >
                            <X className="h-[22px] w-[22px]" strokeWidth={1.5} />
                        </button>
                    </DialogClose>
                </div>
            </div>

            {/* 이미지(완전 풀스크린 중앙 정렬) */}
            <div className="absolute inset-0 flex items-center justify-center">
                {!loaded && (
                    <div className="absolute inset-0 grid place-items-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    </div>
                )}
                <img
                    ref={imgRef}
                    src={p.src}
                    alt={p.title ?? "shop photo"}
                    className={cn(
                        // 모바일: 거의 꽉 차게
                        "max-w-[100vw] max-h-[100svh]",
                        // 데스크탑: 너무 커서 스크롤 안 생기도록 살짝 여유
                        "md:max-w-[84vw] md:max-h-[84vh]",
                        "w-auto h-auto object-contain",
                        loaded ? "opacity-100" : "opacity-0",
                        "transition-transform duration-150 ease-out"
                    )}
                    style={{ transform: `translate(${tx}px, ${ty}px) scale(${zoom})` }}
                    onLoad={() => setLoaded(true)}
                    draggable={false}
                />
            </div>

            {/* 좌우 네비 */}
            <LBNav onPrev={onPrev} onNext={onNext} />
        </div>
    );
};

const LBNav: React.FC<{ onPrev: () => void; onNext: () => void }> = ({
                                                                         onPrev,
                                                                         onNext,
                                                                     }) => (
    <>
        <button
            type="button"
            aria-label="이전"
            data-lb-interactive="true"
            onClick={(e) => {
                e.stopPropagation();
                onPrev();
            }}
            className={cn(VIEWER_ARROW, "left-3 md:left-8 z-30")}
        >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button
            type="button"
            aria-label="다음"
            data-lb-interactive="true"
            onClick={(e) => {
                e.stopPropagation();
                onNext();
            }}
            className={cn(VIEWER_ARROW, "right-3 md:right-8 z-30")}
        >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>
    </>
);
