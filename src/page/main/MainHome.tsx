"use client"




import {PromoNavbar} from "@/components/nav/PromoNavbar.tsx";
import {PromoCarousel} from "@/components/carousel/PromoCarousel.tsx";
import mainCarousel from "@/assets/main/carousel/mainCarousel.png"
import mainCarousel2 from "@/assets/main/carousel/mainCarousel2.png"
export const MainHome = () => {
    return (
        <>
            <PromoNavbar
                brand="e편한세상 동대구역 센텀스퀘어"
                nav={[
                    { label: "사업개요" ,badge: "HOT"},
                    { label: "단지정보" },
                    { label: "입지", badge: "HOT" },
                    { label: "오시는길" },
                ]}
                contactLabel="분양문의 053-760-4818"
                onItemClick={(item, idx) => console.log("clicked", item, idx)}
            />
           <PromoCarousel
                slides={[
                    {
                        image: mainCarousel,
                        headline: "동대구역을 품은 센트럴 라이프\n" +
                            "동대구역, 신세계백화점\n" +
                            "바로 앞 신축아파트\n" +
                            "이편한세상 동대구역 센텀스퀘어",
                        sub: "지하5~지상24층, 4개동 총 322세대 — 84㎡ 중심, 대지면적 9,260.50㎡ 포함",
                        badge: "OPEN",
                        ctaLabel: "사업개요 보기",
                    },
                    {
                        image: mainCarousel2,
                        headline: "3년 거주 후 매도시 분양가를 보장받는 대구 최초 안심보호단지",
                        sub: "발코니 확장 및 화장대,냉장고장,가스쿡탑,현관팬트리 시스템선반 무상제공",
                        ctaLabel: "단지안내 보기",
                    },
                ]}
                autoMs={6000}
                showIndicators
                showArrows
            />
        </>
    )
}
