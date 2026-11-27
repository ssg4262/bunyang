// src/components/sections/FloorPlanTabs.tsx
"use client";

import { Reveal } from "@/components/common/Reveal"
import { VIEWER_BAR, VIEWER_CONTENT, VIEWER_ICON_BTN } from "@/components/sections/viewerStyles"
import { TAB_LIST, TAB_TRIGGER } from "@/components/sections/tabStyles"
import { SectionHeader } from "@/components/sections/SectionHeader"
import * as React from "react";
import { cn } from "@/lib/utils";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Maximize2, X, ZoomIn, ZoomOut } from "@/components/common/icons";

/* ======================== Types ======================== */
export type FloorRow = {
    /** 호실 (예: B101) */
    no: string;
    /** 전용면적(평) */
    exclusivePyeong: number;
    /** 계약면적(평) */
    contractPyeong: number;
};

export type FloorInfo = {
    /** 탭 ID (예: B4, B3, B2, B1, 1F, 2F) */
    id: string;
    /** 화면에 보이는 라벨 */
    label: string;
    /** 테이블 데이터 (가격/평당가 항목은 제외) */
    rows: FloorRow[];
    /** 평면도 이미지 URL */
    image: string;
    /** 이미지 대체 텍스트 */
    alt?: string;
};

export type FloorPlanTabsProps = {
    floors: FloorInfo[];
    /** 기본 탭 (기본: B1) */
    defaultTab?: FloorInfo["id"];
    className?: string;
};

