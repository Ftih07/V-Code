import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const listeners = new Set<() => void>();
let currentAppearance: Appearance = 'light'; // Default dipaksa jadi light

// Matikan deteksi Dark Mode bawaan OS/Windows
const prefersDark = (): boolean => {
    return false;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') {
        return 'light';
    }
    // 👇 GANTI KEY: Sekarang membaca dari 'theme', bukan 'appearance'
    return (localStorage.getItem('theme') as Appearance) || 'light';
};

const isDarkMode = (appearance: Appearance): boolean => {
    // Hanya akan gelap jika user eksplisit milih 'dark'
    return appearance === 'dark';
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') {
        return;
    }
    const isDark = isDarkMode(appearance);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    // 👇 GANTI KEY: Cek dan set default menggunakan 'theme'
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'light');
        setCookie('theme', 'light'); // Set cookie juga pakai key 'theme'
    }

    currentAppearance = getStoredAppearance();
    applyTheme(currentAppearance);
}

export function useAppearance(): UseAppearanceReturn {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'light',
    );

    const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance)
        ? 'dark'
        : 'light';

    const updateAppearance = (mode: Appearance): void => {
        currentAppearance = mode;

        // 👇 GANTI KEY: Menyimpan perubahan ke 'theme'
        localStorage.setItem('theme', mode);
        setCookie('theme', mode);

        applyTheme(mode);
        notify();
    };

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
