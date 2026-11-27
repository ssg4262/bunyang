// src/components/common/icons.tsx
// 사이트 전용 아이콘: 가는 선(1.25px), 각진 끝. 기본 아이콘 세트 대신 사용.
// lucide 아이콘과 같은 이름·같은 방식(className으로 크기 지정)으로 쓸 수 있게 맞춤.
import * as React from "react"

type IconProps = {
    className?: string
    /** 호환용(무시): 선 굵기는 사이트 전체에서 하나로 통일 */
    strokeWidth?: number
}

const Svg: React.FC<IconProps & { children: React.ReactNode; rotate?: number }> = ({
    className,
    children,
    rotate = 0,
}) => (
    <svg
        viewBox="0 0 20 20"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden
        className={className}
        style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
        {children}
    </svg>
)

/* 긴 화살표 */
const ARROW = <path d="M2.5 10h14M12 5.5l4.5 4.5-4.5 4.5" />
export const ArrowRight: React.FC<IconProps> = (p) => <Svg {...p}>{ARROW}</Svg>
export const ArrowUp: React.FC<IconProps> = (p) => <Svg {...p} rotate={-90}>{ARROW}</Svg>
export const ArrowDown: React.FC<IconProps> = (p) => <Svg {...p} rotate={90}>{ARROW}</Svg>

/* 꺾쇠 */
const CHEVRON = <path d="M7.5 4l6 6-6 6" />
export const ChevronRight: React.FC<IconProps> = (p) => <Svg {...p}>{CHEVRON}</Svg>
export const ChevronLeft: React.FC<IconProps> = (p) => <Svg {...p} rotate={180}>{CHEVRON}</Svg>
export const ChevronDown: React.FC<IconProps> = (p) => <Svg {...p} rotate={90}>{CHEVRON}</Svg>
export const ChevronUp: React.FC<IconProps> = (p) => <Svg {...p} rotate={-90}>{CHEVRON}</Svg>

/* 닫기 */
export const X: React.FC<IconProps> = (p) => (
    <Svg {...p}>
        <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" />
    </Svg>
)

/* 확대 / 축소 */
export const ZoomIn: React.FC<IconProps> = (p) => (
    <Svg {...p}>
        <path d="M10 3.5v13M3.5 10h13" />
    </Svg>
)
export const ZoomOut: React.FC<IconProps> = (p) => (
    <Svg {...p}>
        <path d="M3.5 10h13" />
    </Svg>
)

/* 크게 보기 / 새 탭 */
export const Maximize2: React.FC<IconProps> = (p) => (
    <Svg {...p}>
        <path d="M11.5 3.5h5v5M16.5 3.5l-6 6M8.5 16.5h-5v-5M3.5 16.5l6-6" />
    </Svg>
)

/* 내려받기 */
export const Download: React.FC<IconProps> = (p) => (
    <Svg {...p}>
        <path d="M10 3v10.5M5.5 9.5L10 14l4.5-4.5M3.5 17h13" />
    </Svg>
)
