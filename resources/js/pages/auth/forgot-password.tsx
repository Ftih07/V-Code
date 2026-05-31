import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email as emailRoute } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa Password — V-Code" />

            {/* ── FULL PAGE WRAPPER ── */}
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-[#0F1117]">
                {/* ── BACKGROUND DECORATION ── */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40 dark:bg-[radial-gradient(#334155_1px,transparent_1px)] dark:opacity-30" />
                <div
                    className="pointer-events-none absolute inset-x-0 top-10 h-48 overflow-hidden opacity-[0.05] dark:opacity-[0.03]"
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
                            strokeWidth="4"
                        />
                    </svg>
                </div>
                <div
                    className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-blue-200/50 blur-[100px] dark:bg-blue-900/20"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-red-200/30 blur-[100px] dark:bg-red-900/10"
                    aria-hidden="true"
                />

                {/* ── CARD ── */}
                <div className="relative w-full max-w-[400px]">
                    {/* Logo & Brand */}
                    <div className="mb-8 flex flex-col items-center gap-3">
                        <div className="flex h-20 w-20 items-center justify-center">
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
                                Lupa Password?
                            </h2>
                            <p className="mt-1 text-sm text-gray-400 dark:text-zinc-500">
                                Masukkan email Anda. Kami akan mengirimkan
                                tautan untuk mengatur ulang password.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                {status}
                            </div>
                        )}

                        <Form
                            {...emailRoute.form()}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="flex flex-col gap-1.5">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-semibold text-gray-700 dark:text-zinc-300"
                                        >
                                            Alamat Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="off"
                                            autoFocus
                                            placeholder="email@rumahsakit.com"
                                            className="h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-blue-500 dark:focus:bg-white/10 dark:focus:ring-blue-500/20"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 h-11 w-full rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md shadow-blue-200/60 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200/80 active:scale-[0.98] disabled:opacity-70 dark:shadow-blue-900/30 dark:hover:shadow-blue-900/50"
                                        disabled={processing}
                                        data-test="email-password-reset-link-button"
                                    >
                                        {processing && (
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Kirim Tautan Reset
                                    </Button>

                                    <div className="mt-1 text-center text-sm text-gray-500 dark:text-zinc-500">
                                        <span>Kembali ke halaman </span>
                                        <TextLink
                                            href={login()}
                                            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Masuk
                                        </TextLink>
                                    </div>
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

ForgotPassword.layout = (page: React.ReactNode) => <>{page}</>;
