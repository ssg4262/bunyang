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
    CheckCircle2,
    Check,
    AlertTriangle,
    X,
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
                    "pointer-events-auto w-full max-w-[560px] rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-zinc-900/95",
                    variant === "success"
                        ? "border-emerald-200 dark:border-emerald-900/40"
                        : "border-red-200 dark:border-red-900/40"
                )}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full",
                            variant === "success"
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/15 text-red-600 dark:text-red-400"
                        )}
                    >
                        {variant === "success" ? (
                            <Check className="h-3.5 w-3.5" />
                        ) : (
                            <AlertTriangle className="h-3.5 w-3.5" />
                        )}
                    </div>
                    <div className="flex-1">
                        {title && <p className="text-sm font-medium">{title}</p>}
                        {message && (
                            <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-300">
                                {message}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="ml-2 rounded-md p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
        className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden"
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

    // 02(서울) 처리
    if (digits.startsWith("02")) {
        if (digits.length <= 2) return digits;
        if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
        if (digits.length <= 9)
            return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
        return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    // 그 외(휴대폰/지역번호) 처리: 3-3/4-4
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

export const InterestedCustomerForm: React.FC<InterestedCustomerFormProps> = ({
                                                                                  className,
                                                                                  onSubmit,
                                                                                  title = "관심 고객 등록",
                                                                                  description = "분양 소식과 상담을 가장 빠르게 받아보세요.",
                                                                                  submitLabel = "등록하기",
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

    return (
        <>
            <Card
                className={cn(
                    "w-full max-w-[560px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm",
                    className
                )}
            >
                <form onSubmit={handleSubmit} noValidate>
                    <Honeypot ref={hpRef} />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[20px] font-semibold tracking-tight">
                            {title}
                        </CardTitle>
                        <CardDescription className="text-[13px]">
                            {description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* 이름 */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="lead-name"
                                className="text-[12px] text-zinc-600 dark:text-zinc-400"
                            >
                                이름 *
                            </Label>
                            <div className="relative">
                                <User2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="lead-name"
                                    placeholder="홍길동"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-11 pl-9 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 placeholder:text-zinc-400"
                                />
                            </div>
                        </div>

                        {/* 전화번호 */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="lead-phone"
                                className="text-[12px] text-zinc-600 dark:text-zinc-400"
                            >
                                전화번호 *
                            </Label>
                            <div className="relative">
                                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="lead-phone"
                                    inputMode="tel"
                                    placeholder="010-1234-5678"
                                    value={phone}
                                    onChange={(e) => setPhone(formatKoreanPhone(e.target.value))} // ✅ 자동 하이픈
                                    required
                                    className="h-11 pl-9 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 placeholder:text-zinc-400"
                                />
                            </div>
                        </div>

                        {/* 동의 */}
                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                            <label className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <Checkbox
                      checked={allChecked}
                      onCheckedChange={(v) => setAll(Boolean(v))}
                  />
                  <span className="text-sm font-medium">
                    모든 항목에 동의합니다.
                  </span>
                </span>
                                {allChecked && (
                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> 완료
                  </span>
                                )}
                            </label>

                            <div className="my-3 h-px bg-zinc-200 dark:bg-zinc-800" />

                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-3">
                                    <Checkbox
                                        checked={collectUse}
                                        onCheckedChange={(v) => setCollectUse(Boolean(v))}
                                        required
                                    />
                                    <span className="text-sm">(필수) 개인정보 수집‧이용 동의</span>
                                </label>

                                <label className="flex items-center gap-3">
                                    <Checkbox
                                        checked={outsource}
                                        onCheckedChange={(v) => setOutsource(Boolean(v))}
                                        required
                                    />
                                    <span className="text-sm">
                    (필수) 개인정보 처리의 위탁 동의
                  </span>
                                </label>

                                <Accordion type="single" collapsible className="mt-1">
                                    {/* 법적 고지 업데이트 부분 시작 */}
                                    <AccordionItem value="collect-use" className="border-none">
                                        <AccordionTrigger className="text-sm hover:no-underline">
                                            개인정보 수집‧이용 동의 (전문)
                                        </AccordionTrigger>
                                        <AccordionContent className="text-xs leading-6 text-zinc-600 dark:text-zinc-300">
                                            1. 수집·이용 목적: 분양 정보 안내 및 상담, 방문 예약, 이벤트 및 프로모션 안내
                                            <br />
                                            2. 수집 항목: 성명, 휴대전화번호
                                            <br />
                                            3. 보유·이용 기간:{" "}
                                            <strong>
                                                분양 완료 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간까지)
                                            </strong>
                                            <br />
                                            ※ 귀하는 본 동의를 거부할 권리가 있으나, 거부 시 분양 상담 및 안내 서비스 제공이
                                            제한됩니다.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="outsourcing" className="border-none">
                                        <AccordionTrigger className="text-sm hover:no-underline">
                                            개인정보 처리의 위탁 동의 (전문)
                                        </AccordionTrigger>
                                        <AccordionContent className="text-xs leading-6 text-zinc-600 dark:text-zinc-300">
                                            원활한 서비스 이행을 위해 아래와 같이 개인정보 처리를 위탁합니다.
                                            <br />
                                            1. 위탁받는 자 (수탁자):{" "}
                                            <strong>(주)분양대행사 및 협력 마케팅 대행사</strong>
                                            <br />
                                            2. 위탁하는 업무: 고객 정보 수집 및 관리, 분양 상담, 안내 문자(SMS/LMS) 발송,
                                            해피콜 등
                                            <br />
                                            ※ 위탁 계약 시 개인정보보호 관련 법규의 준수, 제3자 제공 금지 및 책임 부담 등을
                                            명확히 규정하고 있습니다.
                                        </AccordionContent>
                                    </AccordionItem>
                                    {/* 법적 고지 업데이트 부분 끝 */}
                                </Accordion>
                            </div>
                        </div>

                        <div aria-live="polite">
                            {error && (
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            )}
                            {success && (
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                    {success}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="pt-0">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 w-full rounded-xl font-medium"
                        >
                            {isSubmitting ? "등록 중..." : submitLabel}
                        </Button>
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
