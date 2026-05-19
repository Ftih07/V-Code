<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Terlalu Banyak Permintaan - V-CODE</title>
    @vite(['resources/css/app.css'])
</head>

<body class="bg-gray-50 flex items-center justify-center min-h-screen px-6 font-sans antialiased text-gray-900">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-center">
        
        <div class="bg-blue-900 pt-12 pb-14 relative overflow-hidden">
            <div class="absolute -bottom-10 left-0 right-0 h-16 bg-white rounded-[100%] scale-x-120"></div>
            
            <h1 class="text-7xl font-black text-white tracking-widest relative z-10 drop-shadow-sm">429</h1>
        </div>

        <div class="p-8 pt-4 relative z-20">
            <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>

            <h2 class="text-2xl font-bold text-gray-800 mb-2">Sistem Sibuk</h2>
            <p class="text-gray-500 mb-8 text-sm leading-relaxed">
                Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu beberapa detik sebelum menekan tombol lagi.
            </p>

            <a href="{{ url('/dashboard') }}"
                class="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg">
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