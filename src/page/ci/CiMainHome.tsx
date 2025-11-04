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

export const CiMainHome: React.FC = () => {
    const [navH, setNavH] = React.useState(64)

    // 섹션 스크롤용(현재 페이지에서 “사업개요/세대안내”를 쓸 경우 대비)
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
            {/* ✅ 전체화면 헤더(absolute) 제거! 네브바를 정상 흐름으로 배치 */}
            <PromoNavbar
                brand="e편한세상 동대구역 센텀스퀘어"
                brandHref="/bunyang"
                nav={[
                    { label: "사업개요", badge: "분양중" },
                    { label: "세대안내" },
                    { label: "단지정보" },
                    { label: "프리미엄" },
                    { label: "오시는길" },
                ]}
                contactLabel="분양문의 053-760-4818"
                onHeightChange={(h) => setNavH(h)}
                // 본 페이지에서는 섹션이 없지만 콜백은 남겨둠(재사용성)
                onItemClick={(item) => {
                    const key = item.label.replace(/\s/g, "")
                    if (key.includes("사업개요")) scrollToEl(overviewRef.current)
                    else if (key.includes("세대안내")) scrollToEl(houseTypeRef.current)
                }}
                // 히어로가 없으므로 투명 모드가 잠깐 나올 수 있음—완전 불투명만 원하면
                // className="border-b bg-background/80 backdrop-blur"
                // 을 추가하거나, PromoNavbar에 forceOpaque 같은 prop을 추후 확장해도 됩니다.
            />

            {/* ✅ 네브바 바로 아래 섹션 */}
            <SitePlanSection
                title="단지 배치도"
                image={dangebatch}
                alt="e편한세상 동대구역 센텀스퀘어 단지 배치도"
                note={<>* 실제 시공 시 변경될 수 있으니 현장에서 확인하시기 바랍니다.</>}
                className="pt-0" // 필요시 여백 조정
            />
            <SitePlanSection
                title="조망경관"
                image={jomang}
                alt="조망경관"
                className="pt-0" // 필요시 여백 조정
            />

            <SitePlanSection
                title="동호수표"
                image={dong}
                alt="동호수표"
                className="pt-0" // 필요시 여백 조정
            />

            <SitePlanSection
                title="커뮤니티"
                image={comu}
                alt="커뮤니티"
                className="pt-0" // 필요시 여백 조정
            />


            {/* (선택) 이후 다른 섹션들…
      <div ref={overviewRef}>…</div>
      <div ref={houseTypeRef}>…</div>
      */}

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
                ]}
            />
        </>
    )
}


