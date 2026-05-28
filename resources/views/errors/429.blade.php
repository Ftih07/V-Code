<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Terlalu Banyak Permintaan - V-CODE</title>
    @vite(['resources/css/app.css'])
</head>
<body class="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10 font-sans antialiased">

    <div class="w-full max-w-sm">

        {{-- Card Utama --}}
        <div class="overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100">

            {{-- Header Biru dengan Nomor Error --}}
            <div class="relative bg-blue-900 px-6 pt-10 pb-16 text-center overflow-hidden">
                {{-- Decorative circles --}}
                <div class="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-blue-800/50"></div>
                <div class="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-blue-800/40"></div>
                <div class="absolute top-4 right-8 h-10 w-10 rounded-full bg-blue-700/40"></div>

                <p class="relative z-10 text-xs font-semibold tracking-widest text-blue-300 uppercase mb-1">V-CODE EMR</p>
                <h1 class="relative z-10 text-8xl font-black text-white tracking-tight leading-none drop-shadow-sm">429</h1>

                {{-- Wave bottom --}}
                <div class="absolute bottom-0 left-0 right-0 h-8 bg-white" style="border-radius: 100% 100% 0 0;"></div>
            </div>

            {{-- Konten --}}
            <div class="px-6 pb-8 pt-2 text-center">
                {{-- Icon Badge --}}
                <div class="mx-auto -mt-1 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 shadow-sm">
                    <svg class="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h2 class="text-xl font-bold text-gray-900 mb-1">Sistem Sibuk</h2>
                <p class="text-gray-500 text-sm leading-relaxed mb-7 max-w-xs mx-auto">
                    Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu beberapa detik sebelum menekan tombol lagi.
                </p>

                <a href="{{ url('/dashboard') }}"
                    class="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-900 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-800 active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Dashboard
                </a>
            </div>
        </div>

        <p class="mt-5 text-center text-xs text-gray-400">V-CODE · Sistem Dokumentasi Code Blue</p>
    </div>

</body>
</html>