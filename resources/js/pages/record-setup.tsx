import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function RecordSetup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        rm_number: '',
        ward_location: '',
        leader_name: '',
        team_members: '', 
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/record/setup');
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-6">
            <Head title="Setup Code Blue - V-CODE" />

            <div className="flex w-full max-w-md flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
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
                    <h1 className="text-lg font-bold">Setup Code Blue</h1>
                    <div className="w-6"></div>
                </div>

                <form
                    onSubmit={submit}
                    className="h-[80vh] space-y-4 overflow-y-auto p-6"
                >
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Nama Pasien / An.
                        </label>
                        <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            No. Rekam Medis
                        </label>
                        <input
                            type="text"
                            required
                            value={data.rm_number}
                            onChange={(e) =>
                                setData('rm_number', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Ruangan Kejadian
                        </label>
                        <input
                            type="text"
                            required
                            value={data.ward_location}
                            onChange={(e) =>
                                setData('ward_location', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900"
                        />
                    </div>

                    <hr className="my-4" />
                    <h3 className="font-bold text-gray-800">
                        Informasi Tim Code Blue
                    </h3>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Leader (Dokter)
                        </label>
                        <input
                            type="text"
                            required
                            value={data.leader_name}
                            onChange={(e) =>
                                setData('leader_name', e.target.value)
                            }
                            placeholder="Contoh: dr. Andi Pratama"
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Anggota Tim (Pisahkan dengan koma)
                        </label>
                        <textarea
                            required
                            value={data.team_members}
                            onChange={(e) =>
                                setData('team_members', e.target.value)
                            }
                            placeholder="Contoh: Ns. Budi Santoso, Ns. Dwi Lestari"
                            className="h-24 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        Lanjut ke Perekaman
                    </button>
                </form>
            </div>
        </div>
    );
}
