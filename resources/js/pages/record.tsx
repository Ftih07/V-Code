import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import AppLayout from '@/layouts/new-app-layout';
import axios from 'axios';
import { flushSync } from 'react-dom';

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

const GOOGLE_TIMEOUT_MS = 7_000;
const MIN_BLOB_BYTES = 3_500;
const WS_RESTART_DELAY = 150;
const WS_MAX_RESTARTS = 5;
const WS_COOLDOWN_MS = 2_000;

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
        if (matched)
            return {
                category: rule.category,
                targetField: rule.target_field as keyof AutoFillData | null,
            };
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
    )
        return true;
    const wordsA = new Set(na.split(' '));
    const wordsB = new Set(nb.split(' '));
    let same = 0;
    wordsA.forEach((w) => {
        if (wordsB.has(w)) same++;
    });
    return same / Math.max(wordsA.size, wordsB.size) >= 0.5;
}

function pickMime(): string | null {
    return (
        ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'].find(
            (m) => MediaRecorder.isTypeSupported(m),
        ) ?? null
    );
}

// ─── Badge & style helpers (luar component agar stabil) ──────────────────────

function catBg(c: string) {
    if (c === 'pengkajian')
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/40';
    if (c === 'evaluasi')
        return 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800/40';
    return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/40';
}

function catDot(c: string) {
    if (c === 'pengkajian') return 'bg-blue-500';
    if (c === 'evaluasi') return 'bg-purple-500';
    return 'bg-emerald-500';
}

function catBadge(c: string) {
    if (c === 'pengkajian')
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300';
    if (c === 'evaluasi')
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300';
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300';
}

