import { PropsWithChildren, useState, useEffect } from 'react';
import NewNavbar from '@/components/new-navbar';

export default function AppLayout({ children }: PropsWithChildren) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Cek preferensi tema saat komponen pertama kali dimuat
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            setTheme('light');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] transition-colors duration-300 dark:bg-[#0F1117]">
            <NewNavbar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            <main
                className={`pt-16 pb-20 transition-all duration-300 ease-in-out md:pt-0 md:pb-0 ${
                    isSidebarOpen ? 'md:pl-64' : 'md:pl-20'
                }`}
            >
                <div className="min-h-screen p-4 md:p-6 lg:p-8">
                    <div className="mx-auto w-full max-w-6xl">{children}</div>
                </div>
            </main>
        </div>
    );
}
