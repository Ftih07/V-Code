<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- ─── PRIMARY META TAGS ─── -->
        <title inertia>V-CODE — Dokumentasi Code Blue Berbasis Suara</title>
        <meta name="title" content="V-CODE — Dokumentasi Code Blue Berbasis Suara">
        <meta name="description" content="Sistem PWA Hybrid Speech-to-Text untuk rekam medis Code Blue. Dokumentasi otomatis secara real-time. Fokus pada pasien, bukan pada formulir.">

        <!-- ─── OPEN GRAPH / WHATSAPP / FACEBOOK ─── -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url('/') }}">
        <meta property="og:title" content="V-CODE — Dokumentasi Code Blue Berbasis Suara">
        <meta property="og:description" content="Sistem PWA Hybrid Speech-to-Text untuk rekam medis Code Blue. Dokumentasi otomatis secara real-time. Fokus pada pasien, bukan pada formulir.">
        <!-- Gambar harus absolute URL, menggunakan helper asset() bawaan Laravel -->
        <meta property="og:image" content="{{ asset('apple-touch-icon-background.png') }}">

        <!-- ─── TWITTER ─── -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url('/') }}">
        <meta property="twitter:title" content="V-CODE — Dokumentasi Code Blue Berbasis Suara">
        <meta property="twitter:description" content="Sistem PWA Hybrid Speech-to-Text untuk rekam medis Code Blue. Dokumentasi otomatis secara real-time. Fokus pada pasien, bukan pada formulir.">
        <meta property="twitter:image" content="{{ asset('apple-touch-icon-background.png') }}">

        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#1e3a8a">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>    
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
