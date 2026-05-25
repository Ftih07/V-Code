import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import AppLayout from '@/layouts/new-app-layout';

export default function RecordSetup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        rm_number: '',
        ward_location: '',
        leader_name: '',
        team_members: '[]',
        incident_type: '',
    });

    const [team, setTeam] = useState([{ name: '', role: '' }]);

    useEffect(() => {
        setData('team_members', JSON.stringify(team));
    }, [team]);

    const addTeamMember = () => setTeam([...team, { name: '', role: '' }]);

    const removeTeamMember = (index: number) => {
        if (team.length === 1) return;
        const newTeam = [...team];
        newTeam.splice(index, 1);
        setTeam(newTeam);
    };

    const handleTeamChange = (
        index: number,
        field: 'name' | 'role',
        value: string,
    ) => {
        const newTeam = [...team];
        newTeam[index][field] = value;
        setTeam(newTeam);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const isTeamValid = team.every(
            (member) => member.name.trim() !== '' && member.role.trim() !== '',
        );
        if (!isTeamValid) {
            alert(
                'Mohon lengkapi nama dan tugas semua anggota tim, atau hapus baris yang kosong.',
            );
            return;
        }
        post('/record/setup');
    };

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20';

    return (
        <>
            <Head title="Setup Code Blue — V-Code" />

            {/* Full page wrapper — sits inside AppLayout main */}
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
                        {/* ── SEKSI 1: DATA PASIEN ── */}
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                            {/* Section header */}
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
                                {/* Nama Pasien */}
                                <div>
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
                                        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                                            <svg
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* No. RM */}
                                <div>
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
                                        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                                            <svg
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {errors.rm_number}
                                        </p>
                                    )}
                                </div>

                                {/* Ruangan */}
                                <div>
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
                                        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                                            <svg
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {errors.ward_location}
                                        </p>
                                    )}
                                </div>

                                {/* Jenis Kejadian */}
                                <div>
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
                                        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                                            <svg
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {errors.incident_type}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── SEKSI 2: TIM CODE BLUE ── */}
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                            {/* Section header */}
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
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                    Tim Code Blue
                                </span>
                            </div>

                            <div className="space-y-4 p-5">
                                {/* Leader */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Leader (Dokter Jaga)
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <svg
                                                className="h-4 w-4 text-gray-400 dark:text-zinc-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={data.leader_name}
                                            onChange={(e) =>
                                                setData(
                                                    'leader_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: dr. Andi Pratama"
                                            className={`${inputClass} pl-9`}
                                        />
                                    </div>
                                    {errors.leader_name && (
                                        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                                            <svg
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {errors.leader_name}
                                        </p>
                                    )}
                                </div>

                                {/* Repeater Anggota Tim */}
                                <div className="space-y-2 border-t border-gray-100 pt-4 dark:border-white/5">
                                    <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                        Susunan Anggota Tim &amp; Tugas
                                    </label>

                                    <div className="space-y-2.5">
                                        {team.map((member, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-2.5"
                                            >
                                                {/* Nomor urut */}
                                                <div className="flex h-8 w-7 flex-shrink-0 items-center justify-center pt-1">
                                                    <span className="text-xs font-bold text-gray-300 tabular-nums dark:text-zinc-600">
                                                        {String(
                                                            index + 1,
                                                        ).padStart(2, '0')}
                                                    </span>
                                                </div>

                                                {/* Inputs */}
                                                <div className="flex flex-1 flex-col gap-1.5">
                                                    <input
                                                        type="text"
                                                        placeholder="Nama anggota tim..."
                                                        value={member.name}
                                                        onChange={(e) =>
                                                            handleTeamChange(
                                                                index,
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={inputClass}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Tugas (cth: Ventilasi / Kompresi)"
                                                        value={member.role}
                                                        onChange={(e) =>
                                                            handleTeamChange(
                                                                index,
                                                                'role',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={inputClass}
                                                    />
                                                </div>

                                                {/* Hapus */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeTeamMember(index)
                                                    }
                                                    disabled={team.length === 1}
                                                    className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-gray-300 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300 dark:text-zinc-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                                    aria-label="Hapus anggota"
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tambah anggota */}
                                    <button
                                        type="button"
                                        onClick={addTeamMember}
                                        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 py-2.5 text-xs font-bold tracking-wider text-blue-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-500/20 dark:text-blue-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10"
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
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        Tambah Anggota
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── SUBMIT ── */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200/60 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 dark:shadow-blue-900/30"
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="h-4 w-4 animate-spin"
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
                                    Memproses...
                                </>
                            ) : (
                                <>
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
                                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                        />
                                    </svg>
                                    Mulai Perekaman Tindakan
                                </>
                            )}
                        </button>

                        {/* Bottom spacer for mobile nav */}
                        <div className="h-4 md:hidden" />
                    </form>
                </div>
            </div>
        </>
    );
}

RecordSetup.layout = (page: React.ReactNode) => <AppLayout children={page} />;
