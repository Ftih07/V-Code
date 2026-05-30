<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\Feature;
use Illuminate\Database\Seeder;

class LandingPageSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. SEEDER FAQ ──────────────────────────────────────────
        $faqs = [
            [
                'question' => 'Apa itu V-Code?',
                'answer' => 'V-Code adalah sistem dokumentasi Code Blue berbasis suara yang dirancang untuk tenaga medis. Dengan teknologi Speech-to-Text hybrid (Web Speech API + Google STT), V-Code merekam dan mengklasifikasikan setiap tindakan secara real-time — tanpa perlu mengetik satu kata pun di tengah resusitasi.',
                'is_active' => true,
            ],
            [
                'question' => 'Apakah V-Code aman untuk data pasien?',
                'answer' => 'Ya. V-Code berjalan di infrastruktur rumah sakit Anda sendiri (on-premise) dan tidak mengirim data identitas pasien ke pihak ketiga. Transmisi audio ke Google STT hanya berisi segmen suara pendek tanpa konteks identitas.',
                'is_active' => true,
            ],
            [
                'question' => 'Perangkat apa yang didukung?',
                'answer' => 'V-Code dioptimalkan untuk smartphone Android dan iOS (Safari). Fitur perekaman terbaik tersedia di Chrome/Edge terbaru pada Android. iOS mendukung mode panduan Add to Home Screen untuk pengalaman seperti aplikasi native.',
                'is_active' => true,
            ],
            [
                'question' => 'Bagaimana akurasi transkripsi medisnya?',
                'answer' => 'V-Code menggunakan sistem Hybrid STT: Web Speech API untuk kecepatan real-time, lalu Google STT untuk koreksi istilah medis. Kata-kata seperti "ROSC", "defibrilasi", "epinefrin", dan "GCS" dikenali dengan akurasi tinggi melalui classify rules yang dapat dikustomisasi per institusi.',
                'is_active' => true,
            ],
            [
                'question' => 'Apakah dokumentasi bisa langsung masuk ke EMR?',
                'answer' => 'Setelah perekaman selesai, draft dokumen dapat direview, diedit, dan difinalisasi oleh DPJP. Sistem mendukung integrasi ke EMR rumah sakit melalui modul Review yang sudah menyediakan format standar pengkajian, tindakan, dan evaluasi.',
                'is_active' => true,
            ],
            [
                'question' => 'Apakah bisa digunakan tanpa koneksi internet?',
                'answer' => 'Mode dasar Web Speech API bekerja secara lokal di browser. Koreksi Google STT dan penyimpanan draft membutuhkan koneksi internet. Untuk area dengan sinyal tidak stabil, V-Code tetap mencatat transkripsi via Web Speech.',
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }

        // ─── 2. SEEDER FEATURES ─────────────────────────────────────
        $features = [
            [
                'title' => 'Rekam Suara Real-time',
                'desc' => 'Tidak perlu mengetik. Cukup bicara — V-Code mendengar, memahami, dan mencatat setiap tindakan resusitasi secara otomatis.',
                'color' => 'blue',
                'order' => 1,
                'icon_svg' => '<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>',
            ],
            [
                'title' => 'Klasifikasi Otomatis',
                'desc' => 'Setiap ucapan dikategorikan — pengkajian, tindakan, atau evaluasi — dengan rules yang bisa dikustomisasi sesuai protokol RS Anda.',
                'color' => 'emerald',
                'order' => 2,
                'icon_svg' => '<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>',
            ],
            [
                'title' => 'Koreksi Medis Cerdas',
                'desc' => 'Hybrid STT menggabungkan kecepatan Web Speech dengan akurasi Google STT untuk terminologi medis yang tepat.',
                'color' => 'purple',
                'order' => 3,
                'icon_svg' => '<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>',
            ],
            [
                'title' => 'Draft & Review EMR',
                'desc' => 'Setelah sesi, dokter dapat mereview, mengedit, dan memfinalisasi dokumen sebelum masuk ke sistem EMR rumah sakit.',
                'color' => 'amber',
                'order' => 4,
                'icon_svg' => '<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>',
            ],
            [
                'title' => 'Mobile-First PWA',
                'desc' => 'Bisa diinstall di Android & iOS seperti aplikasi native. Antarmuka dioptimalkan untuk digunakan satu tangan di situasi darurat.',
                'color' => 'blue',
                'order' => 5,
                'icon_svg' => '<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
            ],
            [
                'title' => 'Data Aman & Privat',
                'desc' => 'Berjalan di infrastruktur rumah sakit sendiri. Tidak ada data pasien yang keluar ke pihak ketiga tanpa persetujuan.',
                'color' => 'emerald',
                'order' => 6,
                'icon_svg' => '<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>',
            ],
        ];

        foreach ($features as $feature) {
            Feature::create($feature);
        }
    }
}
