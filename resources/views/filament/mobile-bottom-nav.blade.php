{{-- =========================================
     MOBILE FLOATING NAVBAR (Stripe-Style Popup)
========================================= --}}
@php
    // 1. Ambil data hitungan untuk User (Pending / Total)
    $pendingUsersCount = \App\Models\User::whereNull('email_verified_at')->count();
    $totalUsersCount = \App\Models\User::count();

    // 2. Ambil data hitungan untuk Sesi Code Blue (Draft / Total)
    $draftSessionsCount = \App\Models\CodeBlueSession::where('status', 'draft')->count();
    $totalSessionsCount = \App\Models\CodeBlueSession::count();

    // 3. Ambil data hitungan total untuk Kamus DB & Konten (Langsung Angka Total)
    $wordCorrectionsCount = \App\Models\WordCorrection::count(); // Sesuaikan nama model kamu jika berbeda
    $classifyRulesCount = \App\Models\ClassifyRule::count(); // Sesuaikan nama model kamu jika berbeda
    $medicalPhrasesCount = \App\Models\MedicalPhrase::count(); // Sesuaikan nama model kamu jika berbeda
    $featuresCount = \App\Models\Feature::count();
    $faqsCount = \App\Models\Faq::count();
@endphp

<div x-data="{ current: window.location.pathname, showMenu: false }" @click.outside="showMenu = false"
    class="fixed bottom-5 left-0 right-0 z-[999] flex flex-col items-center px-4 md:hidden"
    style="padding-bottom: env(safe-area-inset-bottom);">

    {{-- ─── POPUP MENU (MUNCUL KE ATAS) ─── --}}
    <div x-show="showMenu" x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 translate-y-8 scale-95"
        x-transition:enter-end="opacity-100 translate-y-0 scale-100" x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100 translate-y-0 scale-100"
        x-transition:leave-end="opacity-0 translate-y-8 scale-95"
        class="mb-4 w-full max-w-sm rounded-[2rem] border border-white/60 bg-white/95 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/95 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        style="display:none;">

        <div class="grid grid-cols-2 gap-x-4 gap-y-8">

            {{-- =========================================
             KOLOM 1 : KAMUS DB
        ========================================= --}}
            <div class="flex flex-col gap-4">

                <span class="text-[10px] font-black tracking-widest uppercase text-slate-400">
                    Kamus DB
                </span>

                {{-- WORD CORRECTIONS --}}
                <a href="{{ url('/v-code-core/word-corrections') }}"
                    class="flex items-center justify-between rounded-xl px-2 py-1 transition-all duration-200"
                    :class="current.includes('word-correction') ?
                        'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'">

                    <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200"
                            :class="current.includes('word-correction') ?
                                'bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:bg-blue-500' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">

                            <x-heroicon-o-wrench-screwdriver class="h-4 w-4" />
                        </div>

                        <span class="text-sm font-semibold">Koreksi</span>
                    </div>

                    <span
                        class="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        {{ $wordCorrectionsCount }}
                    </span>
                </a>

                {{-- RULES --}}
                <a href="{{ url('/v-code-core/classify-rules') }}"
                    class="flex items-center justify-between rounded-xl px-2 py-1 transition-all duration-200"
                    :class="current.includes('classify-rule') ?
                        'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'">

                    <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200"
                            :class="current.includes('classify-rule') ?
                                'bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:bg-blue-500' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">

                            <x-heroicon-o-tag class="h-4 w-4" />
                        </div>

                        <span class="text-sm font-semibold">Rules</span>
                    </div>

                    <span
                        class="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        {{ $classifyRulesCount }}
                    </span>
                </a>

            </div>

            {{-- =========================================
             KOLOM 2 : SISTEM
        ========================================= --}}
            <div class="flex flex-col gap-4">

                <span class="text-[10px] font-black tracking-widest uppercase text-slate-400">
                    Sistem
                </span>

                {{-- USERS --}}
                <a href="{{ url('/v-code-core/users') }}"
                    class="flex items-center justify-between rounded-xl px-2 py-1 transition-all duration-200"
                    :class="current.includes('users') ?
                        'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'">

                    <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200"
                            :class="current.includes('users') ?
                                'bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:bg-blue-500' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">

                            <x-heroicon-o-users class="h-4 w-4" />
                        </div>

                        <span class="text-sm font-semibold">User</span>
                    </div>

                    <span
                        class="rounded-full px-1.5 py-0.5 text-[10px] font-bold shadow-sm ring-1 {{ $pendingUsersCount > 0 ? 'bg-red-50 text-red-600 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-900/30' : 'bg-emerald-50 text-emerald-600 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-900/30' }}">
                        {{ $pendingUsersCount }}/{{ $totalUsersCount }}
                    </span>
                </a>

                {{-- FEATURES --}}
                <a href="{{ url('/v-code-core/features') }}"
                    class="flex items-center justify-between rounded-xl px-2 py-1 transition-all duration-200"
                    :class="current.includes('features') ?
                        'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'">

                    <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200"
                            :class="current.includes('features') ?
                                'bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:bg-blue-500' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">

                            <x-heroicon-o-sparkles class="h-4 w-4" />
                        </div>

                        <span class="text-sm font-semibold">Fitur</span>
                    </div>

                    <span
                        class="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        {{ $featuresCount }}
                    </span>
                </a>

                {{-- FAQ --}}
                <a href="{{ url('/v-code-core/faqs') }}"
                    class="flex items-center justify-between rounded-xl px-2 py-1 transition-all duration-200"
                    :class="current.includes('faqs') ?
                        'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'">

                    <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200"
                            :class="current.includes('faqs') ?
                                'bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:bg-blue-500' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">

                            <x-heroicon-o-question-mark-circle class="h-4 w-4" />
                        </div>

                        <span class="text-sm font-semibold">FAQ</span>
                    </div>

                    <span
                        class="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        {{ $faqsCount }}
                    </span>
                </a>

            </div>

        </div>
    </div>

    {{-- ─── NAVBAR UTAMA ─── --}}
    <nav
        class="flex items-center justify-around w-full max-w-sm h-[64px] px-3 rounded-[2rem] border backdrop-blur-2xl bg-white/85 border-white/60 shadow-[0_8px_32px_rgba(15,23,42,0.12)] dark:bg-slate-900/85 dark:border-slate-700/60 dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
        {{-- HOME --}}
        <a href="{{ url('/v-code-core') }}"
            class="flex w-14 flex-col items-center justify-center gap-1 transition-all duration-200"
            :class="current === '/v-code-core' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'">
            <div class="flex items-center justify-center rounded-2xl p-2 transition-all duration-200"
                :class="current === '/v-code-core' ?
                    'scale-110 bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:bg-blue-500 dark:shadow-blue-900/40' :
                    'bg-transparent'">
                <x-heroicon-o-home class="h-5 w-5" />
            </div>
            <span class="text-[10px] font-semibold leading-none">Home</span>
        </a>

        {{-- CODE BLUE --}}
        <a href="{{ url('/v-code-core/code-blue-sessions') }}"
            class="flex w-14 flex-col items-center justify-center gap-1 transition-all duration-200"
            :class="current.includes('code-blue-sessions') ? 'text-blue-600 dark:text-blue-400' :
                'text-slate-400 dark:text-slate-500'">
            <div class="relative flex items-center justify-center rounded-2xl p-2 transition-all duration-200"
                :class="current.includes('code-blue-sessions') ?
                    'scale-110 bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:bg-blue-500 dark:shadow-blue-900/40' :
                    'bg-transparent'">
                <x-heroicon-o-heart class="h-5 w-5" />

                {{-- BADGE BARU UTAMA: Format Dinamis Permanen (Draft / Total) --}}
                <span
                    class="absolute -top-1.5 -right-3 flex h-4 min-w-[28px] items-center justify-center rounded-full px-1.5 text-[8px] font-black text-white shadow-sm ring-2 transition-all duration-200"
                    :class="current.includes('code-blue-sessions') ? 'ring-blue-600 dark:ring-blue-500' :
                        'ring-white dark:ring-slate-900'"
                    style="background-color: {{ $draftSessionsCount > 0 ? '#f59e0b' : '#10b981' }};">
                    {{ $draftSessionsCount }}/{{ $totalSessionsCount }}
                </span>
            </div>
            <span class="text-[10px] font-semibold leading-none">Sesi</span>
        </a>

        {{-- PHRASES --}}
        <a href="{{ url('/v-code-core/medical-phrases') }}"
            class="flex w-14 flex-col items-center justify-center gap-1 transition-all duration-200"
            :class="current.includes('medical-phrase') ? 'text-blue-600 dark:text-blue-400' :
                'text-slate-400 dark:text-slate-500'">
            <div class="relative flex items-center justify-center rounded-2xl p-2 transition-all duration-200"
                :class="current.includes('medical-phrase') ?
                    'scale-110 bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:bg-blue-500 dark:shadow-blue-900/40' :
                    'bg-transparent'">
                <x-heroicon-o-book-open class="h-5 w-5" />

                {{-- BADGE: Total Kamus Medis --}}
                <span
                    class="absolute -top-1 -right-2 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-blue-500 px-0.5 text-[8px] font-bold text-white"
                    :class="current.includes('medical-phrase') ? 'ring-2 ring-blue-600 dark:ring-blue-500' : ''">
                    {{ $medicalPhrasesCount }}
                </span>
            </div>
            <span class="text-[10px] font-semibold leading-none">Kamus</span>
        </a>

        {{-- MENU LAINNYA (TOGGLE POPUP) --}}
        <button type="button" @click="showMenu = !showMenu"
            class="flex w-14 flex-col items-center justify-center gap-1 transition-all duration-200"
            :class="(current.includes('users') || current.includes('word-correction') || current.includes('classify-rule') ||
                current.includes('faqs') || current.includes('features') || showMenu) ?
            'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'">
            <div class="relative flex items-center justify-center rounded-2xl p-2 transition-all duration-200"
                :class="(current.includes('users') || current.includes('word-correction') || current.includes(
                    'classify-rule') || current.includes('faqs') || current.includes('features') || showMenu) ?
                'scale-110 bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:bg-blue-500 dark:shadow-blue-900/40' :
                'bg-transparent'">
                <x-heroicon-o-squares-2x2 class="h-5 w-5" />

                {{-- BADGE GLOBAL UTAMA: Ikut Merespons Status Pengguna Baru --}}
                <span
                    class="absolute -top-1 -right-1 flex h-3.5 min-w-[28px] items-center justify-center rounded-full px-1 text-[8px] font-black text-white shadow-sm ring-2 transition-all duration-200"
                    :class="(current.includes('users') || showMenu) ? 'ring-blue-600 dark:ring-blue-500' :
                    'ring-white dark:ring-slate-900'"
                    style="background-color: {{ $pendingUsersCount > 0 ? '#ef4444' : '#10b981' }};">
                    {{ $pendingUsersCount }}/{{ $totalUsersCount }}
                </span>
            </div>
            <span class="text-[10px] font-semibold leading-none">Lainnya</span>
        </button>
    </nav>
</div>
