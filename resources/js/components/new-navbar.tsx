import { Link, usePage } from '@inertiajs/react';

type Session = {
    id: number;
    status: string;
    created_at: string;
};

type NavbarProps = {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
};

export default function newNavbar({ isSidebarOpen, toggleSidebar }: NavbarProps) {
    const { url, props } = usePage();

    const sessions = (props.sessions as Session[] || []);

    const lastDraftSession = sessions
        .filter((session) => session.status === 'draft')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    const draftLink = lastDraftSession ? `/draft/${lastDraftSession.id}` : '/dashboard';

    const navigationItems = [
        {
            name: 'Beranda',
            href: '/dashboard',
            icon: (
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            ),
        },
        {
            name: 'Riwayat',
            href: '/riwayat',
            icon: (
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            name: 'Profil',
            href: '/settings/profile',
            icon: (
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
    ];

    const isUrlActive = (href: string) => {
        if (href === '/dashboard') return url === '/dashboard' || url === '/';
        if (href === '/riwayat') return url === '/riwayat';
        if (href === '/settings/profile') return url === '/settings/profile';
        return url.startsWith(href);
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white px-4 pb-safe-bottom md:hidden dark:border-zinc-800 dark:bg-zinc-900">
                <nav className="flex h-16 items-center justify-around">
                    {navigationItems.map((item) => {
                        const active = isUrlActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-0.5 w-20 h-full transition-colors ${
                                    active
                                        ? 'text-blue-600 font-bold dark:text-blue-400'
                                        : 'text-gray-400 font-medium hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                                }`}
                            >
                                <div className={active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-zinc-500'}>
                                    {item.icon}
                                </div>
                                <span className="text-[11px] tracking-wide">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <aside className={`fixed bottom-0 top-0 left-0 z-40 hidden flex-col border-r border-gray-100 bg-white p-5 md:flex transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className={`flex items-center mb-8 pt-2 ${isSidebarOpen ? 'justify-between px-2' : 'justify-center'}`}>
                    {isSidebarOpen && (
                        <div>
                            <h2 className="text-xl font-black tracking-wider text-gray-800 dark:text-zinc-100">V-CODE</h2>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400">EMR Rumah Sakit</p>
                        </div>
                    )}
                    <button onClick={toggleSidebar} className="rounded-xl p-2 text-gray-500 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-800">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 space-y-1.5">
                    {navigationItems.map((item) => {
                        const active = isUrlActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={!isSidebarOpen ? item.name : undefined}
                                className={`flex items-center gap-3.5 rounded-xl py-3 text-sm font-bold transition-all duration-200 ${isSidebarOpen ? 'px-4 justify-start' : 'justify-center'} ${
                                    active
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200'
                                }`}
                            >
                                <div className={active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-zinc-500'}>
                                    {item.icon}
                                </div>
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        title={!isSidebarOpen ? 'Keluar Sistem' : undefined}
                        className={`flex w-full items-center gap-3.5 rounded-xl py-3 text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left dark:text-zinc-400 dark:hover:bg-red-950/20 dark:hover:text-red-400 ${isSidebarOpen ? 'px-4 justify-start' : 'justify-center'}`}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {isSidebarOpen && <span>Keluar Sistem</span>}
                    </Link>
                </div>
            </aside>
        </>
    );
}