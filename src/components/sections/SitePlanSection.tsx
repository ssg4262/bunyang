// src/components/sections/SitePlanSection.tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Maximize2, X } from "lucide-react"

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
}

export const SitePlanSection: React.FC<SitePlanSectionProps> = ({
                                                                    title,
                                                                    image,
                                                                    alt = "",
                                                                    note,
                                                                    className,
                                                                }) => {
    const [open, setOpen] = React.useState(false)

    return (
        <section className={cn("w-full bg-white py-10 md:py-14", className)}>
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                {/* 제목 */}
                <div className="mb-5 md:mb-6 flex items-center justify-between gap-3">
                    <h2 className="text-[22px] md:text-2xl font-bold tracking-tight text-gray-900">
                        {title}
                    </h2>
                </div>

                {/* 이미지 카드 (클릭 시 상세보기) */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            className={cn(
                                "group w-full overflow-hidden bg-white",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                            )}
                            aria-label={`${title} 상세보기`}
                            title="클릭하여 크게 보기"
                        >
                            <div className="relative">
                                <img
                                    src={image}
                                    alt={alt || title}
                                    className="block w-full h-auto select-none transition-transform duration-300 group-hover:scale-[1.01]"
                                    loading="lazy"
                                    draggable={false}
                                />
                                <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/45 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1">
                    <Maximize2 className="h-3.5 w-3.5" />
                    크게 보기
                  </span>
                                </div>
                            </div>
                            {note && (
                                <div className="px-4 md:px-5 py-3 md:py-4 border-t text-[12px] md:text-[13px] leading-relaxed text-gray-500 text-left">
                                    {note}
                                </div>
                            )}
                        </button>
                    </DialogTrigger>

                    {/* 상세보기 모달 */}
                    <DialogContent className="max-w-[min(1200px,92vw)] p-0">
                        <DialogHeader className="px-4 pt-4 pb-2">
                            <DialogTitle className="text-base md:text-lg">{title}</DialogTitle>
                        </DialogHeader>

                        {/* 이미지 영역: 최대 높이 맞춰서 스크롤 가능 */}
                        <div className="relative mx-4 mb-4 rounded-lg border bg-background">
                            <div className="max-h-[82vh] overflow-auto">
                                <img
                                    src={image}
                                    alt={alt || title}
                                    className="block w-full h-auto object-contain"
                                    draggable={false}
                                />
                            </div>

                            {/* 상단 오른쪽 액션 */}
                            <div className="pointer-events-none absolute right-2 top-2 flex gap-2">
                                <a
                                    href={image}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="pointer-events-auto"
                                    title="새 탭에서 원본 열기"
                                >
                                    <Button variant="secondary" size="sm">
                                        원본 보기
                                    </Button>
                                </a>
                                <a
                                    href={image}
                                    download
                                    className="pointer-events-auto"
                                    title="이미지 다운로드"
                                >
                                    <Button variant="secondary" size="icon">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </a>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="pointer-events-auto"
                                    onClick={() => setOpen(false)}
                                    title="닫기"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    )
}
