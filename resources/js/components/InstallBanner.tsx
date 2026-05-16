import { useState, useEffect } from 'react';

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Tangkap event bawaan browser saat aplikasi siap di-install
        const handler = (e: Event) => {
            e.preventDefault(); // Cegah browser memunculkan popup bawaannya sendiri
            setDeferredPrompt(e); // Simpan event-nya buat dipanggil nanti
            setShowBanner(true); // Tampilkan UI popup buatan kita
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Panggil popup install asli milik sistem operasi
        deferredPrompt.prompt();

        // Tunggu user milih "Install" atau "Cancel"
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowBanner(false); // Sembunyikan banner kalau sukses
        }
        setDeferredPrompt(null);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed right-4 bottom-6 left-4 z-50 flex animate-bounce items-center justify-between rounded-2xl border border-blue-700 bg-blue-900 p-4 text-white shadow-2xl">
            <div>
                <p className="text-sm font-bold">Install V-CODE 🚀</p>
                <p className="mt-1 text-xs text-blue-200">
                    Akses cepat dari Home Screen HP
                </p>
            </div>
            <button
                onClick={handleInstall}
                className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-blue-900 shadow-md hover:bg-gray-100"
            >
                Install
            </button>
        </div>
    );
}
