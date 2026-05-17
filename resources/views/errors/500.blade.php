<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Server Error - V-CODE</title>
    @vite(['resources/css/app.css'])
</head>

<body class="bg-gray-50 flex items-center justify-center min-h-screen px-6 font-sans antialiased text-gray-900">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-center">
        <div class="bg-blue-900 py-10">
            <h1 class="text-8xl font-black text-white tracking-widest drop-shadow-md">500</h1>
        </div>

        <div class="p-8">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                    </path>
                </svg>
            </div>

            <h2 class="text-2xl font-bold text-gray-800 mb-2">Gangguan Server</h2>
            <p class="text-gray-500 mb-8 text-sm leading-relaxed">
                Waduh! Terjadi kesalahan internal pada sistem. Tim teknis sedang berusaha memperbaikinya. Silakan coba
                lagi nanti.
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
