"use client";

import PageLayout from "@/components/page-layout";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import useAttendance from "@/hooks/useAttendance";
import { useSelector } from "react-redux";
import { translate } from "@/lib/utils";

// load QR scanner only on client
const QrScanner = dynamic(() => import("react-qr-scanner"), { ssr: false });

export default function QRAttendance() {
    const translation_state = useSelector((state) => state.auth.translation);
    const { qrCheckIn, branch } = useAttendance();
    const { user } = useSelector((state) => state.auth);
    const userPermissions = user?.permissions || [];
    const canManualAttendance = userPermissions.some(
        (perm) => perm.name === "attendance-manual-manage"
    );

    // --- State ---
    const [isBackCamera, setIsBackCamera] = useState(true);
    const [videoConstraints, setVideoConstraints] = useState({
        facingMode: { exact: "environment" },
    });
    const [step, setStep] = useState("closed"); // closed | scanner | processing | result
    const [scannedText, setScannedText] = useState(null);
    const [attendanceResult, setAttendanceResult] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [mountScanner, setMountScanner] = useState(false);
    const [locationGranted, setLocationGranted] = useState(false);
    const [isRequestingLocation, setIsRequestingLocation] = useState(false);
    const [coords, setCoords] = useState(null);
    const [isProcessingAttendance, setIsProcessingAttendance] = useState(false);

    const legacyRef = useRef(null);

    // --- Location Permission ---
    const allowLocation = () => {
        setErrorMsg("");
        setIsRequestingLocation(true);

        if (!navigator.geolocation) {
            setIsRequestingLocation(false);
            setLocationGranted(false);
            setErrorMsg("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
                setLocationGranted(true);
                setIsRequestingLocation(false);
            },
            (error) => {
                setLocationGranted(false);
                setIsRequestingLocation(false);
                setErrorMsg(
                    typeof error?.message === "string"
                        ? error.message
                        : "Location access denied. Enable in browser settings."
                );
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        allowLocation();
    }, []);

    // --- Camera Open ---
    const openScanner = async () => {
        setErrorMsg("");
        setIsRequesting(true);
        try {
            let stream = null;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { exact: "environment" } },
                    audio: false,
                });
                setVideoConstraints({ facingMode: { exact: "environment" } });
                setIsBackCamera(true);
            } catch {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: { exact: "user" } },
                        audio: false,
                    });
                    setVideoConstraints({ facingMode: { exact: "user" } });
                    setIsBackCamera(false);
                } catch {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false,
                    });
                    setVideoConstraints({ video: true });
                }
            }

            if (stream) stream.getTracks().forEach((t) => t.stop());

            setHasPermission(true);
            setStep("scanner");
            setMountScanner(false);
            setTimeout(() => setMountScanner(true), 0);
        } catch (e) {
            setHasPermission(false);
            setStep("closed");
            setErrorMsg(
                typeof e?.message === "string"
                    ? e.message
                    : "Camera access denied or unavailable. Allow access in your browser settings."
            );
        } finally {
            setIsRequesting(false);
        }
    };

    // --- Camera Toggle ---
    const toggleCamera = () => {
        const next = !isBackCamera;
        setIsBackCamera(next);
        setVideoConstraints({
            facingMode: { exact: next ? "environment" : "user" },
        });

        // Remount scanner to apply new constraints
        setMountScanner(false);
        setTimeout(() => setMountScanner(true), 0);
    };

    // --- Scan Result ---
    const handleScanResult = useCallback(
        async (result, error) => {
            if (!!result) {
                const text = result?.getText?.() ?? result?.text ?? String(result);
                if (text) {
                    setScannedText(text);
                    setStep("processing");
                    setMountScanner(false);
                    toast.success("QR scanned! Processing attendance...");
                    try {
                        navigator.vibrate?.(60);
                    } catch {}
                    await processAttendance(text);
                }
            }
        },
        [coords]
    );

    const processAttendance = async (qrData) => {
        if (!coords) {
            setErrorMsg(
                "Location is required for attendance. Please allow location access."
            );
            setStep("result");
            return;
        }

        setIsProcessingAttendance(true);

        try {
            const result = await qrCheckIn(qrData, coords.lat, coords.lng, branch);

            if (result.success) {
                setAttendanceResult({ success: true, message: result.message, data: result.data });
                toast.success(result.message);
            } else {
                setAttendanceResult({ success: false, message: result.error });
                toast.error(result.error);
            }
        } catch (error) {
            const errorMessage = error?.message || "Failed to process attendance. Please try again.";
            setAttendanceResult({ success: false, message: errorMessage });
            toast.error(errorMessage);
        } finally {
            setIsProcessingAttendance(false);
            setStep("result");
        }
    };

    const rescan = () => {
        setScannedText(null);
        setAttendanceResult(null);
        setErrorMsg("");
        setStep("scanner");
        setMountScanner(false);
        setTimeout(() => setMountScanner(true), 0);
    };

    const retryAttendance = async () => {
        if (!scannedText) return;
        setStep("processing");
        await processAttendance(scannedText);
    };

    const closeResult = () => {
        setScannedText(null);
        setAttendanceResult(null);
        setErrorMsg("");
        setStep("closed");
    };

    const copyText = async () => {
        if (!scannedText) return;
        try {
            await navigator.clipboard.writeText(scannedText);
            toast.success("Copied");
        } catch {
            toast.error("Copy failed");
        }
    };

    // --- Buttons ---
    const buttonConfig = {
        closed: {
            label: isRequesting
                ? translate("Opening", translation_state) + "…"
                : "📷" + translate("Start Scanning", translation_state),
            action: openScanner,
            disabled: isRequesting || !locationGranted,
        },
        scanner: {
            label: "❌ Close Scanner",
            action: () => setStep("closed"),
            disabled: false,
            title: hasPermission === true ? "" : "Allow camera access first",
        },
        processing: {
            label: "⏳ Processing Attendance...",
            action: () => {},
            disabled: true,
        },
        result: {
            label: attendanceResult?.success ? "✅ Done" : "🔄 Retry",
            action: attendanceResult?.success ? closeResult : retryAttendance,
            disabled: isProcessingAttendance,
        },
    };

    const { label, action, disabled, title } = buttonConfig[step];

    return (
        <PageLayout>
            {/* Scanner */}
            <div className="mt-5 flex justify-center">
                <div className="relative w-72 h-72 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 shadow-sm overflow-hidden">
                    {step === "scanner" && hasPermission && mountScanner ? (
                        <QrScanner
                            onScan={(data) => { if (data) handleScanResult(data); }}
                            onError={(err) => console.error(err)}
                            constraints={videoConstraints}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <div className="w-full h-full grid place-items-center text-center p-4 text-slate-500 text-sm">
                            {isRequesting
                                ? translate("Requesting camera permission", translation_state) + "…"
                                : hasPermission === false
                                ? translate("Camera blocked. Allow access in browser settings.", translation_state)
                                : translate("Scanner idle. Click Start Scanning.", translation_state)}
                        </div>
                    )}
                    {/* Corner markers */}
                    <div className="pointer-events-none absolute inset-4">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-slate-300 rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-slate-300 rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-slate-300 rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-slate-300 rounded-br-xl" />
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 space-y-3">
                {!locationGranted && (
                    <button
                        onClick={allowLocation}
                        disabled={isRequestingLocation}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-900 text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-800 disabled:opacity-60"
                    >
                        {isRequestingLocation
                            ? translate("Requesting location", translation_state) + "…"
                            : translate("Allow Location", translation_state)}
                    </button>
                )}

                <button
                    onClick={action}
                    disabled={disabled}
                    title={title}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium shadow-sm active:scale-[.99] disabled:opacity-60 disabled:cursor-not-allowed bg-slate-900 text-white hover:bg-slate-800`}
                >
                    {label}
                </button>

                {step === "result" && (
                    <button
                        onClick={rescan}
                        disabled={isProcessingAttendance}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-700 px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:opacity-60"
                    >
                        📷 {translate("Scan Another QR", translation_state)}
                    </button>
                )}

                {canManualAttendance && (
                    <button
                        onClick={async () => {
                            setStep("processing");
                            setScannedText("manual");
                            await processAttendance(user?.employee_code || user?.id);
                        }}
                        disabled={isProcessingAttendance}
                        className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-[#846CF9] text-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-blue-700 disabled:opacity-60"
                    >
                        🧍 {translate("Manual Attendance", translation_state)}
                    </button>
                )}

                {/* Camera toggle */}
                <button
                    onClick={toggleCamera}
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-700 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-800"
                >
                    🔄 Switch Camera ({isBackCamera ? "Back" : "Front"})
                </button>
            </div>
        </PageLayout>
    );
}
