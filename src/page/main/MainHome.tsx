// src/pages/MainHome.tsx  (또는 사용하는 위치 파일)
"use client"

import React from "react"
import { PromoNavbar } from "@/components/nav/PromoNavbar.tsx"
import { PromoCarousel } from "@/components/carousel/PromoCarousel.tsx"
import mainCarousel from "@/assets/main/carousel/mainCarousel.png"
import mainCarousel2 from "@/assets/main/carousel/mainCarousel2.png"
import yeoksae from "@/assets/main/section/yeoksae.png"
import {SalesIntroSection} from "@/components/sections/SalesIntroSection.tsx";
import {PromoFooter} from "@/components/PromoFooter.tsx";
import {HouseTypeSelector} from "@/components/sections/HouseTypeSelector.tsx";


export const MainHome: React.FC = () => {
    // 네브바 실제 높이 측정 (오버레이 상단 패딩에 사용: 겹침 방지)
    const navRef = React.useRef<HTMLDivElement>(null)
    const [navH, setNavH] = React.useState(0)

    React.useLayoutEffect(() => {
        const update = () => setNavH(navRef.current?.offsetHeight ?? 0)
        update()
        const ro = new ResizeObserver(update)
        if (navRef.current) ro.observe(navRef.current)
        window.addEventListener("resize", update)
        return () => {
            ro.disconnect()
            window.removeEventListener("resize", update)
        }
    }, [])

    return (
        <>
            <header className="relative h-[100svh] min-h-screen font-gowoon-dodum">
                {/* 네브바: 캐러셀 위 ‘포함’(오버레이) */}
                <div
                    ref={navRef}
                    className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/35 to-transparent"
                >
                    <PromoNavbar
                        brand="e편한세상 동대구역 센텀스퀘어"
                        nav={[
                            {label: "사업개요", badge: "분양중"},
                            {label: "단지정보"},
                            {label: "입지안내",},
                            {label: "단지안내",},
                            {label: "세대안내",},
                            {label: "프리미엄",},
                            {label: "오시는길"},
                        ]}
                        contactLabel="분양문의 053-760-4818"
                        onItemClick={(item, idx) => console.log("clicked", item, idx)}
                    />
                    </div>

                {/* 캐러셀: 부모 높이 100% (네브바는 포함/오버레이) */}
                <div className="absolute inset-0">
                    <PromoCarousel
                        heightMode="fillParent"
                        topOffsetPx={navH} // 콘텐츠 상단 패딩에 반영
                        slides={[
                            {
                                image: mainCarousel,
                                headline: "동대구역을 품은 센트럴 라이프\n동대구역, 신세계백화점\n바로 앞 신축아파트\n이편한세상 동대구역 센텀스퀘어",
                                sub: "지하5~지상24층, 4개동 총 322세대 — 84㎡ 중심, 대지면적 9,260.50㎡ 포함",
                                badge: "분양중",
                                ctaLabel: "분양문의 053-760-4818",
                            },
                            {
                                image: mainCarousel2,
                                headline: "3년 거주 후 매도시 분양가를 보장받는 대구 최초 안심보호단지",
                                sub: "발코니 확장 및 화장대,냉장고장,가스쿡탑,현관팬트리 시스템선반 무상제공",
                                badge: "분양중",
                                ctaLabel: "분양문의 053-760-4818",
                            },
                        ]}
                        autoMs={6000}
                        showIndicators
                        showArrows/>
                </div>
            </header>
            <SalesIntroSection
                heroImage={mainCarousel as any}
                eyebrow="동대구 최중심을 누리는 특별한 삶"
                title="e편한세상 동대구역 센텀스퀘어"
                badges={["분양중", "공사완료"]}
                phone="053-760-4818"
                // 우측(따옴표+헤드라인+서브)은 기본값 그대로 쓰거나 아래처럼 교체 가능
                rightImageSrc={yeoksae}
                rightImageAlt="주변시설 비주얼"
            />
            <HouseTypeSelector/>
            <PromoFooter
                brand="e편한세상 동대구역 센텀스퀘어"
                tagline="동대구 최중심 라이프"
                phone="053-760-4818"
                addressLines={[
                    "대구 동구 신천동 325-1",
                    "e편한세상 동대구역 센텀스퀘어 분양홍보관"
                ]}
                bizName="시행 · 시공: (주)건설"
                bizRep="대표: 이광탁"
                bizRegNo="사업자등록번호: 123-45-67890"
                navGroups={[
                    { title: "안내", items: ["사업개요", "단지정보", "입지안내","단지안내","세대안내","프리미엄","오시는길"] },
                    { title: "고객지원", items: ["상담문의", "관심고객 등록", "홍보자료"] },
                    { title: "정책", items: ["개인정보 처리방침", "이용약관"] },
                ]}
            />
        </>
    )
}
