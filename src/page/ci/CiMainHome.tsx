// src/pages/MainHome.tsx
"use client"

import React from "react"
import { PromoNavbar } from "@/components/nav/PromoNavbar.tsx"
import { PromoFooter } from "@/components/PromoFooter.tsx"


export const CiMainHome: React.FC = () => {
    // ── 네브바 고정 높이 (스크롤 오프셋에 사용)
    const [navH, setNavH] = React.useState(64)

    // ── 스크롤 타깃 ref들
    const overviewRef = React.useRef<HTMLDivElement>(null)      // ProjectOverviewTabs
    const houseTypeRef = React.useRef<HTMLDivElement>(null)     // HouseTypeSelector 등 필요 시 추가

    // 스무스 스크롤 도우미(헤더 높이만큼 여유)
    const scrollToEl = React.useCallback(
        (el: HTMLElement | null) => {
            if (!el) return
            const top =
                el.getBoundingClientRect().top + window.scrollY - (navH || 64) - 12
            window.scrollTo({ top, behavior: "smooth" })
        },
        [navH]
    )


    return (
        <>
            <header className="relative h-[100svh] min-h-screen font-gowoon-dodum">
                {/* 네브바: 캐러셀 위 ‘포함’(오버레이) */}
                <div className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/35 to-transparent">
                    <PromoNavbar
                        brand="e편한세상 동대구역 센텀스퀘어"
                        brandHref="/bunyang"
                        nav={[
                            { label: "사업개요", badge: "분양중" },
                            { label: "세대안내" },
                            { label: "단지정보" },
                            { label: "입지안내" },
                            { label: "프리미엄" },
                            { label: "오시는길" },
                        ]}
                        contactLabel="분양문의 053-760-4818"
                        // ✅ 헤더 실제 높이 콜백으로 받아서 오프셋에 사용
                        onHeightChange={(h) => setNavH(h)}
                        // ✅ 메뉴 클릭 시 각 섹션으로 스크롤
                        onItemClick={(item) => {
                            const key = item.label.replace(/\s/g, "") // 공백 제거 매칭
                            if (key.includes("사업개요")) {
                                scrollToEl(overviewRef.current)
                            } else if (key.includes("세대안내")) {
                                scrollToEl(houseTypeRef.current)
                            }
                            // 필요하면 여기서 다른 섹션도 추가
                        }}
                    />
                </div>
            </header>


            <PromoFooter
                brand="e편한세상 동대구역 센텀스퀘어"
                tagline="동대구 최중심 라이프"
                phone="053-760-4818"
                addressLines={[
                    "대구 동구 신천동 325-1",
                    "e편한세상 동대구역 센텀스퀘어 분양홍보관",
                ]}
                bizName="시행 · 시공: (주)건설"
                bizRep="대표: 이광탁"
                bizRegNo="사업자등록번호: 123-45-67890"
                navGroups={[
                    {
                        title: "안내",
                        items: [
                            "사업개요",
                            "단지정보",
                            "입지안내",
                            "단지안내",
                            "세대안내",
                            "프리미엄",
                            "오시는길",
                        ],
                    },
                    { title: "고객지원", items: ["상담문의", "관심고객 등록", "홍보자료"] },
                    { title: "정책", items: ["개인정보 처리방침", "이용약관"] },
                ]}
            />
        </>
    )
}
