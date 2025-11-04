// src/pages/MainHome.tsx
"use client"

import React from "react"
import { PromoNavbar } from "@/components/nav/PromoNavbar.tsx"
import { PromoCarousel } from "@/components/carousel/PromoCarousel.tsx"
import mainCarousel from "@/assets/main/carousel/mainCarousel.png"
import mainCarousel2 from "@/assets/main/carousel/mainCarousel2.png"
import mainCarousel3 from "@/assets/main/carousel/mainCarousel3.png"
import room1 from "@/assets/gallery/room1.jpg"
import room2 from "@/assets/gallery/room2.jpg"
import room3 from "@/assets/gallery/room3.jpg"
import living1 from "@/assets/gallery/living1.jpg"
import living2 from "@/assets/gallery/living2.jpg"
import living3 from "@/assets/gallery/living3.jpg"

import brand from "@/assets/main/carousel/brand.png"
import yeoksae from "@/assets/main/section/yeoksae.png"
import { SalesIntroSection } from "@/components/sections/SalesIntroSection.tsx"
import { PromoFooter } from "@/components/PromoFooter.tsx"
import { HouseTypeSelector } from "@/components/sections/HouseTypeSelector.tsx"
import {
    ProjectOverviewTabs,
    type SpecItem,
    type UnitRow,
} from "@/components/sections/ProjectOverviewTabs.tsx"
import { HousePhotoGallery } from "@/components/sections/HousePhotoGallery"
import { SitePlanSection } from "@/components/sections/SitePlanSection.tsx"
import dangebatch from "@/assets/ci/dangebatch.png"
import jomang from "@/assets/ci/jomang.png"
import dong from "@/assets/ci/donghosu.png"
import comu from "@/assets/ci/comunity.png"
import pr1 from "@/assets/pr/pr1.png"
import pr2 from "@/assets/pr/pr2.png"
import pr3 from "@/assets/pr/pr3.png"
import pr4 from "@/assets/pr/pr4.png"


