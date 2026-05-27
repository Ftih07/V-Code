<?php

namespace App\Filament\Resources\CodeBlueSessions\Infolists;

use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
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
                            'sm'      => 2,
                            'lg'      => 4,
                        ])->schema([
                            TextEntry::make('status')
                                ->label('Status Sesi')
                                ->badge()
                                ->color(fn (string $state) => match ($state) {
                                    'draft'      => 'warning',
                                    'finalized'  => 'success',
                                    default      => 'gray',
                                })
                                ->formatStateUsing(fn (string $state) => match ($state) {
                                    'draft'      => '⏳ Menunggu Validasi DPJP',
                                    'finalized'  => '✅ Terfinalisasi',
                                    default      => ucfirst($state),
                                }),

                            TextEntry::make('incident_type')
                                ->label('Jenis Kejadian')
                                ->badge()
                                ->color('danger'),

                            TextEntry::make('duration_seconds')
                                ->label('Total Durasi Resusitasi')
                                ->formatStateUsing(function (?int $state): string {
                                    if (!$state) return '-';
                                    $m = intdiv($state, 60);
                                    $s = $state % 60;
                                    return sprintf('%d menit %02d detik', $m, $s);
                                })
                                ->badge()
                                ->color('warning'),

                            TextEntry::make('created_at')
                                ->label('Waktu Kejadian')
                                ->dateTime('d F Y, H:i')
                                ->badge()
                                ->color('info'),
                        ]),
                    ]),

                // ── SECTION 1: Identitas & Tim ───────────────────
                Section::make('Identitas Pasien & Tim Code Blue')
                    ->icon('heroicon-o-user-group')
                    ->collapsible()
                    ->schema([

                        // Pasien
                        Section::make('Data Pasien')
                            ->schema([
                                Grid::make([
                                    'default' => 1,
                                    'sm'      => 2,
                                    'lg'      => 3,
                                ])->schema([
                                    TextEntry::make('patient.name')
                                        ->label('Nama Pasien')
                                        ->weight('bold')
                                        ->size('lg'),

                                    TextEntry::make('patient.rm_number')
                                        ->label('No. Rekam Medis')
                                        ->badge()
                                        ->color('gray'),

                                    TextEntry::make('patient.ward_location')
                                        ->label('Ruang / Lokasi'),

                                    TextEntry::make('patient.created_at')
                                        ->label('Pasien Didaftarkan')
                                        ->dateTime('d M Y, H:i'),
                                ]),
                            ])
                            ->compact(),

                        // Waktu Sesi
                        Section::make('Waktu Sesi')
                            ->schema([
                                Grid::make([
                                    'default' => 1,
                                    'sm'      => 2,
                                ])->schema([
                                    TextEntry::make('start_time')
                                        ->label('Waktu Mulai')
                                        ->dateTime('H:i:s · d M Y'),

                                    TextEntry::make('end_time')
                                        ->label('Waktu Selesai')
                                        ->dateTime('H:i:s · d M Y'),
                                ]),
                            ])
                            ->compact(),

                        // Tim
                        Section::make('Tim Code Blue')
                            ->schema([
                                Grid::make([
                                    'default' => 1,
                                    'sm'      => 2,
                                ])->schema([
                                    TextEntry::make('leader_name')
                                        ->label('Ketua Tim (Leader)')
                                        ->weight('bold'),

                                    TextEntry::make('user.name')
                                        ->label('Pencatat (User Login)')
                                        ->weight('bold'),
                                ]),

                                TextEntry::make('team_members')
                                    ->label('Anggota Tim & Tugas')
                                    ->formatStateUsing(function ($state): string {
                                        if (!$state) return '-';
                                        $members = is_string($state)
                                            ? json_decode($state, true)
                                            : $state;
                                        if (!is_array($members)) return $state;
                                        return collect($members)
                                            ->map(fn ($m) => '• ' . ($m['name'] ?? '?') . ' → ' . ($m['role'] ?? '-'))
                                            ->implode("\n");
                                    })
                                    ->columnSpanFull(),
                            ])
                            ->compact(),
                    ]),

                // ── SECTION 2: Pengkajian ─────────────────────────
                Section::make('1. Pengkajian Awal')
                    ->icon('heroicon-o-clipboard-document-list')
                    ->collapsible()
                    ->schema([
                        TextEntry::make('assessment_condition')
                            ->label('Kondisi Pasien Saat Ditemukan')
                            ->placeholder('—')
                            ->columnSpanFull(),

                        Section::make('Tanda-Tanda Vital (TTV) Awal')
                            ->schema([
                                Grid::make([
                                    'default' => 2,
                                    'sm'      => 3,
                                    'lg'      => 6,
                                ])->schema([
                                    TextEntry::make('ttv_time')
                                        ->label('Pukul')
                                        ->badge()
                                        ->color('gray')
                                        ->placeholder('—'),

                                    TextEntry::make('ttv_td')
                                        ->label('Tek. Darah')
                                        ->formatStateUsing(fn ($s) => $s ? $s . ' mmHg' : '—')
                                        ->badge()
                                        ->color('danger'),

                                    TextEntry::make('ttv_nadi')
                                        ->label('Nadi')
                                        ->formatStateUsing(fn ($s) => $s ? $s . ' x/mnt' : '—')
                                        ->badge()
                                        ->color('warning'),

                                    TextEntry::make('ttv_rr')
                                        ->label('RR')
                                        ->formatStateUsing(fn ($s) => $s ? $s . ' x/mnt' : '—')
                                        ->badge()
                                        ->color('info'),

                                    TextEntry::make('ttv_spo2')
                                        ->label('SpO₂')
                                        ->formatStateUsing(fn ($s) => $s ? $s . ' %' : '—')
                                        ->badge()
                                        ->color('success'),

                                    TextEntry::make('ttv_gcs')
                                        ->label('GCS')
                                        ->badge()
                                        ->color('purple')
                                        ->placeholder('—'),
                                ]),
                            ])
                            ->compact(),
                    ]),

                // ── SECTION 3: Log Tindakan ──────────────────────
                Section::make('2. Log Tindakan Real-time')
                    ->icon('heroicon-o-list-bullet')
                    ->collapsible()
                    ->schema([
                        RepeatableEntry::make('logs')
                            ->label('')
                            ->schema([
                                Grid::make([
                                    'default' => 1,
                                    'sm'      => 3,
                                ])->schema([
                                    TextEntry::make('time_mark')
                                        ->label('Waktu')
                                        ->badge()
                                        ->color('gray')
                                        ->fontFamily('mono'),

                                    TextEntry::make('category')
                                        ->label('Kategori')
                                        ->badge()
                                        ->color(fn (string $state) => match ($state) {
                                            'pengkajian' => 'info',
                                            'evaluasi'   => 'warning',
                                            default      => 'success',
                                        }),

                                    TextEntry::make('action_text')
                                        ->label('Keterangan Tindakan')
                                        ->weight('medium'),
                                ]),
                            ])
                            ->contained(false),
                    ]),

                // ── SECTION 4: Evaluasi ──────────────────────────
                Section::make('3. Evaluasi & Rencana Tindak Lanjut')
                    ->icon('heroicon-o-check-badge')
                    ->collapsible()
                    ->schema([
                        Grid::make([
                            'default' => 1,
                            'md'      => 2,
                        ])->schema([
                            TextEntry::make('evaluation_result')
                                ->label('A. Hasil Akhir Resusitasi')
                                ->placeholder('—'),

                            TextEntry::make('evaluation_plan')
                                ->label('B. Rencana Tindak Lanjut')
                                ->placeholder('—'),
                        ]),

                        TextEntry::make('additional_notes')
                            ->label('Catatan Tambahan Dokumentator')
                            ->placeholder('—')
                            ->columnSpanFull(),
                    ]),

                // ── SECTION 5: Audio ─────────────────────────────
                Section::make('Rekaman Audio Sesi')
                    ->icon('heroicon-o-speaker-wave')
                    ->collapsible()
                    ->hidden(fn ($record) => !$record->audio_path)
                    ->schema([
                        TextEntry::make('audio_path')
                            ->label('File Rekaman')
                            ->formatStateUsing(fn (string $state): string =>
                                '<audio controls class="w-full h-12 rounded-xl bg-gray-50 outline-none mt-1">
                                    <source src="/storage/' . e($state) . '" type="audio/webm">
                                    Browser tidak mendukung elemen audio.
                                </audio>'
                            )
                            ->html()
                            ->columnSpanFull(),
                    ]),

                // ── SECTION 6: Metadata ──────────────────────────
                Section::make('Metadata Sistem')
                    ->icon('heroicon-o-information-circle')
                    ->collapsible()
                    ->collapsed()
                    ->schema([
                        Grid::make([
                            'default' => 1,
                            'sm'      => 2,
                            'lg'      => 4,
                        ])->schema([
                            TextEntry::make('id')
                                ->label('ID Sesi')
                                ->badge()
                                ->color('gray'),

                            TextEntry::make('user.email')
                                ->label('Email Pencatat'),

                            TextEntry::make('created_at')
                                ->label('Dibuat')
                                ->dateTime('d M Y, H:i:s'),

                            TextEntry::make('updated_at')
                                ->label('Terakhir Diupdate')
                                ->dateTime('d M Y, H:i:s'),
                        ]),
                    ]),
            ]);
    }
}