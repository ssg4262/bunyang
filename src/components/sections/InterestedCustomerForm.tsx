// src/components/sections/InterestedCustomerForm.tsx
"use client";

import { smartDial } from "@/lib/smartDial";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import {
    User2,
    Phone as PhoneIcon,
    Check,
    AlertTriangle,
    X,
    ArrowRight,
} from "lucide-react";

/* ───────────────────────── 설정 ───────────────────────── */
const GAS_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxw7lRX8_N5Hom92xIfnanQkiNNIFhB8cZKX3IfSEPEticif_v2l-8Ki0xG8Eex_6Em/exec";
const GAS_PROJECT = "edaegu-eplus";
const SECTION_ID = "interested-customer-form";

/* ───────────────────────── BottomAlert (알림창) ───────────────────────── */
type BottomAlertProps = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    variant?: "success" | "error";
    title?: string;
    message?: string;
    durationMs?: number;
};

const BottomAlert: React.FC<BottomAlertProps> = ({
                                                     open,
                                                     onOpenChange,
                                                     variant = "success",
                                                     title,
                                                     message,
                                                     durationMs = 3000,
                                                 }) => {
    React.useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => onOpenChange(false), durationMs);
        return () => clearTimeout(t);
    }, [open, onOpenChange, durationMs]);

    return (
        <div
            aria-live="polite"
            className={cn(
                "pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4 transition-all duration-300",
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
        >
            <div
                className={cn(
                    "w-full max-w-[560px] bg-white px-4 py-3.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/10",
                    // 닫혀 있을 때는 터치를 가로채지 않게 (투명한 채로 아래 버튼을 덮던 문제)
                    open ? "pointer-events-auto" : "pointer-events-none"
                )}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full",
                            variant === "success"
                                ? "bg-emerald-500/12 text-emerald-700"
                                : "bg-red-500/12 text-red-700"
                        )}
                    >
                        {variant === "success" ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <AlertTriangle className="h-4 w-4" />
                        )}
                    </div>

                    <div className="flex-1">
                        {title && (
                            <p className="text-sm font-semibold text-zinc-950">{title}</p>
                        )}
                        {message && (
                            <p className="mt-0.5 text-xs leading-5 text-zinc-600">{message}</p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="ml-2 p-1.5 text-zinc-500 hover:text-zinc-900"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

type LeadData = {
    name: string;
    phone: string;
    consent: { collectUse: boolean; outsource: boolean };
};

type InterestedCustomerFormProps = {
    className?: string;
    onSubmit?: (data: LeadData) => Promise<void> | void;
    title?: string;
    description?: string;
    submitLabel?: string;
};

const KOREA_PHONE_RE = /^0\d{1,2}-?\d{3,4}-?\d{4}$/;

const Honeypot = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
    <div
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
    >
        <label htmlFor="company">회사</label>
        <input
            id="company"
            name="company"
            ref={ref}
            autoComplete="off"
            tabIndex={-1}
            {...props}
        />
    </div>
));
Honeypot.displayName = "Honeypot";

/* ───────────────────────── ✅ 전화번호 자동 하이픈 포맷 ───────────────────────── */
const formatKoreanPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (!digits) return "";

    if (digits.startsWith("02")) {
        if (digits.length <= 2) return digits;
        if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
        if (digits.length <= 9)
            return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
        return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

/* ───────────────────────── GAS 전송 로직 ───────────────────────── */
async function submitToGoogleSheet(payload: {
    name: string;
    phone: string;
    consent: { collectUse: boolean; outsource: boolean };
}) {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("phone", payload.phone);
    // GAS에서 이 값으로 시트 분기 → "동대구역 e편한세상" 시트(3번째)
    formData.append("project", GAS_PROJECT);

    await fetch(GAS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: formData,
    });
}

/* ───────────────────────── 스크롤 유틸 (도중 멈춤 방지) ───────────────────────── */
const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isScrollable = (el: HTMLElement) => {
    const style = window.getComputedStyle(el);
    const oy = style.overflowY;
    return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight;
};

