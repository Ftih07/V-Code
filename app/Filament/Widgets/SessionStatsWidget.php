<?php

namespace App\Filament\Widgets;

use App\Models\CodeBlueSession;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

/**
 * Widget statistik ringkasan di atas tabel monitoring.
 *
 * Cara pakai (opsional):
 * Di ListCodeBlueSessions.php, uncomment:
 *   protected function getHeaderWidgets(): array {
 *       return [\App\Filament\Widgets\SessionStatsWidget::class];
 *   }
 *
 * Atau daftarkan secara global di AdminPanelProvider.php:
 *   ->widgets([SessionStatsWidget::class])
 */
class SessionStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    // Auto-refresh tiap 30 detik (sama dengan polling tabel)
    protected ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        $totalSesi = CodeBlueSession::count();
        $menunggu = CodeBlueSession::where('status', 'draft')->count();
        $terfinalisasi = CodeBlueSession::where('status', 'finalized')->count();
        $hariIni = CodeBlueSession::whereDate('created_at', today())->count();
        $mingguIni = CodeBlueSession::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count();

        $avgDurasi = CodeBlueSession::whereNotNull('duration_seconds')->avg('duration_seconds');
        $avgMenit = $avgDurasi ? round($avgDurasi / 60, 1) : 0;

        return [
            Stat::make('Total Sesi Code Blue', $totalSesi)
                ->description('Semua waktu')
                ->descriptionIcon('heroicon-o-heart')
                ->color('danger'),

            Stat::make('Hari Ini', $hariIni)
                ->description("Minggu ini: {$mingguIni} sesi")
                ->descriptionIcon('heroicon-o-calendar')
                ->color('info'),

            Stat::make('Menunggu Validasi DPJP', $menunggu)
                ->description('Status Draft')
                ->descriptionIcon('heroicon-o-clock')
                ->color('warning'),

            Stat::make('Terfinalisasi', $terfinalisasi)
                ->description('Sudah divalidasi')
                ->descriptionIcon('heroicon-o-check-circle')
                ->color('success'),

            Stat::make('Rata-rata Durasi', "{$avgMenit} menit")
                ->description('Per sesi resusitasi')
                ->descriptionIcon('heroicon-o-clock')
                ->color('gray'),
        ];
    }
}
