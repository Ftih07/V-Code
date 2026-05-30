<?php

namespace App\Filament\Resources\CodeBlueSessions\Infolists;

use App\Models\SttDebugLog;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CodeBlueSessionInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                // ── HEADER: Status Banner ────────────────────────
                Section::make()
                    ->schema([
                        Grid::make([
                            'default' => 1,
                            'md' => 2,
                            'xl' => 3,
                        ])->schema([

                            TextEntry::make('status')
                                ->label('Status Sesi')
                                ->badge()
                                ->wrap()
                                ->grow(false)
                                ->extraAttributes([
                                    'class' => '!whitespace-normal !overflow-visible',
                                ])
                                ->color(fn (string $state) => match ($state) {
                                    'draft' => 'warning',
                                    'finalized' => 'success',
                                    default => 'gray',
                                })
                                ->formatStateUsing(fn (string $state) => match ($state) {
                                    'draft' => '⏳ Menunggu Validasi DPJP',
                                    'finalized' => '✅ Terfinalisasi',
                                    default => ucfirst($state),
                                }),

                            TextEntry::make('incident_type')
                                ->label('Kejadian')
                                ->badge()
                                ->wrap()
                                ->grow(false)
                                ->extraAttributes([
                                    'class' => '!whitespace-normal !overflow-visible',
                                ])
                                ->color('danger'),

                            TextEntry::make('duration_seconds')
                                ->label('Durasi Resusitasi')
                                ->badge()
                                ->wrap()
                                ->grow(false)
                                ->extraAttributes([
                                    'class' => '!whitespace-normal !overflow-visible',
                                ])
                                ->formatStateUsing(function (?int $state): string {
                                    if (! $state) {
                                        return '-';
                                    }

                                    $m = intdiv($state, 60);
                                    $s = $state % 60;

                                    return sprintf('%d mnt %02d dtk', $m, $s);
                                })
                                ->color('warning'),

                            TextEntry::make('created_at')
                                ->label('Waktu Kejadian')
                                ->dateTime('d M Y, H:i')
                                ->badge()
                                ->wrap()
                                ->grow(false)
                                ->extraAttributes([
                                    'class' => '!whitespace-normal !overflow-visible',
                                ])
                                ->color('info'),
                        ]),
                    ]),

                // ── SECTION 1: Identitas & Tim ───────────────────
                Section::make('Identitas Pasien & Tim Code Blue')
                    ->icon('heroicon-o-user-group')
                    ->collapsible()
                    ->schema([
                        Section::make('Data Pasien')
                            ->schema([
                                Grid::make([
                                    'default' => 1,
                                    'sm' => 2,
                                    'xl' => 4,
                                ])->schema([

                                    TextEntry::make('patient.name')
                                        ->label('Nama Pasien')
                                        ->weight('bold')
                                        ->size('lg'),

                                    TextEntry::make('patient.rm_number')
                                        ->label('No. Rekam Medis')
                                        ->badge()
                                        ->wrap()
                                        ->grow(false)
                                        ->extraAttributes([
                                            'class' => '!whitespace-normal !overflow-visible',
                                        ])
                                        ->color('gray'),

                                    TextEntry::make('patient.ward_location')
                                        ->label('Ruang / Lokasi')
                                        ->wrap(),

                                    TextEntry::make('patient.created_at')
                                        ->label('Didaftarkan')
                                        ->dateTime('d M Y, H:i'),
                                ]),
                            ])
                            ->compact(),

                        Section::make('Tim Code Blue')
                            ->schema([
                                Grid::make([
                                    'default' => 1,
                                    'md' => 2,
                                ])->schema([

                                    TextEntry::make('leader_name')
                                        ->label('Leader')
                                        ->weight('bold')
                                        ->wrap(),

                                    TextEntry::make('user.name')
                                        ->label('Pencatat')
                                        ->weight('bold')
                                        ->wrap(),
                                ]),

                                TextEntry::make('team_members')
                                    ->label('Anggota Tim')
                                    ->formatStateUsing(function ($state): string {
                                        if (! $state) {
                                            return '-';
                                        }

                                        $members = is_string($state)
                                            ? json_decode($state, true)
                                            : $state;

                                        if (! is_array($members)) {
                                            return $state;
                                        }

                                        return collect($members)
                                            ->map(fn ($m) => '• '.($m['name'] ?? '?').' → '.($m['role'] ?? '-'))
                                            ->implode("\n");
                                    })
                                    ->columnSpanFull()
                                    ->wrap(),
                            ])
                            ->compact(),
                    ]),

                // ── SECTION 2: Pengkajian ─────────────────────────
                Section::make('1. Pengkajian Awal')
                    ->icon('heroicon-m-clipboard-document-list')
                    ->collapsible()
                    ->schema([

                        TextEntry::make('view_kondisi')
                            ->label('Kondisi Pasien Saat Ditemukan')
                            ->state(fn ($record) => $record->assessment_condition ?: '—')
                            ->columnSpanFull()
                            ->wrap(),

                        Section::make('Tanda-Tanda Vital (TTV) Awal')
                            ->schema([
                                Grid::make([
                                    'default' => 1,
                                    'sm' => 2,
                                    'xl' => 3,
                                ])->schema([

                                    TextEntry::make('view_waktu')
                                        ->label('Pukul')
                                        ->state(function ($record) {
                                            if (! empty($record->ttv_time)) {
                                                return $record->ttv_time;
                                            }

                                            return $record->created_at
                                                ? $record->created_at->format('H:i')
                                                : '—';
                                        })
                                        ->badge()
                                        ->wrap()
                                        ->grow(false)
                                        ->extraAttributes([
                                            'class' => '!whitespace-normal !overflow-visible',
                                        ])
                                        ->color('gray'),

                                    TextEntry::make('view_td')
                                        ->label('Tekanan Darah')
                                        ->state(fn ($record) => $record->ttv_td
                                            ? $record->ttv_td.' mmHg'
                                            : '—')
                                        ->badge()
                                        ->wrap()
                                        ->grow(false)
                                        ->extraAttributes([
                                            'class' => '!whitespace-normal !overflow-visible',
                                        ])
                                        ->color('danger'),

                                    TextEntry::make('view_nadi')
                                        ->label('Nadi')
                                        ->state(fn ($record) => $record->ttv_nadi
                                            ? $record->ttv_nadi.' x/mnt'
                                            : '—')
                                        ->badge()
                                        ->wrap()
                                        ->grow(false)
                                        ->extraAttributes([
                                            'class' => '!whitespace-normal !overflow-visible',
                                        ])
                                        ->color('warning'),

                                    TextEntry::make('view_rr')
                                        ->label('Respiration Rate (RR)')
                                        ->state(fn ($record) => $record->ttv_rr
                                            ? $record->ttv_rr.' x/mnt'
                                            : '—')
                                        ->badge()
                                        ->wrap()
                                        ->grow(false)
                                        ->extraAttributes([
                                            'class' => '!whitespace-normal !overflow-visible',
                                        ])
                                        ->color('info'),

                                    TextEntry::make('view_spo2')
                                        ->label('SpO₂')
                                        ->state(fn ($record) => $record->ttv_spo2
                                            ? $record->ttv_spo2.' %'
                                            : '—')
                                        ->badge()
                                        ->wrap()
                                        ->grow(false)
                                        ->extraAttributes([
                                            'class' => '!whitespace-normal !overflow-visible',
                                        ])
                                        ->color('success'),

                                    TextEntry::make('view_gcs')
                                        ->label('GCS / Kesadaran')
                                        ->state(fn ($record) => $record->ttv_gcs ?: '—')
                                        ->badge()
                                        ->wrap()
                                        ->grow(false)
                                        ->extraAttributes([
                                            'class' => '!whitespace-normal !overflow-visible',
                                        ])
                                        ->color('purple'),
                                ]),
                            ])
                            ->compact(),

                    ]),

                // ── SECTION 3: Log Tindakan ──────────────────────
                Section::make('2. Log Tindakan Real-time')
                    ->icon('heroicon-m-list-bullet')
                    ->collapsible()
                    ->schema([
                        RepeatableEntry::make('filtered_logs')
                            ->hiddenLabel()
                            ->state(fn ($record) => $record->logs
                                ->where('category', 'tindakan')
                                ->values()
                                ->toArray())
                            ->schema([
                                Grid::make([
                                    'default' => 1,
                                    'md' => 3,
                                ])->schema([

                                    TextEntry::make('time_mark')
                                        ->label('Waktu')
                                        ->badge()
                                        ->color('gray')
                                        ->fontFamily('mono'),

                                    TextEntry::make('category')
                                        ->label('Kategori')
                                        ->badge()
                                        ->color('success'),

                                    TextEntry::make('action_text')
                                        ->label('Keterangan Tindakan')
                                        ->weight('medium')
                                        ->wrap(),
                                ]),
                            ])
                            ->contained(false),
                    ]),

                // ── SECTION 4: Evaluasi ──────────────────────────
                Section::make('3. Evaluasi & Rencana Tindak Lanjut')
                    ->icon('heroicon-m-check-badge')
                    ->collapsible()
                    ->schema([

                        Grid::make([
                            'default' => 1,
                            'md' => 2,
                        ])->schema([

                            TextEntry::make('view_hasil')
                                ->label('A. Hasil Akhir Resusitasi')
                                ->state(fn ($record) => $record->evaluation_result ?: '—')
                                ->wrap(),

                            TextEntry::make('view_rencana')
                                ->label('B. Rencana Tindak Lanjut')
                                ->state(fn ($record) => $record->evaluation_plan ?: '—')
                                ->wrap(),
                        ]),

                        TextEntry::make('view_catatan')
                            ->label('Catatan Tambahan Dokumentator')
                            ->state(fn ($record) => $record->additional_notes ?: '—')
                            ->columnSpanFull()
                            ->wrap(),
                    ]),

                // ── SECTION 5: DEBUG LOG STT MENTAH ────────────
                Section::make('STT Debug Log (Raw Terminal)')
                    ->icon('heroicon-o-command-line')
                    ->collapsible()
                    ->collapsed() // Default tertutup
                    ->schema([
                        TextEntry::make('stt_debug_logs_view')
                            ->label('')
                            ->state(function ($record) {
                                $logs = SttDebugLog::where('session_id', $record->id)->orderBy('id', 'asc')->get();

                                if ($logs->isEmpty()) {
                                    return '<div class="p-4 text-[11px] text-zinc-500 font-mono bg-[#0F1117] rounded-lg border border-zinc-800">Belum ada data log untuk sesi ini.</div>';
                                }

                                $html = '<div class="p-4 text-[11px] font-mono bg-[#0F1117] rounded-lg border border-zinc-800 overflow-y-auto max-h-80 space-y-0.5">';

                                foreach ($logs as $log) {
                                    $color = match ($log->type) {
                                        'result' => 'text-emerald-400',
                                        'send' => 'text-blue-400',
                                        'error' => 'text-red-400',
                                        'ws' => 'text-amber-400',
                                        'silence' => 'text-zinc-600',
                                        default => 'text-zinc-400',
                                    };

                                    $html .= '<div class="flex gap-2">';
                                    $html .= '<span class="flex-shrink-0 text-zinc-600">['.e($log->time_mark).']</span>';
                                    $html .= '<span class="'.$color.'">'.e($log->message).'</span>';
                                    $html .= '</div>';
                                }

                                $html .= '</div>';

                                return $html;
                            })
                            ->html()
                            ->columnSpanFull(),
                    ]),

                // ── SECTION 6: Audio ─────────────────────────────
                Section::make('Rekaman Audio Sesi')
                    ->icon('heroicon-o-speaker-wave')
                    ->collapsible()
                    ->hidden(fn ($record) => ! $record->audio_path)
                    ->schema([
                        TextEntry::make('audio_path')
                            ->label('File Rekaman')
                            ->formatStateUsing(fn (string $state): string => '<audio controls class="w-full h-12 rounded-xl bg-gray-50 outline-none mt-1 dark:bg-white/5">
                                    <source src="/storage/'.e($state).'" type="audio/webm">
                                    Browser tidak mendukung elemen audio.
                                </audio>'
                            )
                            ->html()
                            ->columnSpanFull(),
                    ]),

                // ── SECTION 7: Metadata ──────────────────────────
                Section::make('Metadata Sistem')
                    ->icon('heroicon-o-information-circle')
                    ->collapsible()
                    ->collapsed()
                    ->schema([
                        Grid::make([
                            'default' => 1,
                            'sm' => 2,
                            'lg' => 4,
                        ])->schema([
                            TextEntry::make('id')->label('ID Sesi')->badge()->color('gray'),
                            TextEntry::make('user.email')->label('Email Pencatat'),
                            TextEntry::make('created_at')->label('Dibuat')->dateTime('d M Y, H:i:s'),
                            TextEntry::make('updated_at')->label('Terakhir Diupdate')->dateTime('d M Y, H:i:s'),
                        ]),
                    ]),
            ]);
    }
}
