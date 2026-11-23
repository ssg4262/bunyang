// 전체 화면 이미지 뷰어(팝업) 공용 스타일
// 갤러리, 배치도/프리미엄 상세, 상가 평면도, 상가 이미지 팝업이 같은 모양을 쓰도록 모아둠

/** DialogContent: 화면 전체를 덮는 어두운 뷰어 */
export const VIEWER_CONTENT =
    "fixed inset-0 z-50 flex h-[100dvh] w-screen max-w-none sm:max-w-none translate-x-0 translate-y-0 flex-col gap-0 " +
    "rounded-none border-0 bg-[#0b0b0b] p-0 text-white shadow-none outline-none duration-300 " +
    "data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100"

/** 상단 바: 왼쪽 정보, 오른쪽 아이콘 */
export const VIEWER_BAR =
    "flex h-14 md:h-16 shrink-0 items-center justify-between gap-4 pl-5 pr-2 md:pl-8 md:pr-5 pt-[env(safe-area-inset-top)]"

/** 상단 바 아이콘 버튼 (배경·테두리 없음) */
export const VIEWER_ICON_BTN =
    "inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-white/55 transition-colors hover:text-white focus:outline-none focus-visible:text-white"

/** 좌우 넘김 화살표: 각진 얇은 테두리 */
export const VIEWER_ARROW =
    "absolute top-1/2 z-20 inline-flex h-11 w-11 md:h-12 md:w-12 -translate-y-1/2 cursor-pointer items-center justify-center " +
    "border border-white/25 bg-black/30 text-white transition-colors hover:bg-white hover:text-black focus:outline-none focus-visible:bg-white focus-visible:text-black"

/** 번호 표기 (01 / 11) */
export const VIEWER_COUNT = "label-caps tabular-nums text-white"

export const pad2 = (n: number) => String(n).padStart(2, "0")
