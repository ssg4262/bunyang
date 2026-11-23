// 밑줄형 탭 공용 스타일 (사업개요, 상가 평면도 등에서 같이 사용)
export const TAB_LIST =
    "h-auto w-full justify-start gap-6 md:gap-9 rounded-none border-b border-line bg-transparent p-0"

export const TAB_TRIGGER =
    "relative h-auto flex-none rounded-none border-0 bg-transparent px-0 pb-3.5 pt-0 text-[15px] md:text-[17px] font-semibold text-neutral-400 shadow-none transition-colors hover:text-ink " +
    "data-[state=active]:bg-transparent data-[state=active]:text-ink data-[state=active]:shadow-none " +
    "after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-transparent data-[state=active]:after:bg-ink"