const getScrollParent = (el: HTMLElement | null): HTMLElement | Window => {
    let p = el?.parentElement ?? null;
    while (p) {
        if (isScrollable(p)) return p;
        p = p.parentElement;
    }
    return window;
};

const getScrollTop = (scroller: HTMLElement | Window) =>
    scroller === window
        ? window.scrollY || window.pageYOffset || 0
        : (scroller as HTMLElement).scrollTop;

const setScrollTop = (scroller: HTMLElement | Window, top: number) => {
    if (scroller === window) {
        window.scrollTo({ top, behavior: "auto" });
    } else {
        (scroller as HTMLElement).scrollTop = top;
    }
};

const calcTargetTop = (
    scroller: HTMLElement | Window,
    target: HTMLElement,
    offset = 14
) => {
    if (scroller === window) {
        return target.getBoundingClientRect().top + (window.scrollY || 0) - offset;
    }
    const s = scroller as HTMLElement;
    const sRect = s.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    return s.scrollTop + (tRect.top - sRect.top) - offset;
};

const smoothScrollTo = (
    scroller: HTMLElement | Window,
    top: number,
    duration = 520
) => {
    if (prefersReducedMotion()) {
        setScrollTop(scroller, top);
        return;
    }

    const start = getScrollTop(scroller);
    const delta = top - start;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
        const p = Math.min(1, (now - startTime) / duration);
        const next = start + delta * easeOutCubic(p);

        if (scroller === window) {
            window.scrollTo(0, next);
        } else {
            (scroller as HTMLElement).scrollTop = next;
        }

        if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
};

/* ───────────────────────── UI ─────────────────────────
   ✅ 모바일 깨짐 원인: 긴 텍스트/버튼 영역이 줄바꿈/넘침(Accordion row)
   해결: (1) min-w-0/overflow 처리 강화
        (2) 보기 버튼 shrink-0
        (3) row를 items-start로 + gap/line-height 조정
        (4) policyBox 가로 넘침 방지: break-words + whitespace-normal
──────────────────────────────────────────────────────── */
const UI = {
    wrap: cn("w-full max-w-[560px] gap-0 rounded-none border-0 bg-white py-0 shadow-none overflow-hidden"),

    header: "px-6 md:px-10 pt-8 md:pt-10 pb-0 bg-white",
    title: "text-[22px] font-extrabold tracking-[-0.03em] text-ink",
    desc: "mt-1 text-[14px] leading-6 text-neutral-500",
    content: "px-5 md:px-10 pb-7 pt-7 md:pt-10 space-y-6",

    label: "text-[13px] font-semibold text-ink",
    field: cn(
        "relative bg-white",
        "border border-neutral-300",
        "transition-colors",
        "focus-within:border-ink"
    ),
    input: cn(
        "h-[52px] w-full rounded-none border-0 bg-transparent pl-11 pr-4 shadow-none",
        "text-[15px] text-ink placeholder:text-neutral-400",
        "focus-visible:ring-0 focus-visible:ring-offset-0"
    ),
    icon:
        "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400",

    agreeBox: cn("bg-white", "border border-neutral-300 overflow-hidden"),
    divider: "h-px bg-line",

    // ✅ row: 모바일에서 텍스트가 길면 깨짐 → items-start + min-w-0 + overflow 처리
    row: cn(
        "flex items-center justify-between gap-2 px-3.5 sm:px-4 py-3.5",
        "transition-colors"
    ),
    rowLeft: "flex items-start gap-3 min-w-0 flex-1 cursor-pointer",
    rowTitle:
        "flex items-center gap-1.5 text-[13px] sm:text-[14px] font-semibold text-ink leading-5 break-keep",
    rowSub: "mt-1 text-[12px] leading-5 text-neutral-500 whitespace-normal break-words",

    check: cn(
        "h-5 w-5 rounded-none shrink-0",
        "border-neutral-400",
        "data-[state=checked]:border-ink data-[state=checked]:bg-ink",
        "data-[state=checked]:text-white"
    ),

    requiredPill: "text-[12px] font-bold text-brand shrink-0",

    // ✅ 보기 버튼: shrink-0로 눌림/줄바꿈 깨짐 방지
    viewBtn: cn(
        "inline-flex items-center px-1 py-1 shrink-0 whitespace-nowrap",
        "text-[13px] font-medium underline underline-offset-4",
        "text-neutral-500 hover:text-ink"
    ),

    // ✅ 전문 박스: break-words + 보여지는 영역 가로 넘침 방지
    policyBox:
        "mx-4 mb-4 bg-surface px-4 py-3 text-xs leading-6 text-neutral-600 break-words whitespace-normal",

    submit: (active: boolean) =>
        cn(
            "h-14 w-full rounded-none font-semibold text-[15px] tracking-[0.04em]",
            "shadow-none",
            active
                ? "bg-brand text-white hover:bg-brand-dark active:bg-brand-dark"
                : "bg-neutral-200 text-neutral-500",
            "disabled:opacity-60 disabled:cursor-not-allowed"
        ),

    footer: "px-5 md:px-10 pb-7 md:pb-10 pt-0",
    footLink: "text-[13px] font-bold text-brand hover:underline",

    msgErr:
        "bg-red-50 px-4 py-3 text-sm font-medium text-red-700 border border-red-200/80",
    msgOk:
        "bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 border border-emerald-200/80",
};

