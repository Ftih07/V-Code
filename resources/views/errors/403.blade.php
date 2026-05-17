<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Akses Ditolak - V-CODE</title>
    @vite(['resources/css/app.css'])
</head>

<body class="bg-gray-50 flex items-center justify-center min-h-screen px-6 font-sans antialiased text-gray-900">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-center">
        <div class="bg-blue-900 py-10">
            <h1 class="text-8xl font-black text-white tracking-widest drop-shadow-md">403</h1>
        </div>

        <div class="p-8">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                    </path>
                </svg>
            </div>

            <h2 class="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h2>
            <p class="text-gray-500 mb-8 text-sm leading-relaxed">
                Maaf, Anda tidak memiliki izin (otorisasi) untuk mengakses halaman atau draf rekam medis ini.
            </p>

            <a href="{{ url('/dashboard') }}"
                class="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-md transition hover:bg-blue-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Kembali ke Dashboard
            </a>
        </div>
    </div>
</body>

</html>
