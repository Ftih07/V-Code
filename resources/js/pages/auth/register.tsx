import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar — V-Code" />

            {/* ── FULL PAGE WRAPPER ── */}
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
                    {/* Logo & Brand */}
                    <div className="mb-8 flex flex-col items-center gap-3">
                        {/* Logo mark */}
                        <div className="flex h-20 w-20 items-center justify-center">
                            {/* Pastikan path src mengarah ke file gambar logo yang benar di folder public */}
                            <img
                                src="/apple-touch-icon.png"
                                alt="V-Code Logo"
                                className="h-full w-full object-contain drop-shadow-sm"
                            />
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

                    {/* Form Card */}
                    <div className="rounded-3xl border border-gray-100 bg-white px-6 py-7 shadow-xl shadow-gray-100/80 dark:border-white/[0.06] dark:bg-[#1C1F2A] dark:shadow-none">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Buat akun baru
                            </h2>
                            <p className="mt-1 text-sm text-gray-400 dark:text-zinc-500">
                                Isi data berikut untuk mendaftar
                            </p>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={[
                                'password',
                                'password_confirmation',
                            ]}
                            disableWhileProcessing
                            className="flex flex-col gap-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Name */}
                                    <div className="flex flex-col gap-1.5">
                                        <Label
                                            htmlFor="name"
                                            className="text-sm font-semibold text-gray-700 dark:text-zinc-300"
                                        >
                                            Nama lengkap
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            placeholder="dr. Nama Lengkap"
                                            className="h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-1.5">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-semibold text-gray-700 dark:text-zinc-300"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            placeholder="email@rumahsakit.com"
                                            className="h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-semibold text-gray-700 dark:text-zinc-300"
                                        >
                                            Password
                                        </Label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            passwordrules={passwordRules}
                                            className="h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="text-sm font-semibold text-gray-700 dark:text-zinc-300"
                                        >
                                            Konfirmasi password
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            passwordrules={passwordRules}
                                            className="h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20"
                                        />
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                        />
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        className="mt-2 h-11 w-full rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-200/60 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200/80 active:scale-[0.98] disabled:opacity-70 dark:shadow-blue-900/30 dark:hover:shadow-blue-900/50"
                                        tabIndex={5}
                                        data-test="register-user-button"
                                    >
                                        {processing && (
                                            <Spinner className="mr-2 h-4 w-4" />
                                        )}
                                        Buat akun
                                    </Button>

                                    {/* Divider */}
                                    <div className="relative flex items-center gap-3">
                                        <div className="h-px flex-1 bg-gray-100 dark:bg-white/10" />
                                        <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:text-zinc-600">
                                            atau
                                        </span>
                                        <div className="h-px flex-1 bg-gray-100 dark:bg-white/10" />
                                    </div>

                                    {/* Google OAuth */}
                                    <a
                                        href="/auth/google/redirect"
                                        tabIndex={6}
                                        className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/10"
                                    >
                                        <svg
                                            className="h-4 w-4 flex-shrink-0"
                                            viewBox="0 0 488 512"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fill="#4285F4"
                                                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                            />
                                        </svg>
                                        Daftar dengan Google
                                    </a>

                                    {/* Login link */}
                                    <p className="text-center text-sm text-gray-500 dark:text-zinc-500">
                                        Sudah punya akun?{' '}
                                        <TextLink
                                            href={login()}
                                            tabIndex={7}
                                            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Masuk sekarang
                                        </TextLink>
                                    </p>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Footer note */}
                    <p className="mt-6 text-center text-[11px] text-gray-400 dark:text-zinc-600">
                        Digunakan hanya untuk keperluan klinis internal
                    </p>
                </div>
            </div>
        </>
    );
}

Register.layout = (page: React.ReactNode) => <>{page}</>;
