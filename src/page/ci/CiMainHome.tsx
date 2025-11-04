// src/pages/CiMainHome.tsx
"use client"

import React from "react"
import { PromoNavbar } from "@/components/nav/PromoNavbar"
import { PromoFooter } from "@/components/PromoFooter"
import { SitePlanSection } from "@/components/sections/SitePlanSection"
import dangebatch from "@/assets/ci/dangebatch.png"
import jomang from "@/assets/ci/jomang.png"
import dong from "@/assets/ci/donghosu.png"
import comu from "@/assets/ci/comunity.png"
import { useNavigate } from "react-router-dom"

export const CiMainHome: React.FC = () => {
    const [navH, setNavH] = React.useState(64)
    const navigate = useNavigate()

    // (옵션) 같은 페이지 내 스크롤용 ref들
    const overviewRef = React.useRef<HTMLDivElement>(null)
    const houseTypeRef = React.useRef<HTMLDivElement>(null)

    const scrollToEl = React.useCallback(
        (el: HTMLElement | null) => {
            if (!el) return
            const top = el.getBoundingClientRect().top + window.scrollY - (navH || 64) - 12
            window.scrollTo({ top, behavior: "smooth" })
        },
        [navH]
    )

    return (
        <>
            {/* ✅ 고정 네브바 (히어로 없음 → 항상 불투명 추천) */}
            <PromoNavbar
                className="border-b bg-background/80 backdrop-blur"
                brand="e편한세상 동대구역 센텀스퀘어"
                brandHref="/bunyang"
                nav={[
                    { label: "사업개요", badge: "분양중" },
                    { label: "세대안내" },
                    { label: "단지정보" },
                    { label: "프리미엄" },
                    // { label: "오시는길" },
                ]}
                contactLabel="분양문의 053-760-4818"
                onHeightChange={(h) => setNavH(h)}
                onItemClick={(item) => {
                    const key = item.label.replace(/\s/g, "")
                    if (key.includes("사업개요")) scrollToEl(overviewRef.current)
                    else if (key.includes("세대안내")) scrollToEl(houseTypeRef.current)
                    else if (key.includes("단지정보")) navigate("/bunyang/ci")
                    else if (key.includes("프리미엄")) navigate("/bunyang/pr")
                }}
            />

            {/* ✅ ★항상 보이는 자리 보정 spacer★ */}
            <div aria-hidden style={{ height: navH }} />

            {/* ✅ 네브바 바로 아래 섹션들 */}
            <SitePlanSection
                title="단지 배치도"
                image={dangebatch}
                alt="e편한세상 동대구역 센텀스퀘어 단지 배치도"
                note={<>* 실제 시공 시 변경될 수 있으니 현장에서 확인하시기 바랍니다.</>}
                className="pt-0"
            />

            <SitePlanSection
                title="조망경관"
                image={jomang}
                alt="조망경관"
                className="pt-0"
            />

            <SitePlanSection
                title="동호수표"
                image={dong}
                alt="동호수표"
                className="pt-0"
            />

            <SitePlanSection
                title="커뮤니티"
                image={comu}
                alt="커뮤니티"
                className="pt-0"
            />

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
                navGroups={[]}
            />
        </>
    )
}