export const MainHome: React.FC = () => {
    // ── 네브바 고정 높이 (스크롤 오프셋에 사용)
    const [navH, setNavH] = React.useState(64)

    // ── 스크롤 타깃 ref들
    const overviewRef = React.useRef<HTMLDivElement>(null)      // 사업개요
    const houseTypeRef = React.useRef<HTMLDivElement>(null)     // 세대안내
    const complexInfoRef = React.useRef<HTMLDivElement>(null)   // 단지정보(단지 배치도 섹션)
    const premiumRef = React.useRef<HTMLDivElement>(null)       // 프리미엄(PR 섹션)

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

    // ── 표 데이터
    const rows: UnitRow[] = [
        { type: "79A", households: 1, areaExclusive: 79.7740, areaSupply: 102.9682, ratio: 0.6, color: "#f4a259" },
        { type: "79B", households: 1, areaExclusive: 79.8927, areaSupply: 102.9382, ratio: 0.6, color: "#f78bb4" },
        { type: "84A", households: 132, areaExclusive: 84.7113, areaSupply: 109.3578, ratio: 33.08, color: "#58b1ff" },
        { type: "84B", households: 18, areaExclusive: 84.9165, areaSupply: 109.2775, ratio: 33.06, color: "#6bd6a0" },
        { type: "84C", households: 18, areaExclusive: 84.9463, areaSupply: 109.2861, ratio: 33.06, color: "#f2d07c" },
        { type: "107A", households: 18, areaExclusive: 107.8898, areaSupply: 135.1968, ratio: 41.09, color: "#ffa36c" },
        { type: "107B", households: 20, areaExclusive: 107.6682, areaSupply: 137.6717, ratio: 41.65, color: "#ffe082" },
        { type: "125A", households: 38, areaExclusive: 125.7263, areaSupply: 161.5148, ratio: 48.86, color: "#b8e1ff" },
        { type: "125B", households: 18, areaExclusive: 125.9906, areaSupply: 162.1473, ratio: 49.05, color: "#a2d2ff" },
        { type: "125C", households: 18, areaExclusive: 125.7459, areaSupply: 162.0349, ratio: 49.02, color: "#c9d5ff" },
        { type: "125D", households: 20, areaExclusive: 125.8938, areaSupply: 165.7958, ratio: 49.80, color: "#d8c9ff" },
        { type: "125E", households: 20, areaExclusive: 125.4917, areaSupply: 161.4935, ratio: 48.85, color: "#f3c0ff" },
    ]

    const specs: SpecItem[] = [
        { label: "사 업 명", value: "e편한세상 동대구역 센텀스퀘어" },
        { label: "대지 위치", value: "대구광역시 동구 신천동 328-1번지 일원" },
        { label: "대지면적", value: <>9,260.50㎡</> },
        { label: "건축면적", value: <>5,851.90㎡</> },
        { label: "연면적", value: <>93,514.48㎡</> },
        { label: "용적률/건폐율", value: <>779.54% / 75.38%</> },
        { label: "건축규모", value: "지하5층~지상24층 4개동 총 322세대 + 상업시설 127실" },
        { label: "주차대수", value: "공동주택 475대(1.47:1) / 상업시설 196대" },
        { label: "입주", value: "2025년 11월 예정" },
    ]

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
                            { label: "프리미엄" },
                            // { label: "오시는길" },
                        ]}
                        contactLabel="분양문의 053-760-4818"
                        onHeightChange={(h) => setNavH(h)}
                        // ✅ 메뉴 클릭 시 각 섹션으로 스크롤 (같은 페이지 내)
                        onItemClick={(item) => {
                            const key = item.label.replace(/\s/g, "")
                            if (key.includes("사업개요")) {
                                scrollToEl(overviewRef.current)
                            } else if (key.includes("세대안내")) {
                                scrollToEl(houseTypeRef.current)
                            } else if (key.includes("단지정보")) {
                                // 첫 번째 단지정보 섹션(단지 배치도)로 포커싱
                                scrollToEl(complexInfoRef.current)
                            } else if (key.includes("프리미엄")) {
                                // PR 섹션으로 포커싱
                                scrollToEl(premiumRef.current)
                            }
                        }}
                    />
                </div>

                {/* 캐러셀: 부모 높이 100% (네브바는 포함/오버레이) */}
                <div className="absolute inset-0">
                    <PromoCarousel
                        heightMode="fillParent"
                        topOffsetPx={navH}
                        slides={[
                            {
                                image: mainCarousel,
                                headline:
                                    "동대구역을 품은 센트럴 라이프\n동대구역, 신세계백화점\n바로 앞 신축아파트\n이편한세상 동대구역 센텀스퀘어",
                                sub: "지하5~지상24층, 4개동 총 322세대 — 84㎡ 중심, 대지면적 9,260.50㎡ 포함",
                                badge: "분양중",
                                ctaLabel: "분양문의 053-760-4818",
                            },
                            {
                                image: mainCarousel2,
                                headline:
                                    "3년 거주 후 매도시 분양가를 보장받는 대구 최초 안심보호단지",
                                sub: "발코니 확장 및 화장대,냉장고장,가스쿡탑,현관팬트리 시스템선반 무상제공",
                                badge: "분양중",
                                ctaLabel: "분양문의 053-760-4818",
                            },
                        ]}
                        autoMs={6000}
                        showIndicators
                        showArrows
                    />
                </div>
            </header>

            <SalesIntroSection
                heroImage={mainCarousel as any}
                eyebrow="동대구 최중심을 누리는 특별한 삶"
                title="e편한세상 동대구역 센텀스퀘어"
                badges={["분양중", "공사완료"]}
                phone="053-760-4818"
                rightImageSrc={yeoksae}
                rightImageAlt="주변시설 비주얼"
            />

            {/* ✅ 스크롤 타깃: 사업개요(탭) */}
            <div ref={overviewRef}>
                <ProjectOverviewTabs
                    overviewHero={mainCarousel}
                    unitRows={rows}
                    specList={specs}
                    perspectiveImages={[mainCarousel, mainCarousel3]}
                    brandImages={[brand]}
                />
            </div>

            {/* 사진 갤러리 */}
            <HousePhotoGallery
                photos={[
                    { id: 1, src: room1, alt: "방1", room: "침실", caption: "방 전경" },
                    { id: 2, src: room2, alt: "방2", room: "침실", caption: "방 전경" },
                    { id: 3, src: room3, alt: "방3", room: "침실", caption: "방 전경" },
                    { id: 4, src: living1, alt: "거실1", room: "거실", caption: "거실 전경" },
                    { id: 5, src: living2, alt: "거실2", room: "거실", caption: "거실 전경" },
                    { id: 6, src: living3, alt: "거실3", room: "거실", caption: "거실 전경" },
                ]}
                defaultFilter="전체"
            />

            {/* ✅ 스크롤 타깃: 세대안내 */}
            <div ref={houseTypeRef}>
                <HouseTypeSelector />
            </div>

            {/* ✅ 스크롤 타깃: 단지정보(첫 섹션으로 점프) */}
            <div ref={complexInfoRef}>
                <SitePlanSection
                    title="단지 배치도"
                    image={dangebatch}
                    alt="e편한세상 동대구역 센텀스퀘어 단지 배치도"
                    note={<>* 실제 시공 시 변경될 수 있으니 현장에서 확인하시기 바랍니다.</>}
                    className="pt-0"
                />
            </div>

            {/* 단지정보의 나머지 섹션들(연속 배치) */}
            <SitePlanSection title="조망경관" image={jomang} alt="조망경관" className="pt-0" />
            <SitePlanSection title="동호수표" image={dong} alt="동호수표" className="pt-0" />
            <SitePlanSection title="커뮤니티" image={comu} alt="커뮤니티" className="pt-0" />

            {/* ✅ 스크롤 타깃: 프리미엄(PR 섹션으로 점프) */}
            <div ref={premiumRef}>
                <SitePlanSection
                    title="프리미엄"
                    image={pr1}
                    alt="e편한세상 동대구역 센텀스퀘어 PR"
                    note={<>* 실제 시공 시 변경될 수 있으니 현장에서 확인하시기 바랍니다.</>}
                    className="pt-0"
                />

                <SitePlanSection
                    title="프리미엄 슬세권"
                    image={pr3}
                    alt="e편한세상 동대구역 센텀스퀘어 PR"
                    note={<>* 실제 시공 시 변경될 수 있으니 현장에서 확인하시기 바랍니다.</>}
                    className="pt-0"
                />

                <SitePlanSection
                    title="프리미엄 백세권"
                    image={pr4}
                    alt="e편한세상 동대구역 센텀스퀘어 PR"
                    note={<>* 실제 시공 시 변경될 수 있으니 현장에서 확인하시기 바랍니다.</>}
                    className="pt-0"
                />

                <SitePlanSection
                    title="영남일보 기사"
                    image={pr2}
                    alt="e편한세상 동대구역 센텀스퀘어 PR"
                    note={<>* 실제 시공 시 변경될 수 있으니 현장에서 확인하시기 바랍니다.</>}
                    className="pt-0"
                />


            </div>

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