/* ======================== Component ======================== */
export const FloorPlanTabs: React.FC<FloorPlanTabsProps> = ({
                                                                floors,
                                                                defaultTab = "B1",
                                                                className,
                                                            }) => {
    const [tab, setTab] = React.useState<FloorInfo["id"]>(defaultTab);
    const [open, setOpen] = React.useState(false);
    const [zoom, setZoom] = React.useState(false);
    // 팝업을 닫으면 확대 상태 초기화
    React.useEffect(() => { if (!open) setZoom(false); }, [open]);

    // 현재 선택된 층 정보
    const current = React.useMemo(
        () => floors.find((f) => f.id === tab) ?? floors[0],
        [floors, tab]
    );

    return (
        <section
            className={cn(
                "mx-auto w-full max-w-7xl section-padding pt-6 md:pt-14",
                className
            )}
        >
            <Tabs value={tab} onValueChange={(v) => setTab(v as FloorInfo["id"])}>
                {/* 헤더 */}
                <div>
                    <SectionHeader title="상가 평면도" size="md" className="mb-5 md:mb-6" />

                    {/* 탭 리스트: 모바일 전체 너비 + 스크롤 */}
                    <div className="w-full">
                        <TabsList
                            className={cn(
                                TAB_LIST,
                                "overflow-x-auto overflow-y-hidden whitespace-nowrap",
                                "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                            )}
                        >
                            {floors.map((f) => (
                                <TabsTrigger
                                    key={f.id}
                                    value={f.id}
                                    className={cn(TAB_TRIGGER, "px-1")}
                                >
                                    {f.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </div>

                {/* 컨텐츠 */}
                {floors.map((f) => (
                    <TabsContent key={f.id} value={f.id} className="mt-7 md:mt-10">
                        <Reveal className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 lg:gap-12">
                            {/* 이미지 카드 */}
                            <figure className="relative overflow-hidden bg-surface">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setOpen(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setOpen(true);
                                        }
                                    }}
                                    className="group block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    aria-label={`${f.label} 상세 이미지 보기`}
                                >
                                    <img
                                        src={f.image}
                                        alt={f.alt ?? `${f.label} 평면도`}
                                        className="w-full h-[280px] xs:h-[320px] sm:h-[380px] lg:h-[540px] xl:h-[600px] object-contain bg-surface"
                                        draggable={false}
                                    />
                                </div>

                                {/* 오른쪽 상단 확대 버튼 */}
                                <div className="absolute right-0 top-0">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="secondary"
                                        className="h-10 w-10 rounded-none bg-ink text-white shadow-none hover:bg-black"
                                        onClick={() => setOpen(true)}
                                        aria-label={`${f.label} 상세 이미지 보기`}
                                    >
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </figure>

                            {/* 표 카드 (더 크게) */}
                            <div className="overflow-hidden flex flex-col">
                                {/* 카드 헤더 */}
                                <div className="pb-3 border-b-2 border-ink flex items-end justify-between gap-2">
                                    <h3 className="text-[17px] md:text-[19px] font-bold tracking-[-0.03em]">
                                        {f.label} 단위표 (가격 제외)
                                    </h3>
                                    <span className="text-[12px] md:text-[13px] text-neutral-500">
                                        총 {f.rows.length.toLocaleString()}호
                                    </span>
                                </div>

                                {/* 표 + 스크롤 (높이 업) */}
                                <ScrollArea className="w-full max-h-[340px] sm:max-h-[380px] md:max-h-[440px] lg:max-h-[520px]">
                                    <table className="w-full text-[14px] md:text-[15px] table-fixed">
                                        <thead className="sticky top-0 z-10 bg-white">
                                        <tr className="border-b border-line text-[12px] text-neutral-500">
                                            <th className="text-left font-medium p-2.5 sm:p-3 w-[25%]">
                                                호
                                            </th>
                                            <th className="text-right font-medium p-2.5 sm:p-3 w-[37.5%]">
                                                전용면적(평)
                                            </th>
                                            <th className="text-right font-medium p-2.5 sm:p-3 w-[37.5%]">
                                                계약면적(평)
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {f.rows.map((r) => (
                                            <tr
                                                key={r.no}
                                                className="border-b border-line last:border-0 hover:bg-surface"
                                            >
                                                <td className="p-2.5 sm:p-3 font-semibold whitespace-nowrap">
                                                    {r.no}
                                                </td>
                                                <td className="p-2.5 sm:p-3 text-right tabular-nums">
                                                    {r.exclusivePyeong.toLocaleString(undefined, {
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </td>
                                                <td className="p-2.5 sm:p-3 text-right tabular-nums">
                                                    {r.contractPyeong.toLocaleString(undefined, {
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </ScrollArea>
                            </div>
                        </Reveal>
                    </TabsContent>
                ))}

                {/* 상세 이미지: 전체 화면 뷰어 (이미지를 누르면 원본 크기 + 스크롤) */}
                {current && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent showCloseButton={false} className={VIEWER_CONTENT}>
                            {/* 상단 바 */}
                            <div className={VIEWER_BAR}>
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="label-caps text-white">{current.label}</span>
                                    <span aria-hidden className="h-3 w-px bg-white/20" />
                                    <DialogTitle className="truncate text-[13px] md:text-[14px] font-normal text-white/70">
                                        상가 평면도 상세
                                    </DialogTitle>
                                </div>
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
                                    <button
                                        type="button"
                                        className={VIEWER_ICON_BTN}
                                        onClick={() => setOpen(false)}
                                        aria-label="닫기"
                                        title="닫기"
                                    >
                                        <X className="h-[22px] w-[22px]" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>

                            {/* 이미지 영역: 기본은 화면에 맞춤, 누르면 원본 크기 + 스크롤 */}
                            <div
                                className={cn(
                                    "min-h-0 flex-1 overflow-auto",
                                    !zoom && "flex items-center justify-center md:px-10"
                                )}
                            >
                                <img
                                    src={current.image}
                                    alt={current.alt ?? `${current.label} 평면도 상세`}
                                    onClick={() => setZoom((z) => !z)}
                                    className={cn(
                                        "select-none animate-in fade-in-0 duration-300",
                                        zoom
                                            ? "block max-w-none cursor-zoom-out"
                                            : "max-h-full max-w-full cursor-zoom-in object-contain"
                                    )}
                                    draggable={false}
                                />
                            </div>

                            <p className="shrink-0 px-5 pt-3 pb-[max(0.9rem,env(safe-area-inset-bottom))] text-center text-[12px] text-white/40">
                                {zoom ? "이미지를 다시 누르면 화면에 맞춰집니다" : "이미지를 누르면 원본 크기로 확대됩니다"}
                            </p>
                        </DialogContent>
                    </Dialog>
                )}
            </Tabs>
        </section>
    );
};
