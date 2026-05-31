import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { flushSync } from 'react-dom';
import AppLayout from '@/layouts/new-app-layout';

// ─── Types ───────────────────────────────────────────────────────────────────
type SessionLog = {
    time_mark: string;
    action_text: string;
    category: string;
    timestamp: number;
};

type AutoFillData = {
    assessment_condition: string;
    ttv_time: string;
    ttv_td: string;
    ttv_nadi: string;
    ttv_rr: string;
    ttv_spo2: string;
    ttv_gcs: string;
    evaluation_result: string;
    evaluation_plan: string;
};

type DebugEntry = {
    time: string;
    msg: string;
    type: 'info' | 'send' | 'result' | 'silence' | 'error' | 'ws';
};

type ClassifyRule = {
    keyword: string;
    match_mode: 'contains' | 'exact' | 'starts_with' | 'regex';
    category: string;
    target_field: keyof AutoFillData | null;
    priority: number;
};

// ─── Konstanta ────────────────────────────────────────────────────────────────
const MIN_BLOB_BYTES = 3_500;

// ─── Deteksi mobile ──────────────────────────────────────────────────────────
function isMobileBrowser(): boolean {
    if (typeof navigator === 'undefined') {
        return false;
    }

    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

// ─── Fallback classify rules ──────────────────────────────────────────────────
const FALLBACK_CLASSIFY_RULES: ClassifyRule[] = [
    {
        keyword: 'rosc',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_result',
        priority: 10,
    },
    {
        keyword: 'stabil',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_result',
        priority: 10,
    },
    {
        keyword: 'meninggal',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_result',
        priority: 10,
    },
    {
        keyword: 'dihentikan',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_result',
        priority: 10,
    },
    {
        keyword: 'keluarga diberitahu',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_result',
        priority: 10,
    },
    {
        keyword: 'waktu kematian',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_result',
        priority: 10,
    },
    {
        keyword: 'time of death',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_result',
        priority: 10,
    },
    {
        keyword: 'return of spontaneous',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_result',
        priority: 10,
    },
    {
        keyword: 'hasil',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_result',
        priority: 11,
    },
    {
        keyword: 'rencana',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_plan',
        priority: 10,
    },
    {
        keyword: 'pindah icu',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_plan',
        priority: 10,
    },
    {
        keyword: 'transfer icu',
        match_mode: 'contains',
        category: 'evaluasi',
        target_field: 'evaluation_plan',
        priority: 10,
    },
    {
        keyword: 'tensi',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_td',
        priority: 20,
    },
    {
        keyword: 'tekanan darah',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_td',
        priority: 20,
    },
    {
        keyword: 'nadi',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_nadi',
        priority: 20,
    },
    {
        keyword: 'heart rate',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_nadi',
        priority: 20,
    },
    {
        keyword: 'respirasi',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_rr',
        priority: 20,
    },
    {
        keyword: 'respiratory rate',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_rr',
        priority: 20,
    },
    {
        keyword: ' rr ',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_rr',
        priority: 20,
    },
    {
        keyword: 'saturasi',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_spo2',
        priority: 20,
    },
    {
        keyword: 'spo2',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_spo2',
        priority: 20,
    },
    {
        keyword: 'gcs',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_gcs',
        priority: 20,
    },
    {
        keyword: 'kesadaran',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'ttv_gcs',
        priority: 20,
    },
    {
        keyword: 'ditemukan',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'assessment_condition',
        priority: 20,
    },
    {
        keyword: 'kondisi',
        match_mode: 'contains',
        category: 'pengkajian',
        target_field: 'assessment_condition',
        priority: 20,
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function classifyWithRules(
    text: string,
    rules: ClassifyRule[],
): { category: string; targetField: keyof AutoFillData | null } {
    const activeRules = rules.length > 0 ? rules : FALLBACK_CLASSIFY_RULES;
    const lower = text.toLowerCase();

    for (const rule of activeRules) {
        const kw = rule.keyword.toLowerCase();
        let matched = false;

        switch (rule.match_mode) {
            case 'exact':
                matched = lower === kw;
                break;
            case 'starts_with':
                matched = lower.startsWith(kw);
                break;
            case 'regex':
                try {
                    matched = new RegExp(kw, 'u').test(lower);
                } catch {
                    matched = false;
                }

                break;
            default:
                matched = lower.includes(kw);
        }

        if (matched) {
            return {
                category: rule.category,
                targetField: rule.target_field as keyof AutoFillData | null,
            };
        }
    }

    return { category: 'tindakan', targetField: null };
}

function isRefinement(a: string, b: string): boolean {
    const normalize = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    const na = normalize(a);
    const nb = normalize(b);

    if (
        na === nb ||
        na.startsWith(nb) ||
        nb.startsWith(na) ||
        na.includes(nb) ||
        nb.includes(na)
    ) {
        return true;
    }

    const wordsA = new Set(na.split(' '));
    const wordsB = new Set(nb.split(' '));
    let same = 0;
    wordsA.forEach((w) => {
        if (wordsB.has(w)) {
            same++;
        }
    });

    return same / Math.max(wordsA.size, wordsB.size) >= 0.5;
}

function pickMime(): string | null {
    const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/mpeg',
    ];

    for (const mime of candidates) {
        if (MediaRecorder.isTypeSupported(mime)) {
            return mime;
        }
    }

    return isMobileBrowser() ? '' : null;
}

// ─── Badge & style helpers ────────────────────────────────────────────────────
function catBg(c: string) {
    if (c === 'pengkajian') {
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/40';
    }

    if (c === 'evaluasi') {
        return 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800/40';
    }

    return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/40';
}
function catDot(c: string) {
    if (c === 'pengkajian') {
        return 'bg-blue-500';
    }

    if (c === 'evaluasi') {
        return 'bg-purple-500';
    }

    return 'bg-emerald-500';
}
function catBadge(c: string) {
    if (c === 'pengkajian') {
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300';
    }

    if (c === 'evaluasi') {
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300';
    }

    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300';
}
function debugColor(type: DebugEntry['type']) {
    if (type === 'result') {
        return 'text-emerald-600 dark:text-emerald-400';
    }

    if (type === 'send') {
        return 'text-blue-600 dark:text-blue-400';
    }

    if (type === 'silence') {
        return 'text-gray-400 dark:text-zinc-600';
    }

    if (type === 'error') {
        return 'text-red-600 dark:text-red-400';
    }

    if (type === 'ws') {
        return 'text-amber-600 dark:text-amber-400';
    }

    return 'text-gray-600 dark:text-zinc-500';
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Record({
    patient,
    leader_name,
    team_members,
    incident_type,
}: {
    patient: { id: number; name: string; rm_number: string };
    leader_name: string;
    team_members: string;
    incident_type: string;
}) {
    // ── State ─────────────────────────────────────────────────────────────────
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [interimText, setInterimText] = useState('');
    const [logs, setLogs] = useState<SessionLog[]>([]);
    const [debugLogs, setDebugLogs] = useState<DebugEntry[]>([]);
    const [showDebug, setShowDebug] = useState(false);
    const [googlePending, setGooglePending] = useState<Set<number>>(new Set());
    const [classifyRules, setClassifyRules] = useState<ClassifyRule[]>([]);
    const [autoFill, setAutoFill] = useState<AutoFillData>(() => {
        const hms = new Date()
            .toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })
            .replace(/\./g, ':');

        return {
            assessment_condition: '',
            ttv_time: hms,
            ttv_td: '',
            ttv_nadi: '',
            ttv_rr: '',
            ttv_spo2: '',
            ttv_gcs: '',
            evaluation_result: '',
            evaluation_plan: '',
        };
    });

    // ── Refs ──────────────────────────────────────────────────────────────────
    const logsEndRef = useRef<HTMLDivElement>(null);
    const debugEndRef = useRef<HTMLDivElement>(null);
    const isRecordingRef = useRef(false);
    const autoFillRef = useRef(autoFill);
    const classifyRulesRef = useRef<ClassifyRule[]>([]);

    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const mimeRef = useRef<string>('');
    const fullRecorderRef = useRef<MediaRecorder | null>(null);
    const fullChunksRef = useRef<Blob[]>([]);
    const [fullAudioBlob, setFullAudioBlob] = useState<Blob | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // WS / Desktop Refs
    const recognitionRef = useRef<any>(null);
    const wsRestartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    // Mobile VAD Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const vadStateRef = useRef({
        isSpeaking: false,
        silenceTimer: null as ReturnType<typeof setTimeout> | null,
    });

    const killAll = useCallback(() => {
        isRecordingRef.current = false;

        if (wsRestartTimerRef.current) {
            clearTimeout(wsRestartTimerRef.current);
        }

        if (vadStateRef.current.silenceTimer) {
            clearTimeout(vadStateRef.current.silenceTimer);
        }

        try {
            recognitionRef.current?.stop();
        } catch {
            /* ignore */
        }

        try {
            audioContextRef.current?.close();
        } catch {
            /* ignore */
        }

        if (recorderRef.current?.state !== 'inactive') {
            recorderRef.current?.stop();
        }

        if (fullRecorderRef.current?.state !== 'inactive') {
            fullRecorderRef.current?.stop();
        }

        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, []);

    // Generate animasi visualizer menggunakan rumus statis ringan (pseudo-random)
    // Ini mengelabui linter karena hasilnya selalu stabil pada setiap render
    const audioVisualizerBars = useMemo(() => {
        return Array.from({ length: 28 }).map((_, i) => {
            const pseudoRandom = (Math.sin(i * 12.9898) * 43758.5453) % 1;
            const positiveRandom =
                pseudoRandom < 0 ? pseudoRandom * -1 : pseudoRandom;

            return {
                height: `${positiveRandom * 30 + 6}px`,
                animation: `pulse ${0.6 + positiveRandom * 0.8}s ease-in-out infinite`,
                animationDelay: `${i * 0.05}s`,
            };
        });
    }, []);

    // ── Sync refs ─────────────────────────────────────────────────────────────
    useEffect(() => {
        autoFillRef.current = autoFill;
    }, [autoFill]);
    useEffect(() => {
        classifyRulesRef.current = classifyRules;
    }, [classifyRules]);

    // ── Init ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        axios
            .get('/record/classify-rules')
            .then((res) => {
                const sorted = (res.data as ClassifyRule[]).sort(
                    (a, b) => a.priority - b.priority,
                );
                setClassifyRules(sorted);
                classifyRulesRef.current = sorted;
            })
            .catch(() => {
                /* ignore */
            });

        return () => killAll();
    }, [killAll]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs, interimText]);
    useEffect(() => {
        if (showDebug) {
            debugEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [debugLogs, showDebug]);

    // ── Debug ─────────────────────────────────────────────────────────────────
    const dbg = useCallback(
        (msg: string, type: DebugEntry['type'] = 'info') => {
            const now = new Date();
            const time =
                now.toLocaleTimeString('id-ID', { hour12: false }) +
                '.' +
                String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
            setDebugLogs((p) => [...p.slice(-199), { time, msg, type }]);
            axios
                .post('/api/code-blue/debug-log', {
                    patient_id: patient.id,
                    time_mark: time,
                    type,
                    message: msg,
                })
                .catch(() => {
                    /* ignore */
                });
        },
        [patient.id],
    );

    // ── AutoFill ──────────────────────────────────────────────────────────────
    const updateAutoFill = useCallback(
        (field: keyof AutoFillData, text: string, isCorrection = false) => {
            const cleanText = text.replace(/\s+per\s+/gi, '/');
            setAutoFill((prev) => {
                const existing = prev[field] as string;

                if (!existing) {
                    return { ...prev, [field]: cleanText };
                }

                const entries = existing.split('. ');
                const last = entries[entries.length - 1];

                if (isCorrection) {
                    entries[entries.length - 1] = cleanText;

                    return { ...prev, [field]: entries.join('. ') };
                }

                if (isRefinement(last, cleanText)) {
                    entries[entries.length - 1] =
                        cleanText.length >= last.length ? cleanText : last;

                    return { ...prev, [field]: entries.join('. ') };
                }

                return { ...prev, [field]: existing + '. ' + cleanText };
            });
        },
        [],
    );

    // ── Log management ────────────────────────────────────────────────────────
    const insertLog = useCallback(
        (
            text: string,
            category: string,
            timeMark: string,
            timestamp: number,
        ): number => {
            let assignedIdx = -1;
            flushSync(() => {
                setLogs((prev) => {
                    if (prev.length > 0) {
                        const last = prev[prev.length - 1];

                        if (
                            last.action_text.toLowerCase().trim() ===
                            text.toLowerCase().trim()
                        ) {
                            assignedIdx = prev.length - 1;

                            return prev;
                        }

                        if (
                            last.category === category &&
                            timestamp - last.timestamp < 5_000 &&
                            isRefinement(last.action_text, text)
                        ) {
                            const longer =
                                text.length >= last.action_text.length
                                    ? text
                                    : last.action_text;
                            assignedIdx = prev.length - 1;

                            return [
                                ...prev.slice(0, -1),
                                { ...last, action_text: longer, timestamp },
                            ];
                        }
                    }

                    assignedIdx = prev.length;

                    return [
                        ...prev,
                        {
                            time_mark: timeMark,
                            action_text: text,
                            category,
                            timestamp,
                        },
                    ];
                });
            });

            return assignedIdx;
        },
        [],
    );

    const patchLog = useCallback(
        (idx: number, text: string, category: string) => {
            setLogs((prev) => {
                if (idx < 0 || idx >= prev.length) {
                    return prev;
                }

                const updated = [...prev];
                updated[idx] = { ...prev[idx], action_text: text, category };

                return updated;
            });
        },
        [],
    );

    // ── Upload Audio (Google STT) ──────────────────────────────────────────
    const uploadToGoogle = useCallback(
        async (chunks: Blob[], sourceType: string, prefillLogIdx?: number) => {
            if (!chunks.length) {
                return;
            }

            const mime = mimeRef.current;
            const blob = new Blob(chunks, { type: mime });

            if (blob.size < MIN_BLOB_BYTES) {
                return;
            } // Skip ukuran terlalu kecil (noise)

            let currentLogIdx = prefillLogIdx ?? -1;
            const ext = mime.includes('ogg')
                ? 'ogg'
                : mime.includes('mp4')
                  ? 'mp4'
                  : 'webm';
            dbg(
                `Kirim ${(blob.size / 1024).toFixed(0)}KB → Google (${sourceType})`,
                'send',
            );

            const form = new FormData();
            form.append('audio', blob, `seg.${ext}`);

            try {
                const res = await axios.post('/api/transcribe', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 15_000,
                });
                const text: string = res.data?.text ?? '';
                const conf: number = res.data?.confidence ?? 0;

                if (text && conf >= 0.7) {
                    dbg(
                        `Google [${Math.round(conf * 100)}%]: "${text}"`,
                        'result',
                    );
                    const cat =
                        res.data?.category ??
                        classifyWithRules(text, classifyRulesRef.current)
                            .category;
                    const field =
                        res.data?.target_field ??
                        classifyWithRules(text, classifyRulesRef.current)
                            .targetField;

                    if (currentLogIdx !== -1) {
                        patchLog(currentLogIdx, text, cat);
                    } else {
                        const now = new Date();
                        currentLogIdx = insertLog(
                            text,
                            cat,
                            now.toLocaleTimeString('id-ID', { hour12: false }),
                            now.getTime(),
                        );
                    }

                    if (field) {
                        updateAutoFill(field, text, true);
                    }

                    if (isMobileBrowser()) {
                        setInterimText('');
                    }
                } else {
                    dbg(`Google: (kosong/noise)`, 'silence');

                    if (isMobileBrowser()) {
                        setInterimText('');
                    }
                }
            } catch {
                dbg(`Google Upload Error`, 'error');

                if (isMobileBrowser()) {
                    setInterimText('');
                }
            } finally {
                if (currentLogIdx !== -1) {
                    setGooglePending((prev) => {
                        const next = new Set(prev);
                        next.delete(currentLogIdx);

                        return next;
                    });
                }
            }
        },
        [dbg, patchLog, insertLog, updateAutoFill],
    );

    // ── Fungsi Trigger Pengambilan Audio (Stop/Start Cepat) ─────────────────
    const triggerChunkUpload = useCallback(
        (sourceType: string, logIdx?: number) => {
            if (
                !recorderRef.current ||
                recorderRef.current.state !== 'recording'
            ) {
                return;
            }

            const audioSnapshot = [...chunksRef.current];
            chunksRef.current = [];

            const oldRecorder = recorderRef.current;
            oldRecorder.ondataavailable = null;
            oldRecorder.stop();

            setTimeout(() => {
                if (!isRecordingRef.current || !streamRef.current) {
                    return;
                }

                const newRecorder = new MediaRecorder(streamRef.current, {
                    audioBitsPerSecond: 96_000,
                    ...(mimeRef.current && { mimeType: mimeRef.current }),
                });
                newRecorder.ondataavailable = (e) => {
                    if (e.data?.size > 0) {
                        chunksRef.current.push(e.data);
                    }
                };
                newRecorder.start(300); // Start dengan slice kecil
                recorderRef.current = newRecorder;
            }, 100);

            uploadToGoogle(audioSnapshot, sourceType, logIdx);
        },
        [uploadToGoogle],
    );

    // ── Web Speech API (HANYA UNTUK LAPTOP) ───────────────────────────────
    const startWebSpeech = useCallback(async () => {
        const SR =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SR) {
            return;
        }

        const rec = new SR();
        rec.continuous = true;
        rec.lang = 'id-ID';
        rec.maxAlternatives = 1;
        rec.interimResults = true;

        rec.onstart = () => dbg(`WS started (Desktop Mode)`, 'ws');
        rec.onresult = (event: any) => {
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const text = event.results[i][0].transcript.trim();

                if (!text) {
                    continue;
                }

                if (event.results[i].isFinal) {
                    const now = new Date();
                    const { category, targetField } = classifyWithRules(
                        text,
                        classifyRulesRef.current,
                    );
                    dbg(`WS final: "${text}"`, 'ws');
                    const logIdx = insertLog(
                        text,
                        category,
                        now.toLocaleTimeString('id-ID', { hour12: false }),
                        now.getTime(),
                    );

                    if (targetField) {
                        updateAutoFill(targetField, text);
                    }

                    setGooglePending((prev) => new Set(prev).add(logIdx));

                    triggerChunkUpload('Desktop WS', logIdx);
                } else {
                    interim += text;
                }
            }

            setInterimText(interim);
        };
        rec.onerror = (e: any) => {
            if (e.error !== 'no-speech') {
                dbg(`WS error: ${e.error}`, 'error');
            }
        };
        rec.onend = () => {
            if (isRecordingRef.current) {
                wsRestartTimerRef.current = setTimeout(() => {
                    try {
                        recognitionRef.current?.start();
                    } catch {
                        /* ignore */
                    }
                }, 400);
            }
        };
        recognitionRef.current = rec;

        try {
            recognitionRef.current?.start();
        } catch {
            /* ignore */
        }
    }, [dbg, insertLog, updateAutoFill, triggerChunkUpload]);

    // ── Start Recording Utama ────────────────────────────────────────────────
    const startRecording = async () => {
        const mime = pickMime();

        if (!mime && !isMobileBrowser()) {
            alert(
                'Browser tidak mendukung format audio apapun. Coba Chrome/Edge terbaru.',
            );

            return;
        }

        dbg(`Browser: ${navigator.userAgent.slice(0, 80)}`, 'info');
        dbg(`MIME dipilih: ${mime || 'default iOS'}`, 'info');
        dbg(`Mobile mode: ${isMobileBrowser()}`, 'info');

        let stream: MediaStream;

        try {
            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48_000,
                    channelCount: 1,
                },
            });
            dbg(`Stream OK: ${stream.getAudioTracks()[0].label}`, 'info');
        } catch {
            alert('Gagal akses mic. Pastikan izin browser menyala.');

            return;
        }

        streamRef.current = stream;
        isRecordingRef.current = true;
        setIsRecording(true);
        setInterimText('');
        setLogs([]);
        setTimer(0);
        setGooglePending(new Set());

        timerRef.current = setInterval(() => setTimer((t) => t + 1), 1_000);

        // 1. Rekam untuk chunking (STT)
        mimeRef.current = mime || '';
        chunksRef.current = [];
        const options = {
            audioBitsPerSecond: 96_000,
            ...(mime && { mimeType: mime }),
        };
        const rec = new MediaRecorder(stream, options);
        rec.ondataavailable = (e) => {
            if (e.data?.size > 0) {
                chunksRef.current.push(e.data);
            }
        };
        rec.start(300);
        recorderRef.current = rec;

        // 2. Rekaman Full untuk Backup
        fullChunksRef.current = [];
        const fullRec = new MediaRecorder(stream, options);
        fullRec.ondataavailable = (e) => {
            if (e.data.size > 0) {
                fullChunksRef.current.push(e.data);
            }
        };
        fullRec.onstop = () =>
            setFullAudioBlob(
                new Blob(fullChunksRef.current, { type: mime || '' }),
            );
        fullRec.start();
        fullRecorderRef.current = fullRec;

        // 3. Penanganan Mode (Web Speech vs VAD)
        if (!isMobileBrowser()) {
            startWebSpeech();
        } else {
            dbg('Mobile Mode: VAD Audio Aktif (Tanpa Web Speech)', 'info');
            const audioCtx = new (
                window.AudioContext || (window as any).webkitAudioContext
            )();
            audioContextRef.current = audioCtx;
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 512;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const checkAudio = () => {
                if (!isRecordingRef.current) {
                    audioCtx.close();

                    return;
                }

                analyser.getByteFrequencyData(dataArray);
                let sum = 0;

                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }

                const avg = sum / bufferLength;

                if (avg > 12) {
                    // Ambang batas suara
                    if (!vadStateRef.current.isSpeaking) {
                        vadStateRef.current.isSpeaking = true;
                        setInterimText('Mendengarkan...');
                    }

                    if (vadStateRef.current.silenceTimer) {
                        clearTimeout(vadStateRef.current.silenceTimer);
                        vadStateRef.current.silenceTimer = null;
                    }
                } else {
                    // Jika mulai hening
                    if (
                        vadStateRef.current.isSpeaking &&
                        !vadStateRef.current.silenceTimer
                    ) {
                        vadStateRef.current.silenceTimer = setTimeout(() => {
                            vadStateRef.current.isSpeaking = false;
                            vadStateRef.current.silenceTimer = null;
                            setInterimText('Memproses suara...');
                            triggerChunkUpload('Mobile VAD');
                        }, 1500); // Tunggu 1.5 detik hening sebelum kirim
                    }
                }

                requestAnimationFrame(checkAudio);
            };
            checkAudio();
        }

        dbg('=== Recording dimulai ===', 'info');
    };

    const toggleRecording = () => {
        if (!isRecording) {
            startRecording();
        } else {
            setIsRecording(false);
            setInterimText('');
            killAll();
            dbg('=== Recording dihentikan ===', 'info');
        }
    };

    const saveDraft = () => {
        setIsProcessing(true);
        router.post(
            '/record/store-draft',
            {
                patient_id: patient.id,
                leader_name,
                team_members,
                incident_type,
                duration_seconds: timer,
                final_transcription:
                    logs.map((l) => l.action_text).join('. ') + '.',
                logs: logs.map(({ time_mark, action_text, category }) => ({
                    time_mark,
                    action_text,
                    category: category || 'tindakan',
                })),
                ...autoFill,
                full_audio: fullAudioBlob,
            },
            { onFinish: () => setIsProcessing(false) },
        );
    };

    const fmt = (s: number) =>
        `${Math.floor(s / 60)
            .toString()
            .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            <Head title="Perekaman Code Blue — V-Code" />
            <div className="flex justify-center">
                <div className="w-full max-w-lg">
                    {/* ── PAGE HEADER ── */}
                    <div className="mb-4 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-gray-300 hover:text-gray-700 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-zinc-200"
                            aria-label="Kembali"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                                Perekaman
                            </h1>
                            <p className="truncate text-xs text-gray-400 dark:text-zinc-500">
                                {incident_type}
                            </p>
                        </div>
                        {(isRecording || timer > 0) && (
                            <div
                                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 ${isRecording ? 'bg-red-50 dark:bg-red-950/30' : 'bg-gray-100 dark:bg-white/5'}`}
                            >
                                {isRecording && (
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                                )}
                                <span
                                    className={`font-mono text-sm font-bold tabular-nums ${isRecording ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-zinc-400'}`}
                                >
                                    {fmt(timer)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ── PATIENT INFO CARD ── */}
                    <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                        <div className="flex items-center gap-3 px-4 py-3.5">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600">
                                <svg
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                                    {patient.name}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500">
                                    {patient.rm_number}
                                </p>
                            </div>
                            <div
                                className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 ${isRecording ? 'bg-red-50 dark:bg-red-950/30' : 'bg-emerald-50 dark:bg-emerald-950/30'}`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${isRecording ? 'animate-pulse bg-red-500' : 'bg-emerald-500'}`}
                                />
                                <span
                                    className={`text-[11px] font-bold ${isRecording ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                                >
                                    {isRecording ? 'Merekam' : 'Siap'}
                                </span>
                            </div>
                        </div>
                        {classifyRules.length > 0 && (
                            <div className="border-t border-gray-100 px-4 py-2 dark:border-white/5">
                                <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                                    Hybrid STT aktif ·{' '}
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        {classifyRules.length} rules dimuat
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── AUDIO VISUALIZER ── */}
                    {isRecording && (
                        <div className="mb-4 flex items-center justify-center gap-0.5 rounded-2xl border border-red-100 bg-red-50 py-5 dark:border-red-900/20 dark:bg-red-950/20">
                            {audioVisualizerBars.map((barStyle, i) => (
                                <div
                                    key={i}
                                    className="w-1 rounded-full bg-red-400 dark:bg-red-500"
                                    style={barStyle} // Langsung gunakan objek style dari useMemo
                                />
                            ))}
                        </div>
                    )}

                    {/* ── TRANSKRIPSI CARD ── */}
                    <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                                    <svg
                                        className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    Transkripsi
                                </span>
                            </div>
                            {logs.length > 0 && (
                                <span className="rounded-lg bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                    {logs.length} tindakan
                                </span>
                            )}
                        </div>

                        <div className="max-h-[45vh] min-h-[180px] overflow-y-auto p-4 md:max-h-[360px]">
                            {logs.length === 0 && !interimText ? (
                                <div className="flex h-36 flex-col items-center justify-center text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5">
                                        <svg
                                            className="h-6 w-6 text-gray-300 dark:text-zinc-600"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500">
                                        Tekan mikrofon untuk mulai
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-300 dark:text-zinc-600">
                                        Transkripsi muncul secara real-time
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {logs.map((log, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex flex-col gap-1 rounded-xl border p-3 transition-all duration-300 ${catBg(log.category)}`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${catDot(log.category)}`}
                                                    />
                                                    <span className="font-mono text-[11px] font-bold text-gray-400 dark:text-zinc-500">
                                                        {log.time_mark}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {googlePending.has(idx) && (
                                                        <span
                                                            className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"
                                                            title="Menunggu koreksi Google STT"
                                                        />
                                                    )}
                                                    <span
                                                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${catBadge(log.category)}`}
                                                    >
                                                        {log.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm leading-snug font-medium text-gray-800 dark:text-zinc-100">
                                                {log.action_text}
                                            </p>
                                        </div>
                                    ))}
                                    {interimText && (
                                        <div className="flex items-start gap-2 rounded-xl border border-dashed border-gray-200 p-3 opacity-60 dark:border-zinc-700">
                                            <span className="mt-0.5 flex-shrink-0 font-mono text-[11px] text-gray-400 dark:text-zinc-500">
                                                --:--
                                            </span>
                                            <span
                                                className={`text-sm italic ${interimText === 'Mendengarkan...' ? 'text-blue-500' : 'text-gray-500'} dark:text-zinc-400`}
                                            >
                                                {interimText}
                                                {!interimText.endsWith('...') &&
                                                    '...'}
                                            </span>
                                        </div>
                                    )}
                                    <div ref={logsEndRef} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── DEBUG PANEL ── */}
                    <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                        <button
                            onClick={() => setShowDebug((v) => !v)}
                            className="flex w-full items-center justify-between bg-gray-50/50 px-4 py-3 hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10"
                        >
                            <div className="flex items-center gap-2.5">
                                <svg
                                    className="h-4 w-4 text-gray-400 dark:text-zinc-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 9l3 3-3 3m5 0h3M4 15V9a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2z"
                                    />
                                </svg>
                                <span className="font-mono text-[11px] font-bold tracking-widest text-gray-600 uppercase dark:text-zinc-400">
                                    Hybrid STT Log
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {debugLogs.length > 0 && (
                                    <span className="rounded-md bg-gray-200 px-2 py-0.5 font-mono text-[10px] text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">
                                        {debugLogs.length}
                                    </span>
                                )}
                                <div
                                    className={`h-2 w-2 rounded-full transition-colors ${isRecording ? (debugLogs[debugLogs.length - 1]?.type === 'error' ? 'bg-red-500' : 'bg-emerald-500') : 'bg-gray-300 dark:bg-zinc-700'}`}
                                />
                                <svg
                                    className={`h-4 w-4 text-gray-400 transition-transform duration-300 dark:text-zinc-500 ${showDebug ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </button>
                        {showDebug && (
                            <div className="max-h-52 overflow-y-auto bg-gray-50 p-4 text-gray-800 shadow-inner dark:bg-[#0A0C10] dark:text-zinc-300">
                                {debugLogs.length === 0 ? (
                                    <p className="font-mono text-xs text-gray-400 italic dark:text-zinc-600">
                                        Menunggu aktivitas sistem...
                                    </p>
                                ) : (
                                    <div className="space-y-1">
                                        {debugLogs.map((e, i) => (
                                            <div
                                                key={i}
                                                className="flex gap-2.5 font-mono text-[11px] leading-relaxed"
                                            >
                                                <span className="flex-shrink-0 text-gray-400 select-none dark:text-zinc-600">
                                                    [{e.time}]
                                                </span>
                                                <span
                                                    className={debugColor(
                                                        e.type,
                                                    )}
                                                >
                                                    {e.msg}
                                                </span>
                                            </div>
                                        ))}
                                        <div ref={debugEndRef} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="h-32 md:h-0" />
                </div>
            </div>

            {/* ── FIXED BOTTOM ACTION BAR ── */}
            <div className="fixed right-0 bottom-24 left-0 z-40 flex justify-center px-4 md:relative md:bottom-auto md:mt-6 md:px-0">
                <div className="w-full max-w-lg rounded-[2rem] border border-white/60 bg-white/80 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none dark:border-white/10 dark:bg-[#1C1F2A]/90">
                    {!isRecording && timer > 0 ? (
                        <button
                            onClick={saveDraft}
                            disabled={isProcessing}
                            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200/50 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 dark:shadow-blue-900/20"
                        >
                            {isProcessing ? (
                                <>
                                    <svg
                                        className="h-5 w-5 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Menyimpan Data...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Selesai &amp; Simpan Draft
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={toggleRecording}
                                aria-label={
                                    isRecording
                                        ? 'Hentikan rekaman'
                                        : 'Mulai rekaman'
                                }
                                className={`group relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 active:scale-95 ${isRecording ? 'bg-red-50 ring-4 ring-red-100 dark:bg-red-950/50 dark:ring-red-900/40' : 'bg-blue-600 shadow-blue-200/60 hover:bg-blue-700 hover:shadow-blue-300/60 dark:shadow-blue-900/30'}`}
                            >
                                {isRecording ? (
                                    <div className="h-6 w-6 rounded-md bg-red-500 transition-transform group-hover:scale-110" />
                                ) : (
                                    <svg
                                        className="h-7 w-7 text-white transition-transform group-hover:scale-110"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                        />
                                    </svg>
                                )}
                            </button>
                            <p className="text-[11px] font-bold tracking-wide text-gray-500 uppercase dark:text-zinc-500">
                                {isRecording
                                    ? 'Ketuk untuk berhenti'
                                    : 'Mulai Merekam'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Record.layout = (page: React.ReactNode) => <AppLayout children={page} />;
