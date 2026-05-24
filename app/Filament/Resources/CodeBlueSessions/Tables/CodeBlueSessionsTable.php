<?php

namespace App\Filament\Resources\CodeBlueSessions\Tables;

use App\Models\CodeBlueSession;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CodeBlueSessionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('Sesi #')
                    ->sortable()
                    ->badge()
                    ->color('gray'),

                TextColumn::make('created_at')
                    ->label('Tanggal & Jam')
                    ->dateTime('d M Y · H:i')
                    ->sortable()
                    ->description(fn ($record) => $record->created_at?->diffForHumans()),

                TextColumn::make('patient.name')
                    ->label('Nama Pasien')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn ($record) => 'RM: '.($record->patient?->rm_number ?? '-')),

                TextColumn::make('patient.ward_location')
                    ->label('Ruang / Lokasi')
                    ->badge()
                    ->color('info'),

                TextColumn::make('incident_type')
                    ->label('Jenis Kejadian')
                    ->badge()
                    ->color('danger')
                    ->searchable(),

                TextColumn::make('user.name')
                    ->label('Pencatat')
                    ->searchable()
                    ->description(fn ($record) => 'Leader: '.($record->leader_name ?? '-')),

                TextColumn::make('duration_seconds')
                    ->label('Durasi')
                    ->formatStateUsing(function (?int $state): string {
                        if (! $state) {
                            return '-';
                        }
                        $m = intdiv($state, 60);
                        $s = $state % 60;

                        return sprintf('%d mnt %02d dtk', $m, $s);
                    })
                    ->badge()
                    ->color('warning'),

                TextColumn::make('logs_count')
                    ->label('Log')
                    ->counts('logs')
                    ->badge()
                    ->color('success'),

                // Update sintaks BadgeColumn menjadi TextColumn()->badge()
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'warning' => 'draft',
                        'success' => 'finalized',
                    ])
                    ->formatStateUsing(fn (string $state) => match ($state) {
                        'draft' => 'Menunggu Validasi',
                        'finalized' => 'Terfinalisasi',
                        default => ucfirst($state),
                    }),

                IconColumn::make('audio_path')
                    ->label('Audio')
                    ->boolean()
                    ->trueIcon('heroicon-o-speaker-wave')
                    ->falseIcon('heroicon-o-speaker-x-mark')
                    ->trueColor('success')
                    ->falseColor('gray'),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'draft' => 'Menunggu Validasi',
                        'finalized' => 'Terfinalisasi',
                    ]),

                SelectFilter::make('incident_type')
                    ->label('Jenis Kejadian')
                    ->options(fn () => CodeBlueSession::query()
                        ->distinct()
                        ->pluck('incident_type', 'incident_type')
                        ->filter()
                        ->toArray()
                    ),

                Filter::make('has_audio')
                    ->label('Ada Rekaman Audio')
                    ->query(fn (Builder $q) => $q->whereNotNull('audio_path')),

                Filter::make('today')
                    ->label('Hari Ini')
                    ->query(fn (Builder $q) => $q->whereDate('created_at', today())),

                Filter::make('this_week')
                    ->label('Minggu Ini')
                    ->query(fn (Builder $q) => $q->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])),
            ])
            ->recordActions([
                ViewAction::make()->label('Detail'),
            ])
            ->bulkActions([])  // Tidak ada bulk action
            ->striped()
            ->poll('30s'); // auto-refresh setiap 30 detik
    }
}
