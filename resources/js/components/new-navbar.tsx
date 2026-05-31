import { Link, usePage } from '@inertiajs/react';

type NavbarProps = {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
};

export default function NewNavbar({
    isSidebarOpen,
    toggleSidebar,
    theme,
    toggleTheme,
}: NavbarProps) {
    const { url } = usePage();

    const navigationItems = [
        {
            name: 'Beranda',
            href: '/dashboard',
            icon: (
                <svg
                    className="h-5 w-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
        },
        {
            name: 'Riwayat',
            href: '/riwayat',
            icon: (
                <svg
                    className="h-5 w-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
        {
            name: 'Profil',
            href: '/settings/profile',
            icon: (
                <svg
                    className="h-5 w-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            ),
        },
    ];

    const isUrlActive = (href: string) => {
        const currentPath = url.split('?')[0];

        if (href === '/dashboard') {
return currentPath === '/dashboard' || currentPath === '/';
}

        if (href === '/riwayat') {
return currentPath === '/riwayat';
}

        if (href === '/settings/profile') {
return currentPath === '/settings/profile';
}

        return currentPath.startsWith(href);
    };

    return (
        <>
            {/* ── MOBILE TOP HEADER ── */}
            <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white/90 px-4 backdrop-blur-md transition-colors duration-300 md:hidden dark:border-white/5 dark:bg-[#141720]/90">
                {/* Kiri: Logo & Nama App */}
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
                        <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                        </svg>
                    </div>
                    <p className="text-sm font-black tracking-widest text-gray-900 dark:text-white">
                        V-CODE
                    </p>
                </div>

                {/* Kanan: Aksi (Theme & Logout) */}
                <div className="flex items-center gap-1">
                    {/* Theme Toggle Mobile */}
                    <button
                        onClick={toggleTheme}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-white/10"
                    >
                        {theme === 'light' ? (
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.75"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.75"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        )}
                    </button>

                    {/* Logout Mobile */}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </Link>
                </div>
            </header>

            {/* ── MOBILE BOTTOM FLOATING NAVBAR ── */}
            <div
                className="fixed right-0 bottom-5 left-0 z-[999] flex flex-col items-center px-4 md:hidden"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                {/* KAPSUL NAVBAR BAWAH */}
                <nav className="flex h-[64px] w-full max-w-sm items-center justify-around rounded-[2rem] border border-white/60 bg-white/85 px-6 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/85 dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
                    {navigationItems.map((item) => {
                        const active = isUrlActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                // Lebar dibesarkan (w-20) agar area tap lebih luas
                                className={`flex w-20 flex-col items-center justify-center gap-1 transition-all duration-200 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
                            >
                                <div
                                    className={`flex items-center justify-center rounded-2xl p-2 transition-all duration-200 ${active ? 'scale-110 bg-blue-600 text-white shadow-lg shadow-blue-200/50 dark:bg-blue-500 dark:shadow-blue-900/40' : 'bg-transparent'}`}
                                >
                                    {item.icon}
                                </div>
                                <span className="text-[10px] leading-none font-semibold">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* ── DESKTOP SIDEBAR (TIDAK ADA YANG DIUBAH) ── */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-gray-100 bg-white transition-all duration-300 ease-in-out md:flex dark:border-white/5 dark:bg-[#141720] ${isSidebarOpen ? 'w-64' : 'w-20'}`}
            >
                {/* Logo area */}
                <div
                    className={`flex h-16 flex-shrink-0 items-center border-b border-gray-100 px-4 dark:border-white/5 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}
                >
                    {isSidebarOpen && (
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
                                <svg
                                    className="h-4 w-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-black tracking-widest text-gray-900 dark:text-white">
                                    V-CODE
                                </p>
                                <p className="truncate text-[9px] font-bold tracking-[0.15em] text-blue-500 uppercase dark:text-blue-400">
                                    EMR Rumah Sakit
                                </p>
                            </div>
                        </div>
                    )}

                    {!isSidebarOpen && (
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
                            <svg
                                className="h-4 w-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                />
                            </svg>
                        </div>
                    )}

                    <button
                        onClick={toggleSidebar}
                        title={isSidebarOpen ? 'Tutup menu' : 'Buka menu'}
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300 ${isSidebarOpen ? '' : 'hidden'}`}
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    {!isSidebarOpen && (
                        <button
                            onClick={toggleSidebar}
                            title="Buka menu"
                            className="absolute top-1/2 -right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm hover:text-gray-600 dark:border-white/10 dark:bg-[#1C1F2A] dark:text-zinc-500 dark:hover:text-zinc-300"
                        >
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    {navigationItems.map((item) => {
                        const active = isUrlActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={!isSidebarOpen ? item.name : undefined}
                                className={`group flex items-center gap-3 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                                    isSidebarOpen
                                        ? 'px-3'
                                        : 'justify-center px-0'
                                } ${
                                    active
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200'
                                }`}
                            >
                                {active && isSidebarOpen && (
                                    <span className="absolute left-3 h-5 w-0.5 rounded-full bg-blue-500" />
                                )}
                                <span
                                    className={`flex-shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'}`}
                                >
                                    {item.icon}
                                </span>
                                {isSidebarOpen && (
                                    <span className="truncate">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions: Theme Toggle & Logout */}
                <div className="flex-shrink-0 space-y-1 border-t border-gray-100 p-3 dark:border-white/5">
                    <button
                        onClick={toggleTheme}
                        title={
                            !isSidebarOpen
                                ? theme === 'light'
                                    ? 'Mode Gelap'
                                    : 'Mode Terang'
                                : undefined
                        }
                        className={`group flex w-full items-center gap-3 rounded-xl py-2.5 text-sm font-semibold text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200 ${isSidebarOpen ? 'px-3' : 'justify-center px-0'}`}
                    >
                        <span className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 dark:text-zinc-500 dark:group-hover:text-zinc-300">
                            {theme === 'light' ? (
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            )}
                        </span>
                        {isSidebarOpen && (
                            <span>
                                {theme === 'light'
                                    ? 'Mode Gelap'
                                    : 'Mode Terang'}
                            </span>
                        )}
                    </button>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        title={!isSidebarOpen ? 'Keluar Sistem' : undefined}
                        className={`group flex w-full items-center gap-3 rounded-xl py-2.5 text-sm font-semibold text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 ${isSidebarOpen ? 'px-3' : 'justify-center px-0'}`}
                    >
                        <svg
                            className="h-5 w-5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        {isSidebarOpen && <span>Keluar Sistem</span>}
                    </Link>
                </div>
            </aside>
        </>
    );
}
