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

// ─── [BARU] Type untuk classify rules dari DB ─────────────────────────────────
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

// ─── [BARU] Fallback rules jika API classify-rules tidak bisa diakses ─────────
// Dipakai hanya jika fetch ke /record/classify-rules gagal (misalnya offline).

const FALLBACK_CLASSIFY_RULES: ClassifyRule[] = [
    // EVALUASI — priority 10
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
    // PENGKAJIAN — priority 20
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

// ─── [BARU] Fungsi classify dynamic (pakai rules dari DB/fallback) ─────────────
// Diletakkan di luar component agar tidak re-create setiap render.

function classifyWithRules(
    text: string,
    rules: ClassifyRule[],
): { category: string; targetField: keyof AutoFillData | null } {
    // Jika rules belum dimuat, langsung pakai fallback
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
            default: // 'contains'
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

// ─── Utilitas lainnya (tidak berubah) ────────────────────────────────────────

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
        if (wordsB.has(w)) same++;
    });
    const similarity = same / Math.max(wordsA.size, wordsB.size);

    return similarity >= 0.5;
}

function pickMime(): string | null {
    return (
        ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'].find(
            (m) => MediaRecorder.isTypeSupported(m),
        ) ?? null
    );
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

    // [BARU] State untuk classify rules dari DB
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

    // [BARU] Ref untuk classify rules — agar handleFinalTranscript selalu pakai
    // versi terbaru tanpa perlu di-include ke dependency array useCallback
    const classifyRulesRef = useRef<ClassifyRule[]>([]);

    // Web Speech
    const recognitionRef = useRef<any>(null);
    const wsRestartCountRef = useRef(0);
    const wsRestartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const wsCooldownRef = useRef(false);

    // MediaRecorder (untuk Google STT)
    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const mimeRef = useRef<string>('');

    // MediaRecorder (untuk VN Full)
    const fullRecorderRef = useRef<MediaRecorder | null>(null);
    const fullChunksRef = useRef<Blob[]>([]);
    const [fullAudioBlob, setFullAudioBlob] = useState<Blob | null>(null);

    // Pending Google requests
    const pendingRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
        new Map(),
    );

    // Timer utama
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Sync refs ─────────────────────────────────────────────────────────────
    useEffect(() => {
        autoFillRef.current = autoFill;
    }, [autoFill]);

    // [BARU] Sync classifyRulesRef setiap state berubah
    useEffect(() => {
        classifyRulesRef.current = classifyRules;
    }, [classifyRules]);

    // ── Init ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        // Set waktu awal
        const hms = new Date()
            .toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })
            .replace(/\./g, ':');
        setAutoFill((p) => ({ ...p, ttv_time: hms }));

        // [BARU] Fetch classify rules dari web route (bukan api.php)
        // Route: GET /record/classify-rules → CodeBlueController@classifyRules
        axios
            .get('/record/classify-rules')
            .then((res) => {
                const sorted = (res.data as ClassifyRule[]).sort(
                    (a, b) => a.priority - b.priority,
                );
                setClassifyRules(sorted);
                classifyRulesRef.current = sorted;
                console.log(
                    '[V-CODE] Classify rules loaded:',
                    sorted.length,
                    'rules',
                );
            })
            .catch((err) => {
                console.warn(
                    '[V-CODE] Gagal fetch classify rules, pakai fallback:',
                    err,
                );
                // Fallback sudah di-set by default (array kosong → classifyWithRules pakai FALLBACK)
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
                    type: type,
                    message: msg,
                })
                .catch((err) => {
                    console.error('Gagal mengirim debug log ke server', err);
                });
        },
        [patient.id],
    );

    // ── AutoFill ──────────────────────────────────────────────────────────────
    const updateAutoFill = useCallback(
        (field: keyof AutoFillData, text: string, isCorrection = false) => {
            setAutoFill((prev) => {
                const existing = prev[field] as string;

                if (!existing) {
                    return { ...prev, [field]: text };
                }

                const entries = existing.split('. ');
                const last = entries[entries.length - 1];

                if (isCorrection) {
                    if (isRefinement(last, text)) {
                        entries[entries.length - 1] = text;
                        return { ...prev, [field]: entries.join('. ') };
                    }
                }

                if (isRefinement(last, text)) {
                    entries[entries.length - 1] =
                        text.length >= last.length ? text : last;
                    return { ...prev, [field]: entries.join('. ') };
                }

                return { ...prev, [field]: existing + '. ' + text };
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

            const kb = (blob.size / 1024).toFixed(0);
            const ext = mime.includes('ogg') ? 'ogg' : 'webm';
            dbg(`Kirim ${kb}KB → Google (log #${logIdx})`, 'send');

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
                        `[${ms}ms] Ditolak (Confidence ${Math.round(confidence * 100)}% < 72%): "${text}" (WS diselamatkan)`,
                        'error',
                    );
                    return;
                }

                const confLabel = `[${Math.round(confidence * 100)}%]`;
                dbg(
                    `[${ms}ms] Google ${confLabel}: "${text}" (Diterima)`,
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
                if (field) updateAutoFill(field, text);
            } catch (err) {
                const msg = axios.isAxiosError(err)
                    ? `HTTP ${err.response?.status ?? err.message}`
                    : String(err);
                dbg(`Google error: ${msg}`, 'error');
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

            // [PERUBAHAN] Gunakan classifyWithRules + classifyRulesRef.current
            // Sebelumnya: const { category, targetField } = classify(text);
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

                    dbg('MediaRecorder restarted (fresh header)', 'info');
                }, 150);
            }

            const timeoutId = setTimeout(() => {
                pendingRef.current.delete(logIdx);
                setGooglePending((prev) => {
                    const next = new Set(prev);
                    next.delete(logIdx);
                    return next;
                });
                dbg(`Google timeout log #${logIdx} — pertahankan WS`, 'info');
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
                if (result.isFinal) {
                    handleFinalTranscript(text);
                } else {
                    interim += text;
                }
            }
            setInterimText(interim);
        };

        rec.onerror = (e: any) => {
            if (e.error === 'no-speech') return;
            if (e.error === 'aborted') return;
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
                    dbg(
                        `WS cooldown ${WS_COOLDOWN_MS}ms (${wsRestartCountRef.current}x restart)`,
                        'info',
                    );
                    wsRestartTimerRef.current = setTimeout(() => {
                        wsCooldownRef.current = false;
                        wsRestartCountRef.current = 0;
                        if (isRecordingRef.current) {
                            dbg('WS resume setelah cooldown', 'ws');
                            startWebSpeechInstance();
                        }
                    }, WS_COOLDOWN_MS);
                }
                return;
            }

            wsRestartTimerRef.current = setTimeout(() => {
                if (isRecordingRef.current) startWebSpeechInstance();
            }, WS_RESTART_DELAY);
        };

        recognitionRef.current = rec;

        function startWebSpeechInstance() {
            try {
                recognitionRef.current?.start();
            } catch (err) {
                dbg('WS start skip (already running)', 'info');
            }
        }

        startWebSpeechInstance();
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
            dbg('MediaRecorder continuous (500ms slice)', 'info');
        },
        [dbg],
    );

    // ── Start / Stop recording ────────────────────────────────────────────────
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
            const finalBlob = new Blob(fullChunksRef.current, { type: mime });
            setFullAudioBlob(finalBlob);
        };

        fullRec.start();
        fullRecorderRef.current = fullRec;

        dbg('=== Recording dimulai (Hybrid Mode + Full Audio) ===', 'info');
    };

    const killAll = useCallback(() => {
        isRecordingRef.current = false;

        if (wsRestartTimerRef.current) {
            clearTimeout(wsRestartTimerRef.current);
            wsRestartTimerRef.current = null;
        }

        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch {
                /* ignore */
            }
            recognitionRef.current = null;
        }

        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
            recorderRef.current.stop();
        }
        recorderRef.current = null;
        chunksRef.current = [];

        if (
            fullRecorderRef.current &&
            fullRecorderRef.current.state !== 'inactive'
        ) {
            fullRecorderRef.current.stop();
        }
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

    // ── Style helpers ─────────────────────────────────────────────────────────
    const fmt = (s: number) =>
        `${Math.floor(s / 60)
            .toString()
            .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const catStyle = (c: string) => {
        if (c === 'pengkajian')
            return 'border-l-4 border-blue-500 bg-blue-50/80 dark:border-blue-500 dark:bg-blue-900/20';
        if (c === 'evaluasi')
            return 'border-l-4 border-purple-500 bg-purple-50/80 dark:border-purple-500 dark:bg-purple-900/20';
        return 'border-l-4 border-emerald-500 bg-emerald-50/80 dark:border-emerald-500 dark:bg-emerald-900/20';
    };

    const badgeStyle = (c: string) => {
        if (c === 'pengkajian')
            return 'bg-blue-200 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300';
        if (c === 'evaluasi')
            return 'bg-purple-200 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300';
        return 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300';
    };

    const debugColor = (type: DebugEntry['type']) => {
        if (type === 'result') return 'text-green-400';
        if (type === 'send') return 'text-blue-400';
        if (type === 'silence') return 'text-gray-500';
        if (type === 'error') return 'text-red-400';
        if (type === 'ws') return 'text-yellow-400';
        return 'text-gray-400';
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex min-h-screen items-start justify-center bg-slate-200 md:py-8 dark:bg-zinc-900">
            <Head title="Perekaman Code Blue" />

            <div className="flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-slate-100 md:max-h-[90vh] md:min-h-[850px] md:rounded-3xl md:border md:border-slate-200 md:shadow-2xl dark:bg-zinc-950 dark:md:border-zinc-800">
                {/* ── Header ── */}
                <div className="sticky top-0 z-10 flex items-center gap-3 bg-blue-900 px-4 py-3 shadow-md md:rounded-t-2xl">
                    <button
                        onClick={() => window.history.back()}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95"
                        aria-label="Kembali"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <h1 className="flex-1 text-center text-base font-bold tracking-wide text-white">
                        V-CODE
                    </h1>
                    {isRecording || timer > 0 ? (
                        <span
                            className={`font-mono text-sm font-bold ${isRecording ? 'text-red-300' : 'text-gray-300'}`}
                        >
                            {fmt(timer)}
                        </span>
                    ) : (
                        <div className="h-9 w-9" />
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
                    {/* ── Info Pasien ── */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-zinc-900">
                        <div className="flex items-start gap-4 p-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-900">
                                <svg
                                    className="h-8 w-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold tracking-widest text-blue-900 uppercase dark:text-blue-400">
                                    Code Blue · Hybrid STT
                                </p>
                                <h2 className="mt-0.5 truncate text-base font-bold text-gray-900 dark:text-white">
                                    {patient.name}
                                </h2>
                                <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                                    Web Speech + Google STT koreksi medis
                                    {/* [BARU] Tampilkan indikator rules loaded */}
                                    {classifyRules.length > 0 && (
                                        <span className="ml-1 text-green-500">
                                            · {classifyRules.length} rules
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5 dark:border-zinc-800">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                Status
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`h-2 w-2 rounded-full ${isRecording ? 'animate-pulse bg-red-500' : 'bg-emerald-400'}`}
                                />
                                <span
                                    className={`text-xs font-semibold ${isRecording ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                                >
                                    {isRecording
                                        ? `Merekam · ${fmt(timer)}`
                                        : 'Siap Merekam'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Visualizer ── */}
                    {isRecording && (
                        <div className="flex items-center justify-center gap-0.5 rounded-2xl bg-red-50 py-4 dark:bg-red-950/20">
                            {Array.from({ length: 20 }).map((_, i) => (
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

                    {/* ── Log Transkripsi ── */}
                    <div className="flex min-h-[200px] flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-zinc-900">
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

                        <div className="flex-1 overflow-y-auto p-4">
                            {logs.length === 0 && !interimText ? (
                                <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                                        <svg
                                            className="h-6 w-6 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Tekan mikrofon untuk mulai
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                                        Muncul instan · koreksi medis otomatis
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {logs.map((log, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex flex-col gap-1.5 rounded-xl px-3 py-2.5 shadow-sm transition-all duration-300 dark:bg-zinc-800/40 ${catStyle(log.category)}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">
                                                    {log.time_mark}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    {googlePending.has(idx) && (
                                                        <span
                                                            className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"
                                                            title="Menunggu koreksi Google STT"
                                                        />
                                                    )}
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${badgeStyle(log.category)}`}
                                                    >
                                                        {log.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-sm leading-snug font-medium text-gray-800 dark:text-gray-100">
                                                {log.action_text}
                                            </span>
                                        </div>
                                    ))}

                                    {interimText && (
                                        <div className="flex gap-3 rounded-xl border border-dashed border-gray-200 px-3 py-2.5 opacity-60 dark:border-zinc-700">
                                            <span className="mt-0.5 w-16 shrink-0 font-mono text-xs text-gray-400">
                                                --:--
                                            </span>
                                            <span className="text-sm text-gray-500 italic dark:text-gray-400">
                                                {interimText}...
                                            </span>
                                        </div>
                                    )}
                                    <div ref={logsEndRef} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Debug Panel ── */}
                    <div className="overflow-hidden rounded-2xl bg-zinc-900 shadow-sm dark:bg-zinc-950">
                        <button
                            onClick={() => setShowDebug((v) => !v)}
                            className="flex w-full items-center justify-between px-4 py-2.5"
                        >
                            <span className="font-mono text-xs font-bold tracking-widest text-zinc-400 uppercase">
                                Hybrid STT Log
                            </span>
                            <div className="flex items-center gap-2">
                                {debugLogs.length > 0 && (
                                    <span className="rounded-full bg-zinc-700 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                                        {debugLogs.length}
                                    </span>
                                )}
                                <div
                                    className={`h-2.5 w-2.5 rounded-full ${
                                        isRecording
                                            ? debugLogs[debugLogs.length - 1]
                                                  ?.type === 'error'
                                                ? 'bg-red-500'
                                                : 'bg-green-400'
                                            : 'bg-zinc-600'
                                    }`}
                                />
                            </div>
                        </button>

                        {showDebug && (
                            <div className="max-h-48 overflow-y-auto border-t border-zinc-800 px-4 py-3">
                                {debugLogs.length === 0 ? (
                                    <p className="font-mono text-xs text-zinc-600">
                                        Belum ada aktivitas...
                                    </p>
                                ) : (
                                    <div className="space-y-0.5">
                                        {debugLogs.map((e, i) => (
                                            <div
                                                key={i}
                                                className="flex gap-2 font-mono text-xs"
                                            >
                                                <span className="shrink-0 text-zinc-600">
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

                    {/* ── Tombol Aksi ── */}
                    <div className="mt-auto pt-2 pb-2">
                        {!isRecording && timer > 0 ? (
                            <button
                                onClick={saveDraft}
                                disabled={isProcessing}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 text-base font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-95 disabled:opacity-60"
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
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Selesai & Simpan Draft
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
                                    className={`flex h-20 w-20 items-center justify-center rounded-full shadow-md transition-all active:scale-90 ${
                                        isRecording
                                            ? 'bg-red-100 ring-4 ring-red-200 dark:bg-red-950 dark:ring-red-900'
                                            : 'bg-blue-900 hover:bg-blue-800'
                                    }`}
                                >
                                    {isRecording ? (
                                        <div className="h-7 w-7 rounded-md bg-red-600" />
                                    ) : (
                                        <svg
                                            className="h-9 w-9 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={1.8}
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
                                <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                    {isRecording
                                        ? 'Ketuk untuk berhenti'
                                        : 'Tekan untuk mulai merekam'}
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
