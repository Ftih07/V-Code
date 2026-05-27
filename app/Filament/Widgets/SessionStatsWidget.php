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

    protected function getColumns(): int
    {
        return 5;
    }

    protected function getStats(): array
    {
        $totalSesi = CodeBlueSession::count();

        $menunggu = CodeBlueSession::where(
            'status',
            'draft'
        )->count();

        $terfinalisasi = CodeBlueSession::where(
            'status',
            'finalized'
        )->count();

        $hariIni = CodeBlueSession::whereDate(
            'created_at',
            today()
        )->count();

        $mingguIni = CodeBlueSession::whereBetween(
            'created_at',
            [
                now()->startOfWeek(),
                now()->endOfWeek(),
            ]
        )->count();

        $avgDurasi = CodeBlueSession::whereNotNull(
            'duration_seconds'
        )->avg('duration_seconds');

        $avgMenit = $avgDurasi
            ? round($avgDurasi / 60, 1)
            : 0;

        return [

            Stat::make(
                'Total Sesi',
                number_format($totalSesi)
            )
                ->description('Semua waktu')
                ->descriptionIcon('heroicon-m-heart')

                ->chart([7, 12, 10, 18, 15, 20, 24])

                ->color('primary'),

            Stat::make(
                'Hari Ini',
                number_format($hariIni)
            )
                ->description(
                    "Minggu ini: {$mingguIni}"
                )

                ->descriptionIcon('heroicon-m-calendar')

                ->chart([2, 4, 5, 3, 7, 6, 8])

                ->color('info'),

            Stat::make(
                'Menunggu',
                number_format($menunggu)
            )
                ->description('Belum validasi')

                ->descriptionIcon('heroicon-m-clock')

                ->chart([4, 5, 3, 7, 6, 5, 4])

                ->color('warning'),

            Stat::make(
                'Final',
                number_format($terfinalisasi)
            )
                ->description('Sudah valid')

                ->descriptionIcon(
                    'heroicon-m-check-circle'
                )

                ->chart([1, 3, 5, 8, 12, 15, 18])

                ->color('success'),

            Stat::make(
                'Avg Durasi',
                "{$avgMenit} menit"
            )
                ->description('Rata-rata sesi')

                ->descriptionIcon('heroicon-m-bolt')

                ->chart([5, 6, 8, 6, 7, 9, 10])

                ->color('gray'),

        ];
    }
}