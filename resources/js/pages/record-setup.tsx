import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import ProductTour from '@/components/ProductTour';
import AppLayout from '@/layouts/new-app-layout';

// ─── Ikon tooltip ─────────────────────────────────────────────────────────────
const IconUser = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
    </svg>
);
const IconRM = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
    </svg>
);
const IconLocation = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
    </svg>
);
const IconIncident = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
    </svg>
);
const IconStart = () => (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

// ─── Konfigurasi Tour ─────────────────────────────────────────────────────────
const TOUR_STEPS = [
    {
        target: '.tour-field-name',
        title: 'Nama Pasien',
        content:
            'Isi nama lengkap pasien atau inisial. Bisa diisi "An." untuk anak-anak. Data ini akan muncul di laporan akhir.',
        icon: <IconUser />,
        placement: 'bottom' as const,
    },
    {
        target: '.tour-field-rm',
        title: 'No. Rekam Medis',
        content:
            'Nomor RM pasien sesuai sistem rumah sakit, misal "RM-102938". Digunakan untuk menghubungkan laporan ke data pasien.',
        icon: <IconRM />,
        placement: 'bottom' as const,
    },
    {
        target: '.tour-field-location',
        title: 'Ruangan / Lokasi',
        content:
            'Isi nama bangsal atau lokasi kejadian Code Blue berlangsung, misal "Bangsal Flamboyan Lt. 2". Penting untuk koordinasi tim.',
        icon: <IconLocation />,
        placement: 'bottom' as const,
    },
    {
        target: '.tour-field-incident',
        title: 'Jenis Kejadian',
        content:
            'Jenis kondisi darurat yang terjadi, misal "Henti Jantung", "Syok Anafilaktik", atau "Henti Napas". Ini akan menjadi judul laporan.',
        icon: <IconIncident />,
        placement: 'top' as const,
    },
    {
        target: '.tour-btn-submit',
        title: 'Mulai Perekaman',
        content:
            'Setelah semua data terisi, klik tombol ini. Rekaman dimulai seketika — timer langsung berjalan dan kamu bisa mencatat setiap tindakan.',
        icon: <IconStart />,
        placement: 'top' as const,
    },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function RecordSetup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        rm_number: '',
        ward_location: '',
        incident_type: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/record/setup');
    };

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20';

    return (
        <>
            <Head title="Setup Code Blue — V-Code" />

            {/*
                Tour untuk halaman Record Setup.
                startDelay 800ms — sedikit lebih lama karena ada animasi masuk form.
                storageKey berbeda dari dashboard agar tour ini independen.
            */}
            <ProductTour
                steps={TOUR_STEPS}
                storageKey="vcode_tour_record_setup"
                startDelay={800}
            />

            <div className="flex justify-center">
                <div className="w-full max-w-lg">
                    {/* ── PAGE HEADER ── */}
                    <div className="mb-6 flex items-center gap-3">
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
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                                Setup Code Blue
                            </h1>
                            <p className="text-xs text-gray-400 dark:text-zinc-500">
                                Isi data sebelum memulai perekaman
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-4">
                        {/* ── SEKSI: DATA PASIEN ── */}
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                            <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-3.5 dark:border-white/5">
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
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                    Data Pasien
                                </span>
                            </div>

                            <div className="space-y-4 p-5">
                                {/* Field: Nama — tour target di wrapper div biar spotlight mencakup label + input */}
                                <div className="tour-field-name">
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Nama Pasien / An.
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Masukkan nama pasien"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                    {errors.name && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Field: No. RM */}
                                <div className="tour-field-rm">
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        No. Rekam Medis
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: RM-102938"
                                        value={data.rm_number}
                                        onChange={(e) =>
                                            setData('rm_number', e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                    {errors.rm_number && (
                                        <p className="mt-1.5 text-xs font-semibold text-red-500">
                                            {errors.rm_number}
                                        </p>
                                    )}
                                </div>

                                {/* Field: Ruangan */}
                                <div className="tour-field-location">
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Ruangan / Lokasi Kejadian
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Bangsal Flamboyan"
                                        value={data.ward_location}
                                        onChange={(e) =>
                                            setData(
                                                'ward_location',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {errors.ward_location && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.ward_location}
                                        </p>
                                    )}
                                </div>

                                {/* Field: Jenis Kejadian */}
                                <div className="tour-field-incident">
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Jenis Kejadian
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Henti Jantung, Syok Anafilaktik, dll."
                                        value={data.incident_type}
                                        onChange={(e) =>
                                            setData(
                                                'incident_type',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {errors.incident_type && (
                                        <p className="mt-1.5 text-xs text-red-500">
                                            {errors.incident_type}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── SUBMIT — tour target di wrapper agar spotlight pas ── */}
                        <div className="tour-btn-submit">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200/60 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 dark:shadow-blue-900/30"
                            >
                                {processing
                                    ? 'Memproses...'
                                    : 'Mulai Perekaman Tindakan'}
                            </button>
                        </div>

                        <div className="h-4 md:hidden" />
                    </form>
                </div>
            </div>
        </>
    );
}

RecordSetup.layout = (page: React.ReactNode) => <AppLayout children={page} />;
