import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/new-app-layout';
import { send } from '@/routes/verification';

const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props as any;

    // Avatar initials
    const initials = (auth.user.name as string)
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0])
        .join('')
        .toUpperCase();

    return (
        <>
            <Head title="Profil — V-Code" />

            <div className="flex justify-center">
                <div className="flex w-full max-w-lg flex-col gap-5">
                    {/* ── PAGE HEADER ── */}
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                            Profil
                        </h1>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">
                            Kelola informasi akun Anda
                        </p>
                    </div>

                    {/* ── AVATAR CARD ── */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-[#1C1F2A]">
                        <div className="flex items-center gap-4 p-5">
                            {/* Avatar circle */}
                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-200/50 dark:shadow-blue-900/30">
                                <span className="text-xl font-black text-white">
                                    {initials}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-base font-black text-gray-900 dark:text-white">
                                    {auth.user.name}
                                </p>
                                <p className="truncate text-sm text-gray-400 dark:text-zinc-500">
                                    {auth.user.email}
                                </p>
                                {auth.user.email_verified_at ? (
                                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <svg
                                            className="h-2.5 w-2.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Email terverifikasi
                                    </span>
                                ) : (
                                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                        <svg
                                            className="h-2.5 w-2.5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Belum diverifikasi
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── FORM: INFO PROFIL ── */}
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
                            <div>
                                <p className="text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                    Informasi Profil
                                </p>
                                <p className="text-[11px] text-gray-400 dark:text-zinc-500">
                                    Perbarui nama dan alamat email
                                </p>
                            </div>
                        </div>

                        <Form
                            {...ProfileController.update.form()}
                            options={{ preserveScroll: true }}
                            className="space-y-4 p-5"
                        >
                            {({
                                processing,
                                errors,
                            }: {
                                processing: boolean;
                                errors: any;
                            }) => (
                                <>
                                    {/* Nama */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300"
                                        >
                                            Nama Lengkap
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
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
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                autoComplete="name"
                                                defaultValue={auth.user.name}
                                                placeholder="Nama lengkap"
                                                className={`${inputClass} pl-10`}
                                            />
                                        </div>
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
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-zinc-300"
                                        >
                                            Alamat Email
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
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
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                autoComplete="username"
                                                defaultValue={auth.user.email}
                                                placeholder="Alamat email"
                                                className={`${inputClass} pl-10`}
                                            />
                                        </div>
                                        {errors.email && (
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
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </p>
                                        )}
                                    </div>

                                    {/* Verifikasi email */}
                                    {mustVerifyEmail &&
                                        auth.user.email_verified_at ===
                                            null && (
                                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-800/40 dark:bg-amber-500/10">
                                                <p className="text-xs text-amber-700 dark:text-amber-400">
                                                    Email Anda belum
                                                    terverifikasi.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="font-bold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-300"
                                                    >
                                                        Kirim ulang email
                                                        verifikasi
                                                    </Link>
                                                </p>
                                                {status ===
                                                    'verification-link-sent' && (
                                                    <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                        ✓ Link verifikasi telah
                                                        dikirim ke email Anda.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                    {/* Submit */}
                                    <div className="pt-1">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200/50 transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 dark:shadow-blue-900/20"
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
                                                    Menyimpan...
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
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    Simpan Perubahan
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Bottom spacer for mobile */}
                    <div className="h-4 md:h-0" />
                </div>
            </div>
        </>
    );
}

Profile.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
