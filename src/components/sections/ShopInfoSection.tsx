"use client";

// src/components/sections/ShopInfoSection.tsx
// - 모바일/데스크탑: 1장 캐러셀(이미지 단독) + 이미지 우상단 '분양문의' 버튼 + 하단 인디케이터
// - 캡션 잘림 방지(세로 overflow 허용)
// - 라이트박스: 완전 풀스크린(여백 0) + 투명 배경(Overlay/Content 모두 bg-transparent)

import React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogClose, DialogOverlay } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Phone } from "lucide-react";

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
    paddingXClass?: string;      // 섹션 좌우 여백
    mobileHeightClass?: string;  // 기본 h-auto
    desktopHeightClass?: string; // 기본 h-auto
    autoMs?: number;
    rounded?: boolean;           // 이미지 모서리
    showCaption?: boolean;       // 이미지 '아래' 타이틀/서브 표시
    onCallClick?: () => void;    // 전화 버튼 클릭 시 커스텀 핸들러(선택)
};

/* ---------------------------------- Helpers ---------------------------------- */
const mod = (n: number, m: number) => ((n % m) + m) % m;

/* ================================ Main Section ================================ */
export const ShopInfoSection: React.FC<ShopInfoSectionProps> = ({
                                                                    items,
                                                                    title = "상가분양안내",
                                                                    className,
                                                                    paddingXClass = "px-4 md:px-8 lg:px-12",
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

    const openAt = (i: number) => { setLightIdx(i); setOpen(true); };
    const goLight = (n: number) => setLightIdx((i) => mod(i + n, count));

    const handleCall = () => {
        onCallClick?.();
        if (!onCallClick) window.location.href = "tel:0537604818";
    };

    return (
        <section className={cn("w-full py-4 md:py-6", paddingXClass, className)}>
            {/* 타이틀 */}
            <header className="mb-3 md:mb-5">
                <h1 className="mt-1 text-3xl md:text-5xl font-semibold tracking-tight">
                    {title}
                </h1>
                {/* 붉은 CTA 텍스트(크게) */}
                <div className="mt-2 text-2xl md:text-3xl font-extrabold text-red-600">
                    상가분양문의 053-760-4818
                </div>
                <div className="mt-4 rounded-xl border border-zinc-200/80 dark:border-white/10 p-3 text-xs text-muted-foreground">
                    원하시는 호실·평형·분양가를 빠르게 상담받아 보세요.
                </div>
            </header>

            {/* 모바일 1-up 캐러셀 */}
            <div className="md:hidden">
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
            </div>

            {/* 데스크탑도 1-up(항상 한 장씩) */}
            <div className="hidden md:block">
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
            </div>

            {/* 라이트박스: 완전 풀스크린 + 투명 배경 */}
            <Dialog open={open} onOpenChange={setOpen}>
                {/* 투명 Overlay: 뒤 배경 어둡게 하지 않음 */}
                <DialogOverlay
                    className={cn(
                        "fixed inset-0 z-50 bg-transparent",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    )}
                />
                {/* Content도 투명 + 풀스크린 */}
                <DialogContent
                    className={cn(
                        "fixed inset-0 left-0 top-0 translate-x-0 translate-y-0",
                        "w-screen h-screen max-w-none max-h-none",
                        "p-0 bg-transparent text-white border-0 rounded-none shadow-none",
                        "[&>button]:hidden" // shadcn 기본 닫기버튼 숨김
                    )}
                >
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
    const [controls, setControls] = React.useState(false);
    const count = items.length;

    const pageMax = Math.max(0, count - itemsPerView);
    const itemWidthPct = 100 / itemsPerView;

    // 한 장만 보여주므로 간격 0
    const gapPx = 0;
    const halfGap = 0;

    const downX = React.useRef<number | null>(null);
    const hideTimer = React.useRef<number | null>(null);
    const autoTimer = React.useRef<number | null>(null);

    const showCtrl = React.useCallback((ms = 1800) => {
        setControls(true);
        if (hideTimer.current) window.clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => setControls(false), ms);
    }, []);

    const goTo = (n: number) => setIndex(() => Math.max(0, Math.min(n, pageMax)));
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

    // hover 컨트롤(데스크탑)
    const wrapRef = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const onEnter = () => { showCtrl(999999); };
        const onLeave = () => { setControls(false); };
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        return () => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
        };
    }, [showCtrl]);

    // swipe
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-carousel-interactive="true"]')) return;
        downX.current = e.clientX;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        showCtrl();
    };
    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (downX.current == null) return;
        const dx = e.clientX - downX.current;
        const th = 40;
        if (dx > th) prev();
        else if (dx < -th) next();
        downX.current = null;
    };

    const pages = pageMax + 1;
    const transformStyle = { transform: `translateX(-${index * itemWidthPct}%)` };

    return (
        <section
            ref={wrapRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={`${itemsPerView}-up carousel`}
            className={cn(
                "relative select-none group",
                "bg-transparent border-0 rounded-none",
                heightClass ?? "h-auto"
            )}
            // 캡션 잘림 방지: 가로만 숨기고 세로는 보이게
            style={{ overflowX: "hidden", overflowY: "visible" }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
        >
            {/* 트랙 */}
            <div
                className="w-full flex transition-transform duration-500"
                style={{
                    ...transformStyle,
                    marginLeft: gapPx ? -halfGap : 0,
                    marginRight: gapPx ? -halfGap : 0,
                }}
            >
                {items.map((it, i) => (
                    <div
                        key={i}
                        className="relative w-full"
                        style={{ flex: `0 0 ${itemWidthPct}%`, paddingLeft: 0, paddingRight: 0 }}
                    >
                        {/* 이미지 우상단 '분양문의' 버튼 */}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onCall?.(); }}
                            className={cn(
                                "absolute right-2 top-2 z-20",
                                "inline-flex items-center gap-1 rounded-full px-3 py-1.5",
                                "text-xs md:text-sm font-semibold",
                                "bg-red-600 text-white shadow ring-1 ring-black/10 hover:bg-red-700",
                                "focus:outline-none focus:ring-2 focus:ring-red-400/60"
                            )}
                            data-carousel-interactive="true"
                            aria-label="분양문의 전화걸기"
                        >
                            <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            <span>분양문의 053-760-4818</span>
                        </button>

                        {/* 이미지(클릭 → 라이트박스) */}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onOpenLightbox?.(i); }}
                            className={cn(
                                "relative z-10 block w-full h-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary/50",
                                rounded ? "rounded-2xl overflow-hidden" : "rounded-none"
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
                            <div className="mt-2">
                                {it.title && <h3 className="text-sm md:text-base font-semibold">{it.title}</h3>}
                                {it.subtitle && <p className="text-xs md:text-sm text-muted-foreground">{it.subtitle}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 좌우 화살표 */}
            {count > itemsPerView && (
                <>
                    <button
                        type="button"
                        aria-label="이전"
                        onClick={() => { prev(); showCtrl(1500); }}
                        data-carousel-interactive="true"
                        className={cn(arrowBase, "left-3 md:left-4 z-[5]", controls ? arrowVisible : arrowHidden)}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="다음"
                        onClick={() => { next(); showCtrl(1500); }}
                        data-carousel-interactive="true"
                        className={cn(arrowBase, "right-3 md:right-4 z-[5]", controls ? arrowVisible : arrowHidden)}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </>
            )}

            {/* 하단 인디케이터 */}
            {count > itemsPerView && (
                <div className="mt-3 flex items-center justify-center">
                    <div className="rounded-full border border-border/60 bg-background/80 px-2 py-1 backdrop-blur supports-[backdrop-filter]:backdrop-blur-sm">
                        {Array.from({ length: pages }).map((_, p) => (
                            <button
                                key={p}
                                type="button"
                                aria-label={`${p + 1}번째로 이동`}
                                aria-current={p === index ? "true" : "false"}
                                onClick={() => { setIndex(p); showCtrl(1500); }}
                                data-carousel-interactive="true"
                                className={cn(
                                    "mx-1 inline-block h-2 w-6 rounded-full transition-all",
                                    p === index ? "bg-foreground w-8" : "bg-foreground/40 hover:bg-foreground/60"
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
    "absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/85 text-black shadow-lg ring-1 ring-black/10 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-opacity duration-200";
const arrowHidden = "opacity-0 pointer-events-none";
const arrowVisible = "opacity-100 pointer-events-auto";

/* -------------------------------- 라이트박스 -------------------------------- */
interface LightboxProps {
    photos: ShopImage[];
    index: number;
    onPrev: () => void;
    onNext: () => void;
    onClose: () => void;
    onCall?: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ photos, index, onPrev, onNext, onClose, onCall }) => {
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

    const isMobile = typeof window !== "undefined"
        ? window.matchMedia("(max-width: 767px)").matches
        : true;

    React.useEffect(() => { setLoaded(false); setZoom(1); setTx(0); setTy(0); kickUI(); }, [index]);
    React.useEffect(() => () => { if (uiTimer.current) window.clearTimeout(uiTimer.current); }, []);

    const kickUI = (ms = 1400) => {
        setUiVisible(true);
        if (uiTimer.current) window.clearTimeout(uiTimer.current);
        if (isMobile) uiTimer.current = window.setTimeout(() => setUiVisible(false), ms);
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
        const dt = now - lastTap.current; lastTap.current = now;
        if (dt < 260) { toggleZoom(); kickUI(1200); return; }

        downX.current = e.clientX; downY.current = e.clientY;
        lastX.current = e.clientX; lastY.current = e.clientY;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        kickUI(1600);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (lastX.current == null || lastY.current == null) return;
        const dx = e.clientX - lastX.current; const dy = e.clientY - lastY.current;
        lastX.current = e.clientX; lastY.current = e.clientY;
        if (zoom > 1) { setTx((x) => x + dx); setTy((y) => y + dy); }
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (downX.current == null || downY.current == null) return;
        const totalDx = e.clientX - downX.current; const totalDy = e.clientY - downY.current;
        if (zoom === 1) {
            const absX = Math.abs(totalDx); const absY = Math.abs(totalDy);
            if (absY > 80 && absY > absX && totalDy > 0) onClose(); // 아래로 스와이프 → 닫기
            else if (absX > 50 && absX > absY) { if (totalDx > 0) onPrev(); else onNext(); } // 좌우 스와이프 → 내비
        }
        downX.current = null; downY.current = null;
    };

    const p = photos[index];

    return (
        <div
            className="relative w-screen h-screen touch-none select-none"
            tabIndex={0}
            onKeyDown={onKey}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={() => { if (isMobile) setUiVisible((v) => !v); }}
        >
            {/* 상단 바(얇게) + 우상단 분양문의 */}
            <div
                className={cn(
                    "absolute inset-x-0 top-0 z-20 flex items-center justify-between",
                    "p-2 md:p-3 pt-[env(safe-area-inset-top)] transition-opacity",
                    uiVisible ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="text-xs md:text-sm text-white/85 drop-shadow" aria-live="polite">
                    {index + 1} / {photos.length}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        data-lb-interactive="true"
                        onClick={(e) => { e.stopPropagation(); onCall?.(); }}
                        className={cn(
                            "hidden sm:inline-flex items-center gap-1 rounded-full px-3 py-1.5",
                            "text-xs md:text-sm font-semibold bg-red-600 text-white drop-shadow",
                            "shadow ring-1 ring-black/10 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400/60"
                        )}
                        aria-label="분양문의 전화걸기"
                    >
                        <Phone className="h-4 w-4" />
                        <span>분양문의 053-760-4818</span>
                    </button>

                    <DialogClose asChild>
                        <button
                            type="button"
                            data-lb-interactive="true"
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                            aria-label="닫기"
                        >
                            <X className="h-5 w-5" />
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
                    src={p.src}
                    alt={p.title ?? "shop photo"}
                    className={cn(
                        "max-w-[100vw] max-h-[100svh] md:max-h-[100vh] w-auto h-auto object-contain",
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

const LBNav: React.FC<{ onPrev: () => void; onNext: () => void }> = ({ onPrev, onNext }) => (
    <>
        <button
            type="button"
            aria-label="이전"
            data-lb-interactive="true"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow ring-1 ring-black/10 hover:bg-white"
        >
            <ChevronLeft className="h-5 w-5" />
        </button>
        <button
            type="button"
            aria-label="다음"
            data-lb-interactive="true"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow ring-1 ring-black/10 hover:bg-white"
        >
            <ChevronRight className="h-5 w-5" />
        </button>
    </>
);