function debugColor(type: DebugEntry['type']) {
    if (type === 'result') return 'text-emerald-600 dark:text-emerald-400';
    if (type === 'send') return 'text-blue-600 dark:text-blue-400';
    if (type === 'silence') return 'text-gray-400 dark:text-zinc-600';
    if (type === 'error') return 'text-red-600 dark:text-red-400';
    if (type === 'ws') return 'text-amber-600 dark:text-amber-400';
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
    const [autoFill, setAutoFill] = useState<AutoFillData>({
        assessment_condition: '',
        ttv_time: '',
        ttv_td: '',
        ttv_nadi: '',
        ttv_rr: '',
        ttv_spo2: '',
        ttv_gcs: '',
        evaluation_result: '',
        evaluation_plan: '',
    });

    // ── Refs ──────────────────────────────────────────────────────────────────
    const logsEndRef = useRef<HTMLDivElement>(null);
    const debugEndRef = useRef<HTMLDivElement>(null);
    const isRecordingRef = useRef(false);
    const autoFillRef = useRef(autoFill);
    const classifyRulesRef = useRef<ClassifyRule[]>([]);
    const recognitionRef = useRef<any>(null);
    const wsRestartCountRef = useRef(0);
    const wsRestartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const wsCooldownRef = useRef(false);
    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const mimeRef = useRef<string>('');
    const fullRecorderRef = useRef<MediaRecorder | null>(null);
    const fullChunksRef = useRef<Blob[]>([]);
    const [fullAudioBlob, setFullAudioBlob] = useState<Blob | null>(null);
    const pendingRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
        new Map(),
    );
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Sync refs ─────────────────────────────────────────────────────────────
    useEffect(() => {
        autoFillRef.current = autoFill;
    }, [autoFill]);
    useEffect(() => {
        classifyRulesRef.current = classifyRules;
    }, [classifyRules]);

    // ── Init ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        const hms = new Date()
            .toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })
            .replace(/\./g, ':');
        setAutoFill((p) => ({ ...p, ttv_time: hms }));

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
                /* Gunakan fallback */
            });

        return () => killAll();
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs, interimText]);
    useEffect(() => {
        if (showDebug)
            debugEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                .catch(() => {});
        },
        [patient.id],
    );

    // ── AutoFill ──────────────────────────────────────────────────────────────
    const updateAutoFill = useCallback(
        (field: keyof AutoFillData, text: string, isCorrection = false) => {
            // Otomatis ubah kata " per " yang diapit angka/spasi menjadi "/"
            // Contoh: "50 per 100" -> "50/100"
            let cleanText = text.replace(/\s+per\s+/gi, '/');

            setAutoFill((prev) => {
                const existing = prev[field] as string;
                if (!existing) return { ...prev, [field]: cleanText };

                const entries = existing.split('. ');
                const last = entries[entries.length - 1];

                // FIX UTAMA: Jika ini dari Google STT (isCorrection = true),
                // LANGSUNG timpa kalimat terakhir. Tidak perlu cek kemiripan (isRefinement) lagi.
                if (isCorrection) {
                    entries[entries.length - 1] = cleanText;
                    return { ...prev, [field]: entries.join('. ') };
                }

                // Jika ini dari Web Speech (bukan koreksi), baru cek kemiripannya
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
                if (idx < 0 || idx >= prev.length) return prev;
                const updated = [...prev];
                updated[idx] = { ...prev[idx], action_text: text, category };
                return updated;
            });
        },
        [],
    );

    // ── Google STT ────────────────────────────────────────────────────────────
    const uploadToGoogle = useCallback(
        async (logIdx: number, chunks: Blob[]) => {
            if (!chunks.length) return;
            const mime = mimeRef.current;
            const blob = new Blob(chunks, { type: mime });
            if (blob.size < MIN_BLOB_BYTES) {
                dbg(`Blob ${blob.size}B terlalu kecil — skip`, 'silence');
                return;
            }
            const ext = mime.includes('ogg') ? 'ogg' : 'webm';
            dbg(
                `Kirim ${(blob.size / 1024).toFixed(0)}KB → Google (log #${logIdx})`,
                'send',
            );
            const form = new FormData();
            form.append('audio', blob, `seg.${ext}`);
            try {
                const t0 = Date.now();
                const res = await axios.post('/api/transcribe', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 12_000,
                });
                const ms = Date.now() - t0;
                const text: string = res.data?.text ?? '';
                const confidence: number = res.data?.confidence ?? 0;
                if (!text) {
                    dbg(`[${ms}ms] Google: (kosong)`, 'silence');
                    return;
                }
                if (confidence < 0.72) {
                    dbg(
                        `[${ms}ms] Ditolak (${Math.round(confidence * 100)}% < 72%): "${text}"`,
                        'error',
                    );
                    return;
                }
                dbg(
                    `[${ms}ms] Google [${Math.round(confidence * 100)}%]: "${text}"`,
                    'result',
                );
                const cat =
                    (res.data?.category as string) ??
                    classifyWithRules(text, classifyRulesRef.current).category;
                const field =
                    (res.data?.target_field as keyof AutoFillData | null) ??
                    classifyWithRules(text, classifyRulesRef.current)
                        .targetField;
                patchLog(logIdx, text, cat);
                if (field) updateAutoFill(field, text, true);
            } catch (err) {
                dbg(
                    `Google error: ${axios.isAxiosError(err) ? `HTTP ${err.response?.status ?? err.message}` : String(err)}`,
                    'error',
                );
            } finally {
                setGooglePending((prev) => {
                    const next = new Set(prev);
                    next.delete(logIdx);
                    return next;
                });
            }
        },
        [dbg, patchLog, updateAutoFill],
    );

    // ── handleFinalTranscript ─────────────────────────────────────────────────
    const handleFinalTranscript = useCallback(
        (text: string) => {
            const now = new Date();
            const timeMark = now.toLocaleTimeString('id-ID', { hour12: false });
            const ts = now.getTime();
            const { category, targetField } = classifyWithRules(
                text,
                classifyRulesRef.current,
            );
            dbg(`WS final: "${text}"`, 'ws');
            const logIdx = insertLog(text, category, timeMark, ts);
            if (targetField) updateAutoFill(targetField, text);
            setGooglePending((prev) => new Set(prev).add(logIdx));
            let audioSnapshot: Blob[] = [];
            if (
                recorderRef.current &&
                recorderRef.current.state === 'recording'
            ) {
                audioSnapshot = [...chunksRef.current];
                chunksRef.current = [];
                const oldRecorder = recorderRef.current;
                if (oldRecorder) {
                    oldRecorder.ondataavailable = null;
                    oldRecorder.stop();
                }
                setTimeout(() => {
                    if (!isRecordingRef.current || !streamRef.current) return;
                    const mime = mimeRef.current;
                    const newRecorder = new MediaRecorder(streamRef.current, {
                        mimeType: mime,
                        audioBitsPerSecond: 96_000,
                    });
                    newRecorder.ondataavailable = (e) => {
                        if (e.data?.size > 0) chunksRef.current.push(e.data);
                    };
                    chunksRef.current = [];
                    newRecorder.start(500);
                    recorderRef.current = newRecorder;
                }, 150);
            }
            const timeoutId = setTimeout(() => {
                pendingRef.current.delete(logIdx);
                setGooglePending((prev) => {
                    const next = new Set(prev);
                    next.delete(logIdx);
                    return next;
                });
            }, GOOGLE_TIMEOUT_MS);
            pendingRef.current.set(logIdx, timeoutId);
            uploadToGoogle(logIdx, audioSnapshot).then(() => {
                const tid = pendingRef.current.get(logIdx);
                if (tid !== undefined) {
                    clearTimeout(tid);
                    pendingRef.current.delete(logIdx);
                }
            });
        },
        [dbg, insertLog, updateAutoFill, uploadToGoogle],
    );

    // ── Web Speech API ────────────────────────────────────────────────────────
    const startWebSpeech = useCallback(() => {
        const SR =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;
        if (!SR) {
            dbg('Web Speech tidak tersedia', 'error');
            return;
        }
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'id-ID';
        rec.maxAlternatives = 1;
        rec.onstart = () => {
            wsRestartCountRef.current = 0;
            dbg('WS started', 'ws');
        };
        rec.onresult = (event: any) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const text = result[0].transcript.trim();
                if (!text) continue;
                if (result.isFinal) handleFinalTranscript(text);
                else interim += text;
            }
            setInterimText(interim);
        };
        rec.onerror = (e: any) => {
            if (e.error === 'no-speech' || e.error === 'aborted') return;
            if (e.error === 'not-allowed') {
                dbg('WS: izin mikrofon dicabut!', 'error');
                isRecordingRef.current = false;
                setIsRecording(false);
                return;
            }
            dbg(`WS error: ${e.error}`, 'error');
        };
        rec.onend = () => {
            if (!isRecordingRef.current) return;
            wsRestartCountRef.current += 1;
            if (wsRestartCountRef.current >= WS_MAX_RESTARTS) {
                if (!wsCooldownRef.current) {
                    wsCooldownRef.current = true;
                    wsRestartTimerRef.current = setTimeout(() => {
                        wsCooldownRef.current = false;
                        wsRestartCountRef.current = 0;
                        if (isRecordingRef.current) {
                            dbg('WS resume setelah cooldown', 'ws');
                            startInstance();
                        }
                    }, WS_COOLDOWN_MS);
                }
                return;
            }
            wsRestartTimerRef.current = setTimeout(() => {
                if (isRecordingRef.current) startInstance();
            }, WS_RESTART_DELAY);
        };
        recognitionRef.current = rec;
        function startInstance() {
            try {
                recognitionRef.current?.start();
            } catch {
                dbg('WS start skip', 'info');
            }
        }
        startInstance();
    }, [dbg, handleFinalTranscript]);

    // ── MediaRecorder ─────────────────────────────────────────────────────────
    const startMediaRecorder = useCallback(
        (stream: MediaStream, mime: string) => {
            mimeRef.current = mime;
            chunksRef.current = [];
            const rec = new MediaRecorder(stream, {
                mimeType: mime,
                audioBitsPerSecond: 96_000,
            });
            rec.ondataavailable = (e) => {
                if (e.data?.size > 0) chunksRef.current.push(e.data);
            };
            rec.start(500);
            recorderRef.current = rec;
        },
        [],
    );

    // ── Start / Stop ──────────────────────────────────────────────────────────
    const startRecording = async () => {
        const mime = pickMime();
        if (!mime) {
            alert(
                'Browser tidak mendukung WebM/Opus. Gunakan Chrome/Edge terbaru.',
            );
            return;
        }
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
        } catch (err) {
            alert(
                err instanceof DOMException && err.name === 'NotAllowedError'
                    ? 'Izin mikrofon ditolak. Aktifkan di pengaturan browser.'
                    : 'Gagal mengakses mikrofon.',
            );
            return;
        }
        streamRef.current = stream;
        isRecordingRef.current = true;
        wsRestartCountRef.current = 0;
        wsCooldownRef.current = false;
        setIsRecording(true);
        setInterimText('');
        setLogs([]);
        setTimer(0);
        setGooglePending(new Set());
        timerRef.current = setInterval(() => setTimer((t) => t + 1), 1_000);
        startMediaRecorder(stream, mime);
        startWebSpeech();
        fullChunksRef.current = [];
        const fullRec = new MediaRecorder(stream, {
            mimeType: mime,
            audioBitsPerSecond: 96_000,
        });
        fullRec.ondataavailable = (e) => {
            if (e.data.size > 0) fullChunksRef.current.push(e.data);
        };
        fullRec.onstop = () => {
            setFullAudioBlob(new Blob(fullChunksRef.current, { type: mime }));
        };
        fullRec.start();
        fullRecorderRef.current = fullRec;
        dbg('=== Recording dimulai (Hybrid Mode) ===', 'info');
    };

    const killAll = useCallback(() => {
        isRecordingRef.current = false;
        if (wsRestartTimerRef.current) {
            clearTimeout(wsRestartTimerRef.current);
            wsRestartTimerRef.current = null;
        }
        try {
            recognitionRef.current?.stop();
        } catch {}
        recognitionRef.current = null;
        if (recorderRef.current?.state !== 'inactive')
            recorderRef.current?.stop();
        recorderRef.current = null;
        chunksRef.current = [];
        if (fullRecorderRef.current?.state !== 'inactive')
            fullRecorderRef.current?.stop();
        fullRecorderRef.current = null;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        pendingRef.current.forEach((tid) => clearTimeout(tid));
        pendingRef.current.clear();
    }, []);

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

    // ── Simpan draft ──────────────────────────────────────────────────────────
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

            {/*
             * Mobile: full-screen, konten di-stack vertikal, mic di fixed bottom bar
             * Desktop: max-w-lg centered, scrollable
             */}
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

                        {/* Timer chip */}
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
                            {/* Status pill */}
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

                        {/* Rules indicator */}
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

                    {/* ── AUDIO VISUALIZER (saat merekam) ── */}
                    {isRecording && (
                        <div className="mb-4 flex items-center justify-center gap-0.5 rounded-2xl border border-red-100 bg-red-50 py-5 dark:border-red-900/20 dark:bg-red-950/20">
                            {Array.from({ length: 28 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 rounded-full bg-red-400 dark:bg-red-500"
                                    style={{
                                        height: `${Math.random() * 30 + 6}px`,
                                        animation: `pulse ${0.6 + Math.random() * 0.8}s ease-in-out infinite`,
                                        animationDelay: `${i * 0.05}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── TRANSKRIPSI CARD ── */}
                    <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                        {/* Header */}
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

                        {/* Log area */}
                        <div className="max-h-[45vh] min-h-[180px] overflow-y-auto p-4 md:max-h-[360px]">
                            {logs.length === 0 && !interimText ? (
                                /* Empty state */
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

                                    {/* Interim text */}
                                    {interimText && (
                                        <div className="flex items-start gap-2 rounded-xl border border-dashed border-gray-200 p-3 opacity-60 dark:border-zinc-700">
                                            <span className="mt-0.5 flex-shrink-0 font-mono text-[11px] text-gray-400">
                                                --:--
                                            </span>
                                            <span className="text-sm text-gray-500 italic dark:text-zinc-400">
                                                {interimText}...
                                            </span>
                                        </div>
                                    )}
                                    <div ref={logsEndRef} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── DEBUG PANEL ── */}
                    <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all dark:border-white/5 dark:bg-[#1C1F2A]">
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

                    {/* ── SPACER ── */}
                    {/* Tinggi spacer ditambah agar tidak tertutup action bar yang baru */}
                    <div className="h-32 md:h-0" />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
             * FIXED BOTTOM ACTION BAR
             * Mobile: always fixed at bottom, full width, above bottom nav
             * Desktop: static di dalam flow, max-w-lg centered
             * ══════════════════════════════════════════════════════════════════ */}
            {/* ══════════════════════════════════════════════════════════════════
             * FIXED BOTTOM ACTION BAR
             * Melayang di atas bottom nav mobile (bottom-24)
             * ══════════════════════════════════════════════════════════════════ */}
            <div className="fixed right-0 bottom-24 left-0 z-40 flex justify-center px-4 transition-all duration-300 md:relative md:bottom-auto md:mt-6 md:px-0">
                <div className="w-full max-w-lg rounded-[2rem] border border-white/60 bg-white/80 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none dark:border-white/10 dark:bg-[#1C1F2A]/90">
                    {/* Selesai & Simpan (setelah rekam berhenti) */}
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
                        /* Mic button */
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={toggleRecording}
                                aria-label={
                                    isRecording
                                        ? 'Hentikan rekaman'
                                        : 'Mulai rekaman'
                                }
                                className={`group relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 active:scale-95 ${
                                    isRecording
                                        ? 'bg-red-50 ring-4 ring-red-100 dark:bg-red-950/50 dark:ring-red-900/40'
                                        : 'bg-blue-600 shadow-blue-200/60 hover:bg-blue-700 hover:shadow-blue-300/60 dark:shadow-blue-900/30'
                                }`}
                            >
                                {isRecording ? (
                                    /* Stop square with gentle pulse */
                                    <div className="h-6 w-6 rounded-md bg-red-500 transition-transform group-hover:scale-110" />
                                ) : (
                                    /* Mic Icon */
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
