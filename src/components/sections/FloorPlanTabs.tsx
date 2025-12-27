// src/components/sections/FloorPlanTabs.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Maximize2, X } from "lucide-react";

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

    // 현재 선택된 층 정보
    const current = React.useMemo(
        () => floors.find((f) => f.id === tab) ?? floors[0],
        [floors, tab]
    );

    return (
        <section
            className={cn(
                "w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10",
                className
            )}
        >
            <Tabs value={tab} onValueChange={(v) => setTab(v as FloorInfo["id"])}>
                {/* 헤더 */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">층별 정보</p>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            상가 평면도
                        </h2>
                    </div>

                    {/* 탭 리스트: 모바일 전체 너비 + 스크롤 */}
                    <div className="sm:max-w-md w-full">
                        <TabsList
                            className={cn(
                                "h-10 w-full justify-start overflow-x-auto whitespace-nowrap rounded-xl bg-muted/50 p-1.5",
                                "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                            )}
                        >
                            {floors.map((f) => (
                                <TabsTrigger
                                    key={f.id}
                                    value={f.id}
                                    className="rounded-lg px-3 text-xs sm:text-sm md:text-base data-[state=active]:bg-background"
                                >
                                    {f.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </div>

                {/* 컨텐츠 */}
                {floors.map((f) => (
                    <TabsContent key={f.id} value={f.id} className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-5 lg:gap-7">
                            {/* 이미지 카드 */}
                            <figure className="relative rounded-2xl overflow-hidden border bg-card">
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
                                        className="w-full h-[280px] xs:h-[320px] sm:h-[380px] lg:h-[540px] xl:h-[640px] object-contain bg-muted"
                                        draggable={false}
                                    />
                                </div>

                                {/* 오른쪽 상단 확대 버튼 */}
                                <div className="absolute right-3 top-3">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-lg shadow-sm bg-background/90 hover:bg-background"
                                        onClick={() => setOpen(true)}
                                        aria-label={`${f.label} 상세 이미지 보기`}
                                    >
                                        <Maximize2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </figure>

                            {/* 표 카드 (더 크게) */}
                            <div className="rounded-2xl border bg-card overflow-hidden flex flex-col">
                                {/* 카드 헤더 */}
                                <div className="px-4 sm:px-5 py-3.5 border-b flex items-center justify-between gap-2">
                                    <h3 className="text-sm sm:text-lg md:text-xl font-semibold">
                                        {f.label} 단위표 (가격 제외)
                                    </h3>
                                    <span className="text-[11px] sm:text-xs md:text-sm text-muted-foreground">
                                        총 {f.rows.length.toLocaleString()}호
                                    </span>
                                </div>

                                {/* 표 + 스크롤 (높이 업) */}
                                <ScrollArea className="w-full max-h-[340px] sm:max-h-[380px] md:max-h-[440px] lg:max-h-[520px]">
                                    <table className="w-full text-xs sm:text-sm md:text-base table-fixed">
                                        <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                                        <tr className="border-b text-muted-foreground">
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
                                                className="border-b last:border-0 hover:bg-muted/20"
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
                        </div>
                    </TabsContent>
                ))}

                {/* 상세 이미지 모달: 원본 100% + 스크롤 */}
                {current && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent
                            className={cn(
                                "p-0 gap-0 overflow-hidden",
                                // 일반 모달 폭 (너무 커지면 부담이니 뷰포트 기준 96%)
                                "w-full max-w-[96vw] sm:max-w-[92vw] lg:max-w-6xl",
                                "[&>button:last-of-type]:hidden"
                            )}
                        >
                            {/* 상단 바 */}
                            <div className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur">
                                <span className="text-sm sm:text-base font-medium">
                                    {current.label} 상세 이미지 (원본)
                                </span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="rounded-lg"
                                    onClick={() => setOpen(false)}
                                    aria-label="닫기"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* 이미지 영역: 높이만 제한 + 내부 스크롤로 원본 그대로 보기 */}
                            <div className="bg-background max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-auto">
                                <img
                                    src={current.image}
                                    alt={current.alt ?? `${current.label} 평면도 상세`}
                                    className="block select-none"
                                    draggable={false}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </Tabs>
        </section>
    );
};
