// src/lib/smartDial.ts
export type DesktopApp = "tel" | "skype" | "facetime" | "custom"

export type SmartDialOptions = {
    /** 데스크탑에서 어떤 앱 스킴을 우선 시도할지 (기본: 'tel') */
    desktopApp?: DesktopApp
    /** desktopApp === 'custom' 일 때 사용할 스킴 템플릿. 예: "myapp://call?to={phone}" */
    customScheme?: string
    /** 실패 시 콜백 (앱이 없거나 차단된 경우 등) */
    onFail?: (reason?: unknown) => void
    /** 성공 시 콜백 (내비게이션 시도 직후) */
    onStart?: () => void
}

/** 숫자/플러스만 남김 */
function normalizePhone(input: string) {
    const trimmed = (input || "").trim()
    // +로 시작 허용, 나머지는 숫자만
    const plus = trimmed.startsWith("+") ? "+" : ""
    const digits = trimmed.replace(/[^\d]/g, "")
    return plus + digits
}

function isMobileUA() {
    // 광범위 모바일 판별 + UA-CH
    const ua = navigator.userAgent || ""
    const isUACH = (navigator as any).userAgentData?.mobile === true
    return (
        isUACH ||
        /Android|iPhone|iPad|iPod|Windows Phone|Mobile|BlackBerry|Opera Mini/i.test(
            ua
        )
    )
}

function buildScheme(phone: string, app: DesktopApp, custom?: string) {
    switch (app) {
        case "skype":
            return `skype:${phone}?call`
        case "facetime":
            // macOS/iOS 페이스타임 오디오
            return `facetime-audio:${phone}`
        case "custom":
            if (!custom) return null
            return custom.replace("{phone}", encodeURIComponent(phone))
        case "tel":
        default:
            return `tel:${phone}`
    }
}

/**
 * 모바일: tel:// 로 즉시 다이얼
 * 데스크탑: 지정한 앱 스킴(혹은 tel) 우선 → 안 되면 tel → (최후) Skype/FaceTime 순으로 폴백
 */
export function smartDial(rawPhone: string, opts: SmartDialOptions = {}) {
    const phone = normalizePhone(rawPhone)
    if (!phone) {
        opts.onFail?.("EMPTY_PHONE")
        return false
    }

    const isMobile = isMobileUA()
    const preferred = opts.desktopApp ?? "tel"

    const candidates: (string | null)[] = []

    if (isMobile) {
        // 모바일은 tel이 가장 일관됨
        candidates.push(buildScheme(phone, "tel"))
    } else {
        // 데스크탑: 사용자가 지정한 앱 우선
        candidates.push(buildScheme(phone, preferred, opts.customScheme))
        // 폴백: tel
        if (preferred !== "tel") candidates.push(buildScheme(phone, "tel"))
        // 추가 폴백들(환경에 따라 동작): skype, facetime
        if (preferred !== "skype") candidates.push(buildScheme(phone, "skype"))
        if (preferred !== "facetime") candidates.push(buildScheme(phone, "facetime"))
    }

    const url = candidates.find(Boolean) as string | undefined
    if (!url) {
        opts.onFail?.("NO_URL")
        return false
    }

    try {
        // 사용자 제스처 내에서 호출하면 대부분 허용됨
        opts.onStart?.()
        // iOS/안드로이드/데스크탑 모두 location.href가 가장 호환성 좋음
        window.location.href = url
        return true
    } catch (e) {
        opts.onFail?.(e)
        return false
    }
}