const CALL_HREF = "tel:01045398505";

export const InterestedCustomerForm: React.FC<InterestedCustomerFormProps> = ({
                                                                                  className,
                                                                                  onSubmit,
                                                                                  title = "관심 고객 등록",
                                                                                  description = "분양 소식과 상담을 가장 빠르게 받아보세요.",
                                                                                  submitLabel = "다음",
                                                                              }) => {
    // 폼이나 그 아래(푸터)가 화면에 보이면 떠 있는 '관심고객 등록' 버튼을 숨김
    const [formInView, setFormInView] = React.useState(false);
    React.useEffect(() => {
        const el = document.getElementById(SECTION_ID);
        if (!el || typeof IntersectionObserver === "undefined") return;
        const io = new IntersectionObserver(
            ([entry]) => setFormInView(entry.isIntersecting || entry.boundingClientRect.top < 0),
            { threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // 첫 화면(히어로)에는 자체 버튼이 있으므로, 조금 내려온 뒤부터 보임
    const [pastHero, setPastHero] = React.useState(false);
    React.useEffect(() => {
        const onScroll = () => setPastHero(window.scrollY > 480);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    const fabVisible = pastHero && !formInView;

    const [name, setName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [collectUse, setCollectUse] = React.useState(false);
    const [outsource, setOutsource] = React.useState(false);
    const allChecked = collectUse && outsource;

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const hpRef = React.useRef<HTMLInputElement>(null);

    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertVariant, setAlertVariant] = React.useState<"success" | "error">(
        "success"
    );
    const [alertTitle, setAlertTitle] = React.useState("");
    const [alertMsg, setAlertMsg] = React.useState("");

    const sectionRef = React.useRef<HTMLDivElement>(null);

    const openAlert = (
        variant: "success" | "error",
        title: string,
        msg: string
    ) => {
        setAlertVariant(variant);
        setAlertTitle(title);
        setAlertMsg(msg);
        setAlertOpen(true);
    };

    const setAll = (v: boolean) => {
        setCollectUse(v);
        setOutsource(v);
    };

    const validate = () => {
        if ((hpRef.current?.value || "").trim() !== "") return "스팸 탐지됨";
        const trimmedName = name.trim();
        if (trimmedName.length < 2) return "이름을 2자 이상 입력해 주세요.";
        if (!KOREA_PHONE_RE.test(phone.trim()))
            return "전화번호 형식이 올바르지 않습니다. 예) 010-1234-5678";
        if (!collectUse || !outsource) return "필수 동의 항목에 모두 동의해 주세요.";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);

        const msg = validate();
        if (msg) {
            setError(msg);
            openAlert("error", "입력 오류", msg);
            return;
        }

        const digits = phone.replace(/[^0-9]/g, "");
        const payload: LeadData = {
            name: name.trim(),
            // 하이픈 포함으로 전송 → 시트에서 숫자로 바뀌어 앞자리 0이 사라지는 문제 방지
            phone: formatKoreanPhone(digits),
            consent: { collectUse, outsource },
        };

        try {
            setIsSubmitting(true);

            await submitToGoogleSheet(payload);

            if (onSubmit) {
                try {
                    await onSubmit(payload);
                } catch (e) {
                    console.error("post-hook failed:", e);
                }
            }

            const successMsg = "등록이 완료되었습니다. 담당자가 곧 연락드릴게요.";
            setSuccess(successMsg);
            openAlert("success", "등록 완료", successMsg);

            setName("");
            setPhone("");
            setAll(false);
            if (hpRef.current) hpRef.current.value = "";
        } catch {
            const errMsg = "등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
            setError(errMsg);
            openAlert("error", "등록 실패", errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const ctaActive =
        allChecked && name.trim().length >= 2 && KOREA_PHONE_RE.test(phone.trim());

    // 전화상담: 사이트의 다른 전화 버튼과 같은 방식으로 걸기
    // (휴대폰은 전화 앱, PC는 FaceTime → 안 되면 번호 안내)
    const onCallClick = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        smartDial("010-4539-8505", {
            desktopApp: "facetime",
            onFail: () => alert("앱을 찾을 수 없습니다. tel로 직접 걸어주세요: 010-4539-8505"),
        });
    }, []);

    const scrollToSection = React.useCallback(() => {
        const find = () =>
            (document.getElementById(SECTION_ID) as HTMLElement | null) ??
            (sectionRef.current as HTMLElement | null);
        const el = find();
        if (!el) return;

        // 위에 고정된 헤더에 폼이 가리지 않도록 헤더 높이만큼 여유를 둠
        const headerH =
            (document.querySelector("header.fixed") as HTMLElement | null)?.getBoundingClientRect().height ?? 64;
        const offset = Math.round(headerH) + 12;

        const scroller = getScrollParent(el);
        smoothScrollTo(scroller, calcTargetTop(scroller, el, offset), 560);

        // 내려가는 동안 아직 안 불러온 이미지들이 펼쳐지면 폼 위치가 계속 밀림
        // → 몇 초 동안 위치를 다시 맞춤 (사용자가 직접 스크롤/터치하면 즉시 중단)
        let tries = 0;
        let cancelled = false;
        const cleanup = () => {
            window.removeEventListener("wheel", cancel);
            window.removeEventListener("touchstart", cancel);
            window.removeEventListener("keydown", cancel);
        };
        const cancel = () => {
            cancelled = true;
            cleanup();
        };
        window.addEventListener("wheel", cancel, { passive: true });
        window.addEventListener("touchstart", cancel, { passive: true });
        window.addEventListener("keydown", cancel);

        const fix = () => {
            if (cancelled) return;
            const el2 = find();
            if (!el2) return cleanup();
            const sc = getScrollParent(el2);
            const target = calcTargetTop(sc, el2, offset);
            if (Math.abs(getScrollTop(sc) - target) > 2) setScrollTop(sc, target);
            if (++tries < 12) window.setTimeout(fix, 350);
            else cleanup();
        };
        window.setTimeout(fix, 700);
    }, []);

    return (
        <>
            <div
                id={SECTION_ID}
                ref={sectionRef}
                className={cn("scroll-mt-6", className)}
            >
                <Card className={UI.wrap}>
                    <form onSubmit={handleSubmit} noValidate>
                        <Honeypot ref={hpRef} />

                        {(title || description) && (
                            <CardHeader className={UI.header}>
                                {title && <CardTitle className={UI.title}>{title}</CardTitle>}
                                {description && <CardDescription className={UI.desc}>{description}</CardDescription>}
                            </CardHeader>
                        )}

                        <CardContent className={UI.content}>
                            {/* 이름 */}
                            <div className="space-y-2">
                                <Label htmlFor="lead-name" className={UI.label}>
                                    이름 <span className="text-brand">*</span>
                                </Label>
                                <div className={UI.field}>
                                    <User2 className={UI.icon} />
                                    <Input
                                        id="lead-name"
                                        placeholder="홍길동"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className={UI.input}
                                    />
                                </div>
                            </div>

                            {/* 전화번호 */}
                            <div className="space-y-2">
                                <Label htmlFor="lead-phone" className={UI.label}>
                                    전화번호 <span className="text-brand">*</span>
                                </Label>
                                <div className={UI.field}>
                                    <PhoneIcon className={UI.icon} />
                                    <Input
                                        id="lead-phone"
                                        inputMode="tel"
                                        placeholder="010-1234-5678"
                                        value={phone}
                                        onChange={(e) => setPhone(formatKoreanPhone(e.target.value))}
                                        required
                                        className={UI.input}
                                    />
                                </div>
                            </div>

                            {/* 약관 동의 */}
                            <div className={UI.agreeBox}>
                                <div className="px-4 pt-4 pb-3">
                                    <label className="flex items-start gap-3">
                                        <Checkbox
                                            checked={allChecked}
                                            onCheckedChange={(v) => setAll(Boolean(v))}
                                            className={UI.check}
                                        />
                                        <div className="min-w-0">
                                            <p className="text-[15px] font-extrabold text-zinc-900">
                                                전체 동의하기
                                            </p>
                                            <p className={UI.rowSub}>
                                                분양 안내를 위한 개인정보 수집·이용 및 처리 위탁 동의를 포함합니다.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <div className={UI.divider} />

                                <Accordion type="single" collapsible className="px-0">
                                    <AccordionItem value="collect-use" className="border-0">
                                        <div className={UI.row}>
                                            <label className={UI.rowLeft}>
                                                <Checkbox
                                                    checked={collectUse}
                                                    onCheckedChange={(v) => setCollectUse(Boolean(v))}
                                                    required
                                                    className={UI.check}
                                                />
                                                <div className="min-w-0">
                                                    <p className={UI.rowTitle}>
                                                        <span className={UI.requiredPill}>필수</span>
                                                        <span>개인정보 수집·이용 동의</span>
                                                    </p>
                                                </div>
                                            </label>

                                            <AccordionTrigger className="p-0 hover:no-underline [&>svg]:hidden sm:[&>svg]:block">
                        <span className={UI.viewBtn}>보기</span>
                                            </AccordionTrigger>
                                        </div>

                                        <AccordionContent className="pt-1">
                                            <div className={UI.policyBox}>
                                                1. 수집·이용 목적: 분양 정보 안내 및 상담, 방문 예약, 이벤트 및 프로모션 안내
                                                <br />
                                                2. 수집 항목: 성명, 휴대전화번호
                                                <br />
                                                3. 보유·이용 기간:{" "}
                                                <strong className="text-zinc-900">
                                                    분양 완료 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간까지)
                                                </strong>
                                                <br />
                                                ※ 귀하는 본 동의를 거부할 권리가 있으나, 거부 시 분양 상담 및 안내 서비스 제공이 제한됩니다.
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <div className={UI.divider} />

                                    <AccordionItem value="outsourcing" className="border-0">
                                        <div className={UI.row}>
                                            <label className={UI.rowLeft}>
                                                <Checkbox
                                                    checked={outsource}
                                                    onCheckedChange={(v) => setOutsource(Boolean(v))}
                                                    required
                                                    className={UI.check}
                                                />
                                                <div className="min-w-0">
                                                    <p className={UI.rowTitle}>
                                                        <span className={UI.requiredPill}>필수</span>
                                                        <span>개인정보 처리의 위탁 동의</span>
                                                    </p>
                                                </div>
                                            </label>

                                            <AccordionTrigger className="p-0 hover:no-underline [&>svg]:hidden sm:[&>svg]:block">
                        <span className={UI.viewBtn}>보기</span>
                                            </AccordionTrigger>
                                        </div>

                                        <AccordionContent className="pt-1">
                                            <div className={UI.policyBox}>
                                                원활한 서비스 이행을 위해 아래와 같이 개인정보 처리를 위탁합니다.
                                                <br />
                                                1. 위탁받는 자 (수탁자):{" "}
                                                <strong className="text-zinc-900">
                                                    (주)분양대행사 및 협력 마케팅 대행사
                                                </strong>
                                                <br />
                                                2. 위탁하는 업무: 고객 정보 수집 및 관리, 분양 상담, 안내 문자(SMS/LMS) 발송, 해피콜 등
                                                <br />
                                                ※ 위탁 계약 시 개인정보보호 관련 법규의 준수, 제3자 제공 금지 및 책임 부담 등을 명확히 규정하고 있습니다.
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                            <div aria-live="polite" className="space-y-2">
                                {error && <div className={UI.msgErr}>{error}</div>}
                                {success && <div className={UI.msgOk}>{success}</div>}
                            </div>
                        </CardContent>

                        <CardFooter className={UI.footer}>
                            <div className="w-full space-y-3">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={UI.submit(ctaActive)}
                                >
                                    {isSubmitting ? "등록 중..." : submitLabel}
                                </Button>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>

            {/* 모바일: 하단 고정 바 */}
            <div
                className={cn(
                    "fixed inset-x-0 bottom-0 z-40 flex md:hidden transition-all duration-300",
                    "pb-[env(safe-area-inset-bottom)] bg-ink",
                    fabVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
                )}
                aria-hidden={!fabVisible}
            >
                <a
                    href={CALL_HREF}
                    onClick={onCallClick}
                    onTouchStart={() => {}}
                    tabIndex={fabVisible ? 0 : -1}
                    className="flex h-14 flex-1 touch-manipulation items-center justify-center gap-2 bg-ink text-[14px] font-semibold tracking-[0.02em] text-white active:bg-black"
                >
                    <PhoneIcon className="h-4 w-4" strokeWidth={2} />
                    전화상담
                </a>
                <button
                    type="button"
                    onClick={scrollToSection}
                    onTouchStart={() => {}}
                    tabIndex={fabVisible ? 0 : -1}
                    aria-label="관심 고객 등록 영역으로 이동"
                    className="flex h-14 flex-1 touch-manipulation items-center justify-center gap-2 bg-brand text-[14px] font-semibold tracking-[0.02em] text-white active:bg-brand-dark"
                >
                    관심고객 등록
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
            </div>

            {/* 데스크톱: 우하단 세로 버튼 */}
            <div
                className={cn(
                    "fixed right-6 bottom-6 z-40 hidden md:flex flex-col gap-2 transition-all duration-300",
                    fabVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                )}
                aria-hidden={!fabVisible}
            >
                <a
                    href={CALL_HREF}
                    onClick={onCallClick}
                    tabIndex={fabVisible ? 0 : -1}
                    className="flex h-12 cursor-pointer items-center gap-2 bg-ink px-6 text-[13px] font-semibold tracking-[0.04em] text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)] transition-colors hover:bg-black"
                >
                    <PhoneIcon className="h-3.5 w-3.5" strokeWidth={2} />
                    전화상담
                </a>
                <button
                    type="button"
                    onClick={scrollToSection}
                    tabIndex={fabVisible ? 0 : -1}
                    aria-label="관심 고객 등록 영역으로 이동"
                    className="flex h-12 cursor-pointer items-center justify-between gap-2 bg-brand px-6 text-[13px] font-semibold tracking-[0.04em] text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)] transition-colors hover:bg-brand-dark"
                >
                    관심고객 등록
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
            </div>

            <BottomAlert
                open={alertOpen}
                onOpenChange={setAlertOpen}
                variant={alertVariant}
                title={alertTitle}
                message={alertMsg}
                durationMs={3000}
            />
        </>
    );
};
