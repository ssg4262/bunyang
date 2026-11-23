// src/components/sections/SitePlanSection.tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react"
import { VIEWER_BAR, VIEWER_CONTENT, VIEWER_ICON_BTN } from "@/components/sections/viewerStyles"
import { SectionHeader } from "@/components/sections/SectionHeader"

type SitePlanSectionProps = {
    /** 섹션 상단 제목 (예: "단지 배치도") */
    title: string
    /** 이미지 경로(정적 import 또는 URL 문자열) */
    image: string
    /** 대체 텍스트 */
    alt?: string
    /** 이미지 하단 안내 문구(선택) */
    note?: React.ReactNode
    /** 컨테이너 클래스 커스터마이즈 */
    className?: string
    /** 제목 위 작은 라벨 (묶음 이름) */
    eyebrow?: string
    /** lg: 묶음의 첫 섹션, md: 이어지는 하위 섹션 */
    size?: "lg" | "md"
}

export const SitePlanSection: React.FC<SitePlanSectionProps> = ({
                                                                    title,
                                                                    image,
                                                                    alt = "",
                                                                    note,
                                                                    className,
                                                                    eyebrow,
                                                                    size = "md",
                                                                }) => {
    const [open, setOpen] = React.useState(false)
    const [zoom, setZoom] = React.useState(false)
    // 팝업을 닫으면 확대 상태 초기화
    React.useEffect(() => { if (!open) setZoom(false) }, [open])

    return (
        <section className={cn("w-full bg-white py-12 md:py-20", className)}>
            <div className="mx-auto max-w-7xl section-padding">
                <SectionHeader eyebrow={eyebrow} title={title} size={size} />

                {/* 이미지 카드 (클릭 시 상세보기) */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            className={cn(
                                "group w-full overflow-hidden bg-white",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                            )}
                            aria-label={`${title} 상세보기`}
                            title="클릭하여 크게 보기"
                        >
                            <div className="relative">
                                <img
                                    src={image}
                                    alt={alt || title}
                                    className="block w-full h-auto select-none"
                                    loading="lazy"
                                    draggable={false}
                                />
                                <div className="pointer-events-none absolute right-0 top-0 bg-ink px-3 py-2 text-[12px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1">
                    <Maximize2 className="h-3.5 w-3.5" />
                    크게 보기
                  </span>
                                </div>
                            </div>
                            {note && (
                                <div className="pt-3 text-[12px] md:text-[13px] leading-relaxed text-neutral-400 text-left">
                                    {note}
                                </div>
                            )}
                        </button>
                    </DialogTrigger>

                    {/* 상세보기: 전체 화면 뷰어 (이미지를 누르면 확대/축소) */}
                    <DialogContent showCloseButton={false} className={VIEWER_CONTENT}>
                        <div className={VIEWER_BAR}>
                            <DialogTitle className="truncate text-[15px] md:text-[16px] font-semibold tracking-[-0.02em] text-white">
                                {title}
                            </DialogTitle>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className={VIEWER_ICON_BTN}
                                    onClick={() => setZoom((z) => !z)}
                                    title={zoom ? "화면에 맞추기" : "확대"}
                                    aria-label={zoom ? "화면에 맞추기" : "확대"}
                                >
                                    {zoom ? (
                                        <ZoomOut className="h-5 w-5" strokeWidth={1.5} />
                                    ) : (
                                        <ZoomIn className="h-5 w-5" strokeWidth={1.5} />
                                    )}
                                </button>
                                <a
                                    href={image}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(VIEWER_ICON_BTN, "hidden sm:inline-flex")}
                                    title="새 탭에서 원본 열기"
                                    aria-label="새 탭에서 원본 열기"
                                >
                                    <Maximize2 className="h-[18px] w-[18px]" strokeWidth={1.5} />
                                </a>
                                <a
                                    href={image}
                                    download
                                    className={VIEWER_ICON_BTN}
                                    title="이미지 다운로드"
                                    aria-label="이미지 다운로드"
                                >
                                    <Download className="h-5 w-5" strokeWidth={1.5} />
                                </a>
                                <button
                                    type="button"
                                    className={VIEWER_ICON_BTN}
                                    onClick={() => setOpen(false)}
                                    title="닫기"
                                    aria-label="닫기"
                                >
                                    <X className="h-[22px] w-[22px]" strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                        {/* 이미지 영역: 기본은 화면에 맞춤, 누르면 크게 + 스크롤 */}
                        <div
                            className={cn(
                                "min-h-0 flex-1 overflow-auto",
                                !zoom && "flex items-center justify-center md:px-10"
                            )}
                        >
                            <img
                                src={image}
                                alt={alt || title}
                                onClick={() => setZoom((z) => !z)}
                                className={cn(
                                    "select-none animate-in fade-in-0 duration-300",
                                    zoom
                                        ? "block w-[240%] max-w-none cursor-zoom-out sm:w-[170%] lg:w-[130%]"
                                        : "max-h-full max-w-full cursor-zoom-in object-contain"
                                )}
                                draggable={false}
                            />
                        </div>

                        <p className="shrink-0 px-5 pt-3 pb-[max(0.9rem,env(safe-area-inset-bottom))] text-center text-[12px] text-white/40">
                            {zoom ? "이미지를 다시 누르면 화면에 맞춰집니다" : "이미지를 누르면 확대됩니다"}
                        </p>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    )
}
