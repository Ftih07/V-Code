import { PropsWithChildren, useState } from 'react';
import NewNavbar from '@/components/new-navbar';

export default function AppLayout({ children }: PropsWithChildren) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
            <NewNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> 
            
            <main className={`p-2 md:p-6 pb-14 md:pb-6 transition-all duration-300 ${isSidebarOpen ? 'md:pl-68' : 'md:pl-24'}`}>
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}