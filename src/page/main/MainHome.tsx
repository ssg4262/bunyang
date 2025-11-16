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
import room4 from "@/assets/gallery/room4.jpg"
import living1 from "@/assets/gallery/living1.jpg"
import living2 from "@/assets/gallery/living2.jpg"
import model1 from "@/assets/gallery/model1.jpg"
import model2 from "@/assets/gallery/model2.jpg"
import model3 from "@/assets/gallery/model3.jpg"
import model4 from "@/assets/gallery/model4.jpg"
import sanga from "@/assets/gallery/sanga.jpg"

import sanga1 from "@/assets/sanga/sanga1.png"
import sanga2 from "@/assets/sanga/sanga2.png"
import sanga3 from "@/assets/sanga/sanga3.png"
import sanga4 from "@/assets/sanga/sanga4.png"
import sanga5 from "@/assets/sanga/sanga5.png"
import sanga6 from "@/assets/sanga/sanga6.png"
import sanga7 from "@/assets/sanga/sanga7.png"

import sangaB1F from "@/assets/sanga/sangaB1F.png"
import sanga1F from "@/assets/sanga/sanga1F.png"
import sanga2F from "@/assets/sanga/sanga2F.png"
import sanga3F from "@/assets/sanga/sanga3F.png"
import sanga4F from "@/assets/sanga/sanga4F.png"


import brand from "@/assets/main/carousel/brand.png"
import yeoksae from "@/assets/main/section/yeoksae.png"
import { SalesIntroSection } from "@/components/sections/SalesIntroSection.tsx"
import { PromoFooter } from "@/components/footer/PromoFooter.tsx"
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
import pr5 from "@/assets/pr/pr5.png"
import pr6 from "@/assets/pr/pr6.png"
import {ShopInfoSection} from "@/components/sections/ShopInfoSection.tsx";
import {FloorPlanTabs} from "@/components/sections/FloorPlanTabs.tsx";

