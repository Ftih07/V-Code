import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import AppLayout from '@/layouts/new-app-layout';

export default function RecordSetup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        rm_number: '',
        ward_location: '',
        leader_name: '',
        team_members: '[]', // Kita set awal sebagai string JSON kosong
        incident_type: 'Henti Jantung (Cardiac Arrest)',
    });

    // State lokal untuk repeater tim
    const [team, setTeam] = useState([{ name: '', role: '' }]);

    // Sinkronisasi: Setiap kali `team` berubah, ubah jadi string JSON ke dalam useForm
    useEffect(() => {
        setData('team_members', JSON.stringify(team));
    }, [team]);

    const addTeamMember = () => setTeam([...team, { name: '', role: '' }]);

    const removeTeamMember = (index: number) => {
        if (team.length === 1) return; // Jangan hapus jika sisa 1
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
        // Validasi sederhana sebelum kirim
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

    return (
        <div className="relative flex min-h-screen items-start justify-center bg-slate-100 px-0 py-0 md:bg-slate-200/60 md:py-8 dark:bg-zinc-950">
            <Head title="Setup Code Blue - V-CODE" />

            <div className="absolute top-1/4 left-1/2 -z-10 hidden h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl md:block" />

            {/* Container Utama*/}
            <div className="flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-slate-50 md:max-h-[92vh] md:min-h-[800px] md:rounded-3xl md:border md:border-slate-200/80 md:shadow-2xl dark:bg-zinc-950 dark:md:border-zinc-800">
                <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-900 p-4 text-white shadow-md md:rounded-t-2xl">
                    <button
                        onClick={() => window.history.back()}
                        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-95"
                        type="button"
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
                    <h1 className="text-base font-bold tracking-wide">
                        Setup Code Blue
                    </h1>
                    <div className="w-9"></div>
                </div>

                <form
                    onSubmit={submit}
                    className="flex flex-1 flex-col space-y-5 overflow-y-auto px-5 py-6"
                >
                    {/* SEKSI 1: IDENTITAS PASIEN */}
                    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="border-b border-gray-50 pb-2 dark:border-zinc-800/50">
                            <h3 className="text-xs font-bold tracking-wider text-blue-900 uppercase dark:text-blue-400">
                                Data Pasien
                            </h3>
                        </div>

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
                                className="w-full rounded-xl border border-gray-200 bg-slate-50/50 p-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

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
                                className="w-full rounded-xl border border-gray-200 bg-slate-50/50 p-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                            />
                            {errors.rm_number && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {errors.rm_number}
                                </p>
                            )}
                        </div>

                        {/* INI KOTAK RUANGAN YANG KEMARIN KETIMPA/HILANG! */}
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
                                    setData('ward_location', e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 bg-slate-50/50 p-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                            />
                            {errors.ward_location && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {errors.ward_location}
                                </p>
                            )}
                        </div>

                        {/* INI KOTAK JENIS KEJADIAN */}
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
                                    setData('incident_type', e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 bg-slate-50/50 p-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                            />
                            {errors.incident_type && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {errors.incident_type}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* SEKSI 2: INFORMASI TIM PELAKSANA */}
                    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-2 dark:border-zinc-800/50">
                            <h3 className="text-xs font-bold tracking-wider text-blue-900 uppercase dark:text-blue-400">
                                Tim Code Blue
                            </h3>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                Leader (Dokter Jaga)
                            </label>
                            <input
                                type="text"
                                required
                                value={data.leader_name}
                                onChange={(e) =>
                                    setData('leader_name', e.target.value)
                                }
                                placeholder="Contoh: dr. Andi Pratama"
                                className="w-full rounded-xl border border-gray-200 bg-slate-50/50 p-3 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                            />
                            {errors.leader_name && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {errors.leader_name}
                                </p>
                            )}
                        </div>

                        {/* REPEATER ANGGOTA TIM */}
                        <div className="space-y-3 border-t border-gray-100 pt-2 dark:border-zinc-800">
                            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
                                Susunan Anggota Tim & Tugas
                            </label>

                            {team.map((member, index) => (
                                <div
                                    key={index}
                                    className="relative flex items-start gap-2"
                                >
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Nama Perawat..."
                                            value={member.name}
                                            onChange={(e) =>
                                                handleTeamChange(
                                                    index,
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-200 bg-slate-50/50 p-2 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Tugas (ex: Ventilasi / Kompresi)"
                                            value={member.role}
                                            onChange={(e) =>
                                                handleTeamChange(
                                                    index,
                                                    'role',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-200 bg-slate-50/50 p-2 text-sm text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeTeamMember(index)}
                                        disabled={team.length === 1}
                                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent"
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
                                                strokeWidth="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addTeamMember}
                                className="w-full rounded-xl border-2 border-dashed border-blue-200 py-2 text-xs font-bold tracking-wider text-blue-600 uppercase transition hover:bg-blue-50 dark:border-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            >
                                + Tambah Anggota
                            </button>
                        </div>
                    </div>

                    {/* Tombol Submit */}
                    <div className="mt-auto pt-4 pb-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/10 transition hover:from-blue-800 hover:to-indigo-800 active:scale-[0.98] disabled:opacity-60"
                        >
                            {processing
                                ? 'Memproses...'
                                : 'Mulai Perekaman Tindakan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

RecordSetup.layout = (page: React.ReactNode) => <AppLayout children={page} />;
