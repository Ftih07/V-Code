import { Head } from '@inertiajs/react';

export default function VerifyEmail() {
    return (
        <>
            <Head title="Menunggu Approval — V-Code" />

            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-[#0F1117]">
                {/* ── BACKGROUND DECORATION ── */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-48 overflow-hidden opacity-[0.07] dark:opacity-[0.04]"
                    aria-hidden="true"
                >
                    <svg
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        className="h-full w-full"
                    >
                        <path
                            d="M0 60 L200 60 L230 60 L240 20 L255 100 L265 20 L275 100 L285 60 L300 60 L500 60 L530 60 L540 20 L555 100 L565 20 L575 100 L585 60 L600 60 L800 60 L830 60 L840 20 L855 100 L865 20 L875 100 L885 60 L900 60 L1200 60"
                            fill="none"
                            stroke="#2563EB"
                            strokeWidth="3"
                        />
                    </svg>
                </div>
                <div
                    className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-900/20"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-blue-50/80 blur-3xl dark:bg-blue-950/30"
                    aria-hidden="true"
                />

                {/* ── CARD ── */}
                <div className="relative w-full max-w-[400px]">
                    {/* Logo */}
                    <div className="mb-8 flex flex-col items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
                            <svg
                                className="h-7 w-7 text-white"
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
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                                V-Code
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                                Dokumentasi Code Blue digital
                            </p>
                        </div>
                    </div>

                    {/* Main card */}
                    <div className="rounded-3xl border border-gray-100 bg-white px-6 py-8 text-center shadow-xl shadow-gray-100/80 dark:border-white/[0.06] dark:bg-[#1C1F2A] dark:shadow-none">
                        {/* Animated waiting icon */}
                        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                            {/* Outer pulse ring */}
                            <span className="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-30 dark:bg-blue-500/20" />
                            {/* Middle ring */}
                            <span className="absolute inset-2 rounded-full bg-blue-50 dark:bg-blue-500/10" />
                            {/* Icon */}
                            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                                <svg
                                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Status pill */}
                        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-600 uppercase dark:bg-amber-500/10 dark:text-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                            Menunggu persetujuan
                        </span>

                        <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
                            Akun Anda sedang ditinjau
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                            Terima kasih telah mendaftar di V-Code. Demi menjaga
                            keamanan data EMR, akun Anda saat ini sedang dalam
                            proses peninjauan oleh Administrator.
                        </p>

                        {/* Info steps */}
                        <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left dark:border-white/[0.05] dark:bg-white/[0.03]">
                            <p className="mb-3 text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-zinc-600">
                                Proses selanjutnya
                            </p>
                            <div className="flex flex-col gap-3">
                                {/* Step 1 */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                            1
                                        </span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-gray-600 dark:text-zinc-400">
                                        Admin akan memverifikasi identitas dan
                                        hak akses Anda
                                    </p>
                                </div>
                                {/* Step 2 */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                            2
                                        </span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-gray-600 dark:text-zinc-400">
                                        Setelah disetujui, Anda bisa langsung
                                        masuk ke sistem
                                    </p>
                                </div>
                                {/* Step 3 */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                            3
                                        </span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-gray-600 dark:text-zinc-400">
                                        Muat ulang halaman ini untuk mengecek
                                        status terkini
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA button */}
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-200/60 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200/80 active:scale-[0.98] dark:shadow-blue-900/30 dark:hover:shadow-blue-900/50"
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Muat Ulang Halaman
                        </button>
                    </div>

                    <p className="mt-6 text-center text-[11px] text-gray-400 dark:text-zinc-600">
                        Digunakan hanya untuk keperluan klinis internal
                    </p>
                </div>
            </div>
        </>
    );
}

VerifyEmail.layout = (page: React.ReactNode) => <>{page}</>;