export const MainHome: React.FC = () => {
    // ── 네브바 고정 높이 (스크롤 오프셋에 사용)
    const [navH, setNavH] = React.useState(64)

    // ── 스크롤 타깃 ref들
    const overviewRef = React.useRef<HTMLDivElement>(null)      // 사업개요
    const houseTypeRef = React.useRef<HTMLDivElement>(null)     // 세대안내
    const complexInfoRef = React.useRef<HTMLDivElement>(null)   // 단지정보(단지 배치도 섹션)
    const premiumRef = React.useRef<HTMLDivElement>(null)       // 프리미엄(PR 섹션)
    const sangaRef = React.useRef<HTMLDivElement>(null)       // 프리미엄(PR 섹션)
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
                        brandHref="/"
                        nav={[
                            { label: "사업개요", badge: "분양중" },
                            { label: "단지정보" },
                            { label: "세대평면도" },
                            { label: "프리미엄" },
                            { label: "상가분양안내" },
                        ]}
                        contactLabel="분양문의 053-760-4818"
                        onHeightChange={(h) => setNavH(h)}
                        // ✅ 메뉴 클릭 시 각 섹션으로 스크롤 (같은 페이지 내)
                        onItemClick={(item) => {
                            const key = item.label.replace(/\s/g, "")
                            if (key.includes("사업개요")) {
                                scrollToEl(overviewRef.current)
                            } else if (key.includes("세대평면도")) {
                                scrollToEl(houseTypeRef.current)
                            } else if (key.includes("단지정보")) {
                                // 첫 번째 단지정보 섹션(단지 배치도)로 포커싱
                                scrollToEl(complexInfoRef.current)
                            } else if (key.includes("프리미엄")) {
                                // PR 섹션으로 포커싱
                                scrollToEl(premiumRef.current)
                            } else if (key.includes("상가분양안내")) {
                            // PR 섹션으로 포커싱
                                scrollToEl(sangaRef.current)
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
                heroImage={mainCarousel}
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

            {/* ✅ 스크롤 타깃: 세대안내 */}
            <div ref={houseTypeRef}>
                <HouseTypeSelector />
            </div>


            {/* 사진 갤러리 */}
            <HousePhotoGallery
                photos={[
                    { id: 1, src: room1, alt: "방1", room: "침실", caption: "방 전경" },
                    { id: 2, src: room2, alt: "방2", room: "침실", caption: "방 전경" },
                    { id: 3, src: room3, alt: "방3", room: "침실", caption: "방 전경" },
                    { id: 4, src: room4, alt: "방4", room: "침실", caption: "방 전경" },
                    { id: 5, src: living1, alt: "거실1", room: "거실", caption: "거실 전경" },
                    { id: 6, src: living2, alt: "거실2", room: "거실", caption: "거실 전경" },
                    { id: 7, src: model1, alt: "모델1", room: "모델", caption: "미니어쳐" },
                    { id: 8, src: model2, alt: "모델2", room: "모델", caption: "미니어쳐" },
                    { id: 9, src: model3, alt: "모델3", room: "모델", caption: "미니어쳐" },
                    { id: 10, src: model4, alt: "모델4", room: "모델", caption: "미니어쳐" },
                    { id: 11, src: sanga, alt: "상가", room: "상가", caption: "미니어쳐" },
                ]}
                defaultFilter="전체"
            />
            <div ref={sangaRef}>
                <ShopInfoSection
                    items={[
                        { src: sanga1, title: "고속터미널", subtitle: "상업시설", badge: "신규", },
                        { src: sanga2, title: "도시철도1호선", subtitle: "도시철도 1호선", badge: "신규", },
                        { src: sanga3, title: "B1F", subtitle: "지하1층", badge: "신규", },
                        { src: sanga4, title: "1F", subtitle: "1층", badge: "신규", },
                        { src: sanga5, title: "2F", subtitle: "2층", badge: "신규", },
                        { src: sanga6, title: "3F", subtitle: "3층", badge: "신규", },
                        { src: sanga7, title: "4F", subtitle: "4층", badge: "신규", },
                    ]}
                    // title="상가안내"
                    // thumbHeight={220}
                    // rounded={true}
                />
                <FloorPlanTabs floors={[
                    {
                        id: "B1",
                        label: "B1",
                        image: sangaB1F,
                        alt: "B1층 평면도",
                        rows: [
                            { no: "B101", exclusivePyeong: 48.81, contractPyeong: 118.62 },
                            { no: "B102", exclusivePyeong: 52.07, contractPyeong: 126.53 },
                            { no: "B103", exclusivePyeong: 80.98, contractPyeong: 196.79 },
                            { no: "B104", exclusivePyeong: 72.62, contractPyeong: 176.49 },
                        ],
                    },
                    {
                        id: "1F",
                        label: "1F",
                        image: sanga1F,
                        alt: "1층 평면도",
                        rows: [
                            { no: "101",   exclusivePyeong: 11.13, contractPyeong: 25.64 },
                            { no: "102-1", exclusivePyeong: 16.10, contractPyeong: 37.09 },
                            { no: "102-2", exclusivePyeong: 10.70, contractPyeong: 27.08 },
                            { no: "103",   exclusivePyeong: 14.19, contractPyeong: 31.60 },
                            { no: "104",   exclusivePyeong:  8.76, contractPyeong: 20.10 },
                            { no: "105",   exclusivePyeong: 10.49, contractPyeong: 24.19 },
                            { no: "106",   exclusivePyeong: 15.89, contractPyeong: 36.15 },
                            { no: "107",   exclusivePyeong:  9.94, contractPyeong: 23.15 },
                            { no: "108",   exclusivePyeong: 10.72, contractPyeong: 24.97 },
                            { no: "108A",  exclusivePyeong: 12.29, contractPyeong: 28.63 },
                            { no: "109",   exclusivePyeong: 12.29, contractPyeong: 28.63 },
                            { no: "110",   exclusivePyeong: 10.82, contractPyeong: 25.11 },
                            { no: "111",   exclusivePyeong: 15.89, contractPyeong: 36.15 },
                            { no: "112",   exclusivePyeong: 13.80, contractPyeong: 29.76 },
                            { no: "113",   exclusivePyeong: 13.80, contractPyeong: 29.76 },
                            { no: "114",   exclusivePyeong: 13.94, contractPyeong: 32.71 },
                            { no: "115",   exclusivePyeong: 14.52, contractPyeong: 33.47 },
                            { no: "116",   exclusivePyeong: 16.22, contractPyeong: 37.37 },

                            { no: "116A",  exclusivePyeong: 13.15, contractPyeong: 30.30 },
                            { no: "117",   exclusivePyeong: 23.88, contractPyeong: 55.02 },
                            { no: "118",   exclusivePyeong: 14.70, contractPyeong: 35.02 },
                            { no: "119",   exclusivePyeong: 16.28, contractPyeong: 37.91 },
                            { no: "120",   exclusivePyeong: 12.64, contractPyeong: 29.08 },
                            { no: "121",   exclusivePyeong: 17.45, contractPyeong: 41.48 },
                            { no: "122",   exclusivePyeong: 24.30, contractPyeong: 57.21 },
                            { no: "123",   exclusivePyeong: 20.10, contractPyeong: 47.35 },
                            { no: "124",   exclusivePyeong: 18.00, contractPyeong: 42.62 },
                            { no: "125",   exclusivePyeong: 16.97, contractPyeong: 39.16 },
                            { no: "126",   exclusivePyeong: 15.89, contractPyeong: 35.35 },
                            { no: "127",   exclusivePyeong: 23.12, contractPyeong: 53.32 },
                            { no: "128",   exclusivePyeong: 22.42, contractPyeong: 51.70 },
                            { no: "129",   exclusivePyeong: 15.77, contractPyeong: 37.21 },
                            { no: "130",   exclusivePyeong: 18.84, contractPyeong: 44.74 },
                            { no: "131",   exclusivePyeong: 16.01, contractPyeong: 35.88 },
                            { no: "132",   exclusivePyeong: 15.37, contractPyeong: 35.43 },
                        ],
                    },
                    {
                        id: "2F",
                        label: "2F",
                        image: sanga2F,
                        alt: "2층 평면도",
                        rows: [
                            { no: "101-2", exclusivePyeong: 21.20, contractPyeong: 50.61 },
                            { no: "102-2", exclusivePyeong: 32.12, contractPyeong: 76.67 },
                            { no: "201",   exclusivePyeong: 21.30, contractPyeong: 50.84 },
                            { no: "202",   exclusivePyeong: 11.49, contractPyeong: 27.44 },
                            { no: "203",   exclusivePyeong: 12.98, contractPyeong: 30.99 },
                            { no: "204",   exclusivePyeong: 18.69, contractPyeong: 44.62 },
                            { no: "205",   exclusivePyeong: 19.66, contractPyeong: 46.94 },
                            { no: "206",   exclusivePyeong: 23.77, contractPyeong: 56.74 },
                            { no: "207",   exclusivePyeong: 16.19, contractPyeong: 38.64 },
                            { no: "208",   exclusivePyeong: 16.72, contractPyeong: 39.91 },
                            { no: "209",   exclusivePyeong: 23.19, contractPyeong: 55.37 },
                            { no: "210",   exclusivePyeong:  6.00, contractPyeong: 14.33 },
                            { no: "211",   exclusivePyeong: 18.89, contractPyeong: 45.09 },
                            { no: "212",   exclusivePyeong: 63.65, contractPyeong: 151.94 },
                            { no: "213",   exclusivePyeong: 18.14, contractPyeong: 43.31 },
                            { no: "214",   exclusivePyeong: 30.11, contractPyeong: 71.89 },

                            { no: "215",   exclusivePyeong: 30.85, contractPyeong: 73.65 },
                            { no: "216",   exclusivePyeong: 22.79, contractPyeong: 54.41 },
                            { no: "217",   exclusivePyeong: 37.52, contractPyeong: 89.57 },
                            { no: "218",   exclusivePyeong: 26.03, contractPyeong: 62.15 },
                            { no: "219",   exclusivePyeong: 20.59, contractPyeong: 49.15 },
                            { no: "220",   exclusivePyeong: 18.55, contractPyeong: 44.29 },
                            { no: "221",   exclusivePyeong: 33.47, contractPyeong: 79.89 },
                            { no: "222",   exclusivePyeong: 16.35, contractPyeong: 39.04 },
                            { no: "223",   exclusivePyeong: 24.26, contractPyeong: 57.92 },
                            { no: "224",   exclusivePyeong: 54.53, contractPyeong: 130.17 },
                            { no: "225",   exclusivePyeong: 12.50, contractPyeong: 29.84 },
                            { no: "226",   exclusivePyeong: 17.58, contractPyeong: 41.98 },
                            { no: "227",   exclusivePyeong: 18.01, contractPyeong: 42.99 },
                        ],
                    },{
                        id: "3F",
                        label: "3F",
                        image:sanga3F,
                        alt: "3층 평면도",
                        rows: [
                            { no: "301", exclusivePyeong: 32.87, contractPyeong: 73.20 },
                            { no: "302", exclusivePyeong: 25.60, contractPyeong: 57.02 },
                            { no: "303", exclusivePyeong: 27.94, contractPyeong: 62.24 },
                            { no: "304", exclusivePyeong: 36.88, contractPyeong: 82.14 },
                            { no: "305", exclusivePyeong: 50.96, contractPyeong: 113.51 },
                            { no: "306", exclusivePyeong: 32.03, contractPyeong: 71.33 },
                            { no: "307", exclusivePyeong: 39.30, contractPyeong: 87.54 },
                            { no: "308", exclusivePyeong: 24.06, contractPyeong: 53.58 },
                            { no: "309", exclusivePyeong: 70.93, contractPyeong: 157.97 },
                            { no: "310", exclusivePyeong: 24.04, contractPyeong: 53.55 },
                            { no: "311", exclusivePyeong: 41.31, contractPyeong: 92.00 },
                            { no: "312", exclusivePyeong: 55.75, contractPyeong: 124.17 },
                            { no: "313", exclusivePyeong: 72.87, contractPyeong: 162.31 },
                        ],
                    },{
                        id: "4F",
                        label: "4F",
                        image: sanga4F,
                        alt: "4층 평면도",
                        rows: [
                            { no: "401", exclusivePyeong: 32.87, contractPyeong: 74.38 },
                            { no: "402", exclusivePyeong: 25.60, contractPyeong: 57.93 },
                            { no: "403", exclusivePyeong: 27.94, contractPyeong: 63.24 },
                            { no: "404", exclusivePyeong: 36.88, contractPyeong: 83.45 },
                            { no: "405", exclusivePyeong: 50.96, contractPyeong: 115.33 },
                            { no: "406", exclusivePyeong: 32.03, contractPyeong: 72.47 },
                            { no: "407", exclusivePyeong: 39.30, contractPyeong: 88.94 },
                            { no: "408", exclusivePyeong: 24.06, contractPyeong: 54.44 },
                            { no: "409", exclusivePyeong: 67.90, contractPyeong: 153.65 },
                            { no: "410", exclusivePyeong: 24.04, contractPyeong: 54.40 },
                            { no: "411", exclusivePyeong: 29.36, contractPyeong: 66.44 },
                            { no: "412", exclusivePyeong: 49.10, contractPyeong: 111.10 },
                            { no: "413", exclusivePyeong: 69.44, contractPyeong: 157.13 },
                        ],
                    }



                ]} defaultTab="B1" className="mt-6" />
            </div>
            {/* ✅ 스크롤 타깃: 프리미엄(PR 섹션으로 점프) */}
            <div ref={premiumRef}>
                <SitePlanSection
                    title="프리미엄 혜택"
                    image={pr5}
                    alt="e편한세상 동대구역 센텀스퀘어 PR"
                    note={<>* 실제 시공 시 변경될 수 있으니 현장에서 확인하시기 바랍니다.</>}
                    className="pt-0"
                />

                <SitePlanSection
                    title="프리미엄 무상제공 품목"
                    image={pr6}
                    alt="e편한세상 동대구역 센텀스퀘어 PR"
                    note={<>* 실제 시공 시 변경될 수 있으니 현장에서 확인하시기 바랍니다.</>}
                    className="pt-0"
                />

                <SitePlanSection
                    title="프리미엄 브랜드 가치"
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
                bizName=""
                bizRep=""
                bizRegNo=""
                navGroups={[]}
            />
        </>
    )
}
