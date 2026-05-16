import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

type SessionLog = {
    time_mark: string;
    action_text: string;
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

                            setLogs((prev) => [
                                ...prev,
                                { time_mark: timeMark, action_text: text },
                            ]);
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

        router.post(
            '/record/store-draft',
            {
                patient_id: patient?.id,
                leader_name: leader_name, 
                team_members: team_members, 
                duration_seconds: timer,
                final_transcription: finalContent,
                logs: logs,
            },
            {
                onFinish: () => setIsProcessing(false),
            },
        );
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-50 px-2 py-4 sm:p-6">
            <Head title="Perekaman Code Blue" />

            <div className="flex h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between bg-blue-900 p-4 text-white">
                    <button onClick={() => window.history.back()}>
                        <svg
                            className="h-6 w-6"
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
                    <h1 className="text-lg font-bold">
                        V-CODE ({patient.name})
                    </h1>
                    <div className="w-6"></div>
                </div>

                <div className="flex flex-col items-center border-b border-gray-100 p-6">
                    <div className="mb-4 flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className={`h-3 w-3 rounded-full ${isRecording ? 'animate-pulse bg-red-500' : 'bg-gray-300'}`}
                            ></div>
                            <span className="text-sm font-semibold text-gray-700">
                                {isRecording ? 'Merekam...' : 'Siap Merekam'}
                            </span>
                        </div>
                        <span className="font-mono text-lg font-bold">
                            {formatTime(timer)}
                        </span>
                    </div>

                    {isRecording && (
                        <div className="flex h-12 items-center justify-center gap-1">
                            {[...Array(15)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 animate-pulse rounded-full bg-red-400"
                                    style={{
                                        height: `${Math.random() * 100 + 20}%`,
                                        animationDelay: `${i * 0.1}s`,
                                    }}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>{' '}
                        Transkripsi (Real-time)
                    </h3>

                    <div className="space-y-3">
                        {logs.map((log, idx) => (
                            <div key={idx} className="flex gap-3 text-sm">
                                <span className="w-16 shrink-0 font-mono text-gray-500">
                                    {log.time_mark}
                                </span>
                                <span className="font-medium text-blue-900">
                                    {log.action_text}
                                </span>
                            </div>
                        ))}

                        {interimTranscript && (
                            <div className="flex gap-3 text-sm opacity-50">
                                <span className="w-16 shrink-0 font-mono text-gray-500">
                                    --:--:--
                                </span>
                                <span className="text-gray-600 italic">
                                    {interimTranscript}...
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 bg-white p-4">
                    {!isRecording && timer > 0 ? (
                        <button
                            onClick={saveDraft}
                            disabled={isProcessing}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-bold text-white hover:bg-red-700"
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
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            {isProcessing
                                ? 'Menyimpan...'
                                : 'Selesai & Simpan Draft'}
                        </button>
                    ) : (
                        <div className="flex justify-center">
                            <button
                                onClick={toggleRecording}
                                className={`flex h-20 w-20 items-center justify-center rounded-full transition-all ${isRecording ? 'bg-red-100' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isRecording ? (
                                    <div className="h-8 w-8 rounded-sm bg-red-600"></div>
                                ) : (
                                    <svg
                                        className="h-10 w-10 text-white"
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
