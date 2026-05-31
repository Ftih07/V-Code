import type { PropsWithChildren } from 'react';
import { useState, useEffect } from 'react';
import NewNavbar from '@/components/new-navbar';

export default function AppLayout({ children }: PropsWithChildren) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 1. Inisialisasi state sekaligus mengecek localStorage
    // Kalau tidak ada riwayat, otomatis default ke 'light'
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');

            if (savedTheme === 'dark') {
                return 'dark';
            }
        }

        return 'light'; // Default ke Light Mode!
    });

    // 2. Gunakan useEffect HANYA untuk mengubah class HTML di DOM
    // Ini berjalan secara otomatis setiap kali state 'theme' berubah
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // 3. Fungsi toggle jadi lebih bersih
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        // DOM HTML akan otomatis ter-update oleh useEffect di atas
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
