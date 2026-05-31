<?php

namespace App\Filament\Resources\CodeBlueSessions\Tables;

use App\Models\CodeBlueSession;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\Layout\Panel;
use Filament\Tables\Columns\Layout\Stack;
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

                Stack::make([

                    TextColumn::make('patient.name')
                        ->label('Nama Pasien')
                        ->searchable()
                        ->sortable()
                        ->weight('bold')
                        ->color('primary')
                        ->extraAttributes(['style' => 'font-size: 1.125rem !important;']) // Ganti size('lg')
                        ->description(
                            fn ($record) => 'RM: '.($record->patient?->rm_number ?? '-')
                        ),

                    TextColumn::make('status')
                        ->badge()
                        ->colors([
                            'warning' => 'draft',
                            'success' => 'finalized',
                        ])
                        ->formatStateUsing(
                            fn (string $state) => match ($state) {
                                'draft' => 'Menunggu Validasi',
                                'finalized' => 'Terfinalisasi',
                                default => ucfirst($state),
                            }
                        ),

                ]),

                Panel::make([

                    Stack::make([

                        TextColumn::make('id')
                            ->label('Sesi')
                            ->badge()
                            ->color('gray'),

                        TextColumn::make('created_at')
                            ->label('Waktu Kejadian')
                            ->dateTime('d M Y · H:i')
                            ->description(fn ($record) => $record->created_at?->diffForHumans()),

                        TextColumn::make('patient.ward_location')
                            ->label('Lokasi')
                            ->badge()
                            ->color('info'),

                        TextColumn::make('incident_type')
                            ->label('Jenis')
                            ->badge()
                            ->color('danger'),

                        TextColumn::make('user.name')
                            ->label('Pencatat')
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
                            ->label('Total Log')
                            ->counts('logs')
                            ->badge()
                            ->color('success'),

                        IconColumn::make('audio_path')
                            ->label('Audio')
                            ->boolean()
                            ->trueIcon('heroicon-m-speaker-wave')
                            ->falseIcon('heroicon-m-speaker-x-mark')
                            ->trueColor('success')
                            ->falseColor('gray'),

                    ])->space(2),

                ])->collapsible(),

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
                    ->options(fn () => CodeBlueSession::query()->distinct()->pluck('incident_type', 'incident_type')->filter()->toArray()),

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

            ->filtersFormColumns(1) // Filter jadi 1 kolom di mobile

            ->recordActions([
                ViewAction::make()
                    ->label('Detail Sesi')
                    ->button()
                    ->color('primary'),
            ])

            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])

            ->striped(false)

            ->poll('30s');
    }
}
