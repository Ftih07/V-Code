{{-- =========================================
     MOBILE FLOATING NAVBAR
========================================= --}}
<div
    x-data="{ current: window.location.pathname }"
    class="fixed bottom-5 left-0 right-0 z-[999] flex justify-center px-4 md:hidden"
    style="padding-bottom: env(safe-area-inset-bottom);"
>
    <nav
        class="
            flex items-center justify-around
            w-full max-w-sm
            h-[64px]
            px-3

            rounded-[2rem]
            border

            backdrop-blur-2xl

            bg-white/85
            border-white/60
            shadow-[0_8px_32px_rgba(15,23,42,0.12)]

            dark:bg-slate-900/85
            dark:border-slate-700/60
            dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]
        "
    >

        {{-- HOME --}}
        <a
            href="{{ url('/v-code-core') }}"
            class="flex flex-col items-center justify-center gap-1 w-14 transition-all duration-200"
            :class="current === '/v-code-core'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-400 dark:text-slate-500'"
        >
            <div
                class="p-2 rounded-2xl transition-all duration-200 flex items-center justify-center"
                :class="current === '/v-code-core'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/40'
                    : 'bg-transparent'"
            >
                <x-heroicon-o-home class="w-5 h-5" />
            </div>

            <span class="text-[10px] font-semibold leading-none">
                Home
            </span>
        </a>

        {{-- CODE BLUE --}}
        <a
            href="{{ url('/v-code-core/code-blue-sessions') }}"
            class="flex flex-col items-center justify-center gap-1 w-14 transition-all duration-200"
            :class="current.includes('code-blue-sessions')
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-400 dark:text-slate-500'"
        >
            <div
                class="p-2 rounded-2xl transition-all duration-200 flex items-center justify-center"
                :class="current.includes('code-blue-sessions')
                    ? 'bg-blue-600 dark:bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/40'
                    : 'bg-transparent'"
            >
                <x-heroicon-o-heart class="w-5 h-5" />
            </div>

            <span class="text-[10px] font-semibold leading-none">
                Code Blue
            </span>
        </a>

        {{-- PHRASES --}}
        <a
            href="{{ url('/v-code-core/medical-phrases') }}"
            class="flex flex-col items-center justify-center gap-1 w-14 transition-all duration-200"
            :class="current.includes('medical-phrase')
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-400 dark:text-slate-500'"
        >
            <div
                class="p-2 rounded-2xl transition-all duration-200 flex items-center justify-center"
                :class="current.includes('medical-phrase')
                    ? 'bg-blue-600 dark:bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/40'
                    : 'bg-transparent'"
            >
                <x-heroicon-o-book-open class="w-5 h-5" />
            </div>

            <span class="text-[10px] font-semibold leading-none">
                Phrases
            </span>
        </a>

        {{-- CORRECTIONS --}}
        <a
            href="{{ url('/v-code-core/word-corrections') }}"
            class="flex flex-col items-center justify-center gap-1 w-14 transition-all duration-200"
            :class="current.includes('word-correction')
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-400 dark:text-slate-500'"
        >
            <div
                class="p-2 rounded-2xl transition-all duration-200 flex items-center justify-center"
                :class="current.includes('word-correction')
                    ? 'bg-blue-600 dark:bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/40'
                    : 'bg-transparent'"
            >
                <x-heroicon-o-wrench-screwdriver class="w-5 h-5" />
            </div>

            <span class="text-[10px] font-semibold leading-none">
                Corrections
            </span>
        </a>

        {{-- RULES --}}
        <a
            href="{{ url('/v-code-core/classify-rules') }}"
            class="flex flex-col items-center justify-center gap-1 w-14 transition-all duration-200"
            :class="current.includes('classify-rule')
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-400 dark:text-slate-500'"
        >
            <div
                class="p-2 rounded-2xl transition-all duration-200 flex items-center justify-center"
                :class="current.includes('classify-rule')
                    ? 'bg-blue-600 dark:bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/40'
                    : 'bg-transparent'"
            >
                <x-heroicon-o-tag class="w-5 h-5" />
            </div>

            <span class="text-[10px] font-semibold leading-none">
                Rules
            </span>
        </a>

    </nav>
</div>