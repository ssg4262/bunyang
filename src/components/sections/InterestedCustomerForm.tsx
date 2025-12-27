// src/components/sections/InterestedCustomerForm.tsx
"use client";

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
    ChevronRight,
    ArrowDown,
} from "lucide-react";

/* ───────────────────────── 설정 ───────────────────────── */
const GAS_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxw7lRX8_N5Hom92xIfnanQkiNNIFhB8cZKX3IfSEPEticif_v2l-8Ki0xG8Eex_6Em/exec";
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
            <div className="pointer-events-auto w-full max-w-[560px] rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5">
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
                        className="ml-2 rounded-xl p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
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
    wrap: cn(
        "w-full max-w-[560px] rounded-3xl overflow-hidden",
    ),

    header: "px-6 pt-6 pb-4 bg-white",
    title: "text-[22px] font-extrabold tracking-tight text-orange-600",
    desc: "mt-1 text-[14px] leading-6 text-zinc-600",
    content: "px-6 pb-6 pt-2 space-y-6",

    label: "text-[13px] font-semibold text-zinc-800",
    field: cn(
        "relative rounded-2xl bg-white",
        "border border-zinc-200/80",
        "transition",
        "focus-within:border-zinc-900/20 focus-within:ring-4 focus-within:ring-zinc-900/5"
    ),
    input: cn(
        "h-12 w-full rounded-2xl border-0 bg-transparent pl-11 pr-4",
        "text-[15px] text-zinc-950 placeholder:text-zinc-400",
        "focus-visible:ring-0 focus-visible:ring-offset-0"
    ),
    icon:
        "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400",

    agreeBox: cn("rounded-2xl bg-white", "border border-zinc-200/80 overflow-hidden"),
    divider: "h-px bg-zinc-200/70",

    // ✅ row: 모바일에서 텍스트가 길면 깨짐 → items-start + min-w-0 + overflow 처리
    row: cn(
        "flex items-start justify-between gap-3 px-4 py-3",
        "transition-colors"
    ),
    rowLeft: "flex items-start gap-3 min-w-0 flex-1",
    rowTitle:
        "text-[14px] font-semibold text-zinc-900 leading-5 whitespace-normal break-words",
    rowSub: "mt-1 text-[12px] leading-5 text-zinc-500 whitespace-normal break-words",

    check: cn(
        "h-5 w-5 rounded-full shrink-0",
        "border-zinc-300",
        "data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600",
        "data-[state=checked]:text-white"
    ),

    requiredPill:
        "inline-flex items-center rounded-full bg-emerald-500/12 px-2 py-0.5 text-[12px] font-extrabold text-emerald-700 shrink-0",

    // ✅ 보기 버튼: shrink-0로 눌림/줄바꿈 깨짐 방지
    viewBtn: cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 shrink-0",
        "text-[13px] font-semibold",
        "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
    ),

    // ✅ 전문 박스: break-words + 보여지는 영역 가로 넘침 방지
    policyBox:
        "mx-4 mb-4 rounded-2xl bg-white px-4 py-3 text-xs leading-6 text-zinc-600 border border-zinc-200/70 break-words whitespace-normal",

    submit: (active: boolean) =>
        cn(
            "h-12 w-full rounded-md font-extrabold text-[15px] tracking-tight",
            "shadow-none",
            active
                ? "bg-emerald-400 text-zinc-950 hover:bg-emerald-300 active:bg-emerald-500"
                : "bg-zinc-200 text-zinc-700",
            "disabled:opacity-60 disabled:cursor-not-allowed"
        ),

    footer: "px-4 pb-6 pt-0",
    footLink: "text-[13px] font-extrabold text-emerald-600 hover:underline",

    msgErr:
        "rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 border border-red-200/80",
    msgOk:
        "rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 border border-emerald-200/80",

    fab: cn(
        "fixed right-5 bottom-5 md:right-6 md:bottom-6 z-[70]",
        "inline-flex items-center gap-2 rounded-full px-4 py-3 shadow-xl",
        "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800",
        "ring-1 ring-black/5",
        "transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0",
        "touch-manipulation select-none"
    ),
    fabIcon: "h-4 w-4",
    fabText: "text-[13px] font-extrabold",
};

export const InterestedCustomerForm: React.FC<InterestedCustomerFormProps> = ({
                                                                                  className,
                                                                                  onSubmit,
                                                                                  title = "관심 고객 등록",
                                                                                  description = "분양 소식과 상담을 가장 빠르게 받아보세요.",
                                                                                  submitLabel = "다음",
                                                                              }) => {
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
            phone: digits,
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

    const scrollToSection = React.useCallback(() => {
        const el =
            (document.getElementById(SECTION_ID) as HTMLElement | null) ??
            (sectionRef.current as HTMLElement | null);
        if (!el) return;

        const scroller = getScrollParent(el);
        const targetTop = calcTargetTop(scroller, el, 14);

        smoothScrollTo(scroller, targetTop, 560);

        window.setTimeout(() => {
            const el2 =
                (document.getElementById(SECTION_ID) as HTMLElement | null) ??
                (sectionRef.current as HTMLElement | null);
            if (!el2) return;

            const scroller2 = getScrollParent(el2);
            const targetTop2 = calcTargetTop(scroller2, el2, 14);
            const cur = getScrollTop(scroller2);

            if (Math.abs(cur - targetTop2) > 2) {
                setScrollTop(scroller2, targetTop2);
            }
        }, 700);
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

                        <CardHeader className={UI.header}>
                            <CardTitle className={UI.title}>{title}</CardTitle>
                            <CardDescription className={UI.desc}>{description}</CardDescription>
                        </CardHeader>

                        <CardContent className={UI.content}>
                            {/* 이름 */}
                            <div className="space-y-2">
                                <Label htmlFor="lead-name" className={UI.label}>
                                    이름 <span className="text-red-500">*</span>
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
                                    전화번호 <span className="text-red-500">*</span>
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
                                                        <span className="ml-2">개인정보 수집·이용 동의</span>
                                                    </p>
                                                </div>
                                            </label>

                                            <AccordionTrigger className="p-0 hover:no-underline">
                        <span className={UI.viewBtn}>
                          보기 <ChevronRight className="h-4 w-4" />
                        </span>
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
                                                        <span className="ml-2">개인정보 처리의 위탁 동의</span>
                                                    </p>
                                                </div>
                                            </label>

                                            <AccordionTrigger className="p-0 hover:no-underline">
                        <span className={UI.viewBtn}>
                          보기 <ChevronRight className="h-4 w-4" />
                        </span>
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

            <button
                type="button"
                onClick={scrollToSection}
                onTouchStart={() => {}}
                className={UI.fab}
                aria-label="관심 고객 등록 영역으로 이동"
            >
                <ArrowDown className={UI.fabIcon} />
                <span className={UI.fabText}>관심고객 등록</span>
            </button>

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
