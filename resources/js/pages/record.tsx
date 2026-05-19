import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/new-app-layout';

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

type SessionLog = {
    time_mark: string;
    action_text: string;
    timestamp: number;
};

export default function Record({
    patient,
    leader_name,
    team_members,
}: {
    patient: { id: number; name: string; rm_number: string };
    leader_name: string;
    team_members: string;
}) {
    const [isRecording, setIsRecording] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [timer, setTimer] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const [logs, setLogs] = useState<SessionLog[]>([]);

    const recognitionRef = useRef<any>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isRecordingRef = useRef(false);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'id-ID';

            recognitionRef.current.onresult = (event: any) => {
                let interimAcc = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        const text = event.results[i][0].transcript.trim();
                        if (text) {
                            const now = new Date();
                            const timeMark = now.toLocaleTimeString('id-ID', {
                                hour12: false,
                            });
                            const currentTimestamp = now.getTime();

                            setLogs((prev) => {
                                if (prev.length > 0) {
                                    const lastLog = prev[prev.length - 1];
                                    const timeDiff =
                                        currentTimestamp - lastLog.timestamp;

                                    const currentTextLower = text.toLowerCase();
                                    const lastTextLower =
                                        lastLog.action_text.toLowerCase();

                                    if (
                                        timeDiff < 5000 &&
                                        currentTextLower.startsWith(
                                            lastTextLower,
                                        )
                                    ) {
                                        const newLogs = [...prev];
                                        newLogs[newLogs.length - 1] = {
                                            time_mark: lastLog.time_mark,
                                            action_text: text,
                                            timestamp: lastLog.timestamp,
                                        };
                                        return newLogs;
                                    }
                                }

                                return [
                                    ...prev,
                                    {
                                        time_mark: timeMark,
                                        action_text: text,
                                        timestamp: currentTimestamp,
                                    },
                                ];
                            });
                        }
                    } else {
                        interimAcc += event.results[i][0].transcript;
                    }
                }
                setInterimTranscript(interimAcc);
            };

            recognitionRef.current.onend = () => {
                if (isRecordingRef.current) recognitionRef.current.start();
            };
        }
        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (timerIntervalRef.current)
                clearInterval(timerIntervalRef.current);
        };
    }, []);

    // Auto-scroll ke bawah saat log baru masuk
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs, interimTranscript]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const toggleRecording = () => {
        if (!isRecording) {
            setLogs([]);
            setInterimTranscript('');
            setTimer(0);
            setIsRecording(true);
            isRecordingRef.current = true;
            recognitionRef.current?.start();
            timerIntervalRef.current = setInterval(
                () => setTimer((prev) => prev + 1),
                1000,
            );
        } else {
            setIsRecording(false);
            isRecordingRef.current = false;
            recognitionRef.current?.stop();
            if (timerIntervalRef.current)
                clearInterval(timerIntervalRef.current);
        }
    };

    const saveDraft = () => {
        setIsProcessing(true);
        const finalContent = logs.map((l) => l.action_text).join('. ') + '.';

        const cleanLogsForDB = logs.map(({ time_mark, action_text }) => ({
            time_mark,
            action_text,
        }));

        router.post(
            '/record/store-draft',
            {
                patient_id: patient?.id,
                leader_name: leader_name,
                team_members: team_members,
                duration_seconds: timer,
                final_transcription: finalContent,
                logs: cleanLogsForDB,
            },
            {
                onFinish: () => setIsProcessing(false),
            },
        );
    };

    return (
        <div className="flex min-h-screen items-start justify-center bg-slate-200 dark:bg-zinc-900 md:py-8">
            <Head title="Perekaman Code Blue" />

            {/* Container Utama */}
            <div className="flex w-full max-w-md min-h-screen md:min-h-[850px] md:max-h-[90vh] flex-col bg-slate-100 dark:bg-zinc-950 md:rounded-3xl md:shadow-2xl overflow-hidden md:border md:border-slate-200 dark:md:border-zinc-800">
                
                <div className="sticky top-0 z-10 flex items-center gap-3 bg-blue-900 px-4 py-3 shadow-md md:rounded-t-2xl">
                    <button
                        onClick={() => window.history.back()}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95"
                        aria-label="Kembali"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="flex-1 text-center text-base font-bold tracking-wide text-white">
                        V-CODE
                    </h1>
                    <div className="h-9 w-9" />
                </div>

                <div className="flex flex-1 flex-col gap-3 px-4 py-4 overflow-y-auto">

                    {/* Hero Card - Deskripsi & Status */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-zinc-900">
                        <div className="flex items-start gap-4 p-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-900">
                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold tracking-widest text-blue-900 uppercase dark:text-blue-400">
                                    Code Blue
                                </p>
                                <h2 className="mt-0.5 text-base font-bold text-gray-900 dark:text-white">
                                    {patient.name}
                                </h2>
                                <p className="mt-0.5 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                                    Draft Dokumentasi Tindakan Keperawatan · Real-time Voice
                                </p>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5 dark:border-zinc-800">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                Status
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`h-2 w-2 rounded-full ${
                                        isRecording
                                            ? 'animate-pulse bg-red-500'
                                            : 'bg-emerald-400'
                                    }`}
                                />
                                <span
                                    className={`text-xs font-semibold ${
                                        isRecording
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-emerald-600 dark:text-emerald-400'
                                    }`}
                                >
                                    {isRecording
                                        ? `Merekam · ${formatTime(timer)}`
                                        : 'Siap Merekam'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Visualizer saat merekam */}
                    {isRecording && (
                        <div className="flex items-center justify-center gap-0.5 rounded-2xl bg-red-50 py-4 dark:bg-red-950/20">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 animate-pulse rounded-full bg-red-400 dark:bg-red-500"
                                    style={{
                                        height: `${Math.random() * 28 + 8}px`,
                                        animationDelay: `${i * 0.08}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Area Transkripsi */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-zinc-900 flex-1 flex flex-col min-h-[200px]">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                                Transkripsi Real-time
                            </h3>
                            {logs.length > 0 && (
                                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                    {logs.length} tindakan
                                </span>
                            )}
                        </div>

                        <div className="overflow-y-auto p-4 flex-1">
                            {logs.length === 0 && !interimTranscript ? (
                                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Tekan mikrofon untuk mulai
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                                        Transkripsi muncul otomatis saat merekam
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {logs.map((log, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-3 rounded-xl bg-blue-50/60 px-3 py-2.5 dark:bg-blue-950/20"
                                        >
                                            <span className="mt-0.5 w-16 shrink-0 font-mono text-xs font-medium text-gray-400 dark:text-gray-500">
                                                {log.time_mark}
                                            </span>
                                            <span className="text-sm font-medium leading-snug text-blue-900 dark:text-blue-100">
                                                {log.action_text}
                                            </span>
                                        </div>
                                    ))}

                                    {interimTranscript && (
                                        <div className="flex gap-3 rounded-xl border border-dashed border-gray-200 px-3 py-2.5 opacity-60 dark:border-zinc-700">
                                            <span className="mt-0.5 w-16 shrink-0 font-mono text-xs text-gray-400">
                                                --:--
                                            </span>
                                            <span className="text-sm italic text-gray-500 dark:text-gray-400">
                                                {interimTranscript}...
                                            </span>
                                        </div>
                                    )}
                                    <div ref={logsEndRef} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="mt-auto pt-2">
                        {!isRecording && timer > 0 ? (
                            <button
                                onClick={saveDraft}
                                disabled={isProcessing}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 text-base font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-95 disabled:opacity-60"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Selesai & Simpan Draft
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={toggleRecording}
                                    className={`flex h-20 w-20 items-center justify-center rounded-full shadow-md transition-all active:scale-90 ${
                                        isRecording
                                            ? 'bg-red-100 ring-4 ring-red-200 dark:bg-red-950 dark:ring-red-900'
                                            : 'bg-blue-900 hover:bg-blue-800'
                                    }`}
                                    aria-label={isRecording ? 'Hentikan rekaman' : 'Mulai rekaman'}
                                >
                                    {isRecording ? (
                                        <div className="h-7 w-7 rounded-md bg-red-600" />
                                    ) : (
                                        <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    )}
                                </button>
                                <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                    {isRecording ? 'Ketuk untuk berhenti' : 'Tekan untuk mulai merekam'}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

Record.layout = (page: React.ReactNode) => <AppLayout children={page} />;