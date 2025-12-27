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
} from "lucide-react";

/* ───────────────────────── 설정 ───────────────────────── */
const GAS_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxw7lRX8_N5Hom92xIfnanQkiNNIFhB8cZKX3IfSEPEticif_v2l-8Ki0xG8Eex_6Em/exec";

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
                    "pointer-events-auto w-full max-w-[560px] rounded-2xl border px-4 py-3 shadow-lg",
                    "bg-white border-zinc-200"
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

/* ───────────────────────── UI (라이트 전용, 약관 느낌) ───────────────────────── */
const UI = {
    wrap: cn(
        "w-full max-w-[560px] rounded-3xl overflow-hidden",
        "border border-zinc-200 bg-white shadow-sm"
    ),
    header: "px-6 pt-6 pb-4",
    // ✅ 타이틀: 더 크고, 더 굵게, 녹색계열로 시인성 강화
    title: "text-[20px] font-extrabold tracking-tight text-emerald-600",
    desc: "mt-1 text-[13px] leading-5 text-zinc-600",
    content: "px-6 pb-6 space-y-6",

    fieldLabel: "text-[12px] font-medium text-zinc-700",
    field: cn(
        "relative rounded-2xl border border-zinc-200 bg-white",
        "transition focus-within:border-zinc-900/25 focus-within:ring-2 focus-within:ring-zinc-900/10"
    ),
    fieldInput: cn(
        "h-12 w-full rounded-2xl border-0 bg-transparent pl-11 pr-4",
        "text-[14px] text-zinc-950 placeholder:text-zinc-400",
        "focus-visible:ring-0 focus-visible:ring-offset-0"
    ),
    fieldIcon:
        "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400",

    agreeBox: cn("rounded-2xl border border-zinc-200 bg-zinc-50"),
    row: cn("flex items-center justify-between gap-3 px-4 py-3"),
    rowLeft: "flex items-center gap-3 min-w-0",
    rowTitle: "text-[14px] font-medium text-zinc-900 truncate",
    rowSub: "mt-1 text-[12px] leading-5 text-zinc-500",
    divider: "h-px bg-zinc-200/70",

    // 원형 체크 느낌
    check: cn(
        "h-5 w-5 rounded-full",
        "border-zinc-300 data-[state=checked]:border-zinc-900",
        "data-[state=checked]:bg-zinc-900"
    ),
    requiredTag: "text-[12px] font-semibold text-emerald-600",
    viewBtn: cn(
        "inline-flex items-center gap-1 text-[13px] font-medium",
        "text-zinc-500 hover:text-zinc-900"
    ),

    // 큰 바 버튼
    submit: (active: boolean) =>
        cn(
            "h-12 w-full rounded-2xl font-semibold transition",
            active
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "bg-zinc-200 text-zinc-700 hover:bg-zinc-200/90",
            "disabled:opacity-60 disabled:cursor-not-allowed"
        ),

    footLink: "text-[13px] font-semibold text-emerald-600 hover:underline",
    msgErr: "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
    msgOk:
        "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700",
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

    const openAlert = (variant: "success" | "error", title: string, msg: string) => {
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

    // 스타일만: 버튼 “활성” 느낌(실제 제출 가능 여부는 validate 그대로)
    const ctaActive =
        allChecked &&
        name.trim().length >= 2 &&
        KOREA_PHONE_RE.test(phone.trim());

    return (
        <>
            <Card className={cn(UI.wrap, className)}>
                <form onSubmit={handleSubmit} noValidate>
                    <Honeypot ref={hpRef} />

                    <CardHeader className={UI.header}>
                        <CardTitle className={UI.title}>{title}</CardTitle>
                        <CardDescription className={UI.desc}>{description}</CardDescription>
                    </CardHeader>

                    <CardContent className={UI.content}>
                        {/* 이름 */}
                        <div className="space-y-2">
                            <Label htmlFor="lead-name" className={UI.fieldLabel}>
                                이름 <span className="text-red-500">*</span>
                            </Label>
                            <div className={UI.field}>
                                <User2 className={UI.fieldIcon} />
                                <Input
                                    id="lead-name"
                                    placeholder="홍길동"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className={UI.fieldInput}
                                />
                            </div>
                        </div>

                        {/* 전화번호 */}
                        <div className="space-y-2">
                            <Label htmlFor="lead-phone" className={UI.fieldLabel}>
                                전화번호 <span className="text-red-500">*</span>
                            </Label>
                            <div className={UI.field}>
                                <PhoneIcon className={UI.fieldIcon} />
                                <Input
                                    id="lead-phone"
                                    inputMode="tel"
                                    placeholder="010-1234-5678"
                                    value={phone}
                                    onChange={(e) => setPhone(formatKoreanPhone(e.target.value))}
                                    required
                                    className={UI.fieldInput}
                                />
                            </div>
                        </div>

                        {/* 약관 동의 */}
                        <div className={UI.agreeBox}>
                            {/* 전체 동의 */}
                            <div className="px-4 pt-4">
                                <label className="flex items-start gap-3">
                                    <Checkbox
                                        checked={allChecked}
                                        onCheckedChange={(v) => setAll(Boolean(v))}
                                        className={UI.check}
                                    />
                                    <div className="min-w-0">
                                        <p className="text-[14px] font-semibold text-zinc-900">
                                            전체 동의하기
                                        </p>
                                        <p className={UI.rowSub}>
                                            분양 안내를 위한 개인정보 수집·이용 및 처리 위탁 동의를 포함합니다.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div className={cn(UI.divider, "mt-4")} />

                            <Accordion type="single" collapsible className="px-0">
                                {/* (필수) 개인정보 수집·이용 */}
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
                                                    <span className={UI.requiredTag}>필수</span>
                                                    <span className="ml-1">개인정보 수집·이용 동의</span>
                                                </p>
                                            </div>
                                        </label>

                                        <AccordionTrigger
                                            className={cn(
                                                "p-0 hover:no-underline",
                                                "data-[state=open]:underline"
                                            )}
                                        >
                      <span className={UI.viewBtn}>
                        보기 <ChevronRight className="h-4 w-4" />
                      </span>
                                        </AccordionTrigger>
                                    </div>

                                    <AccordionContent className="px-4 pb-4 pt-1 text-xs leading-6 text-zinc-600">
                                        1. 수집·이용 목적: 분양 정보 안내 및 상담, 방문 예약, 이벤트 및 프로모션 안내
                                        <br />
                                        2. 수집 항목: 성명, 휴대전화번호
                                        <br />
                                        3. 보유·이용 기간:{" "}
                                        <strong className="text-zinc-900">
                                            분양 완료 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간까지)
                                        </strong>
                                        <br />
                                        ※ 귀하는 본 동의를 거부할 권리가 있으나, 거부 시 분양 상담 및 안내 서비스 제공이
                                        제한됩니다.
                                    </AccordionContent>
                                </AccordionItem>

                                <div className={UI.divider} />

                                {/* (필수) 개인정보 처리 위탁 */}
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
                                                    <span className={UI.requiredTag}>필수</span>
                                                    <span className="ml-1">개인정보 처리의 위탁 동의</span>
                                                </p>
                                            </div>
                                        </label>

                                        <AccordionTrigger
                                            className={cn(
                                                "p-0 hover:no-underline",
                                                "data-[state=open]:underline"
                                            )}
                                        >
                      <span className={UI.viewBtn}>
                        보기 <ChevronRight className="h-4 w-4" />
                      </span>
                                        </AccordionTrigger>
                                    </div>

                                    <AccordionContent className="px-4 pb-4 pt-1 text-xs leading-6 text-zinc-600">
                                        원활한 서비스 이행을 위해 아래와 같이 개인정보 처리를 위탁합니다.
                                        <br />
                                        1. 위탁받는 자 (수탁자):{" "}
                                        <strong className="text-zinc-900">
                                            (주)분양대행사 및 협력 마케팅 대행사
                                        </strong>
                                        <br />
                                        2. 위탁하는 업무: 고객 정보 수집 및 관리, 분양 상담, 안내 문자(SMS/LMS) 발송,
                                        해피콜 등
                                        <br />
                                        ※ 위탁 계약 시 개인정보보호 관련 법규의 준수, 제3자 제공 금지 및 책임 부담 등을
                                        명확히 규정하고 있습니다.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* 인라인 메시지 */}
                        <div aria-live="polite" className="space-y-2">
                            {error && <div className={UI.msgErr}>{error}</div>}
                            {success && <div className={UI.msgOk}>{success}</div>}
                        </div>
                    </CardContent>

                    <CardFooter className="px-6 pb-6 pt-0">
                        <div className="w-full space-y-3">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={UI.submit(ctaActive)}
                            >
                                {isSubmitting ? "등록 중..." : submitLabel}
                            </Button>

                            <div className="flex items-center justify-between">
                                <a href="#" className={UI.footLink}>
                                    단체, 비즈니스 문의
                                </a>
                                <span className="text-[12px] text-zinc-400">©</span>
                            </div>
                        </div>
                    </CardFooter>
                </form>
            </Card>

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
