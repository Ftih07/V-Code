<?php

namespace App\Filament\Resources\WordCorrections\Tables;

use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class WordCorrectionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('wrong_text')
                    ->label('Teks Salah (STT Output)')
                    ->searchable()
                    ->sortable()
                    ->color('danger')
                    ->weight('bold'),

                TextColumn::make('correct_text')
                    ->label('Koreksi Benar')
                    ->searchable()
                    ->color('success')
                    ->weight('bold'),

                // BadgeColumn diubah menjadi sintaks baru
                TextColumn::make('match_mode')
                    ->label('Mode')
                    ->badge()
                    ->colors([
                        'primary' => 'contains',
                        'warning' => 'exact',
                        'danger' => 'regex',
                    ]),

                IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),

                TextColumn::make('hit_count')
                    ->label('Hit')
                    ->badge()
                    ->color(fn (int $state): string => $state > 50 ? 'success' : ($state > 10 ? 'warning' : 'gray'))
                    ->sortable(),

                TextColumn::make('notes')
                    ->label('Catatan')
                    ->limit(45)
                    ->placeholder('—'),

                TextColumn::make('updated_at')
                    ->label('Diperbarui')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('match_mode')
                    ->options([
                        'contains' => 'Contains',
                        'exact' => 'Exact',
                        'regex' => 'Regex',
                    ]),
                TernaryFilter::make('is_active')
                    ->label('Status Aktif'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    BulkAction::make('activate')
                        ->label('Aktifkan')
                        ->icon('heroicon-o-check-circle')
                        ->action(fn ($records) => $records->each->update(['is_active' => true]))
                        ->deselectRecordsAfterCompletion(),
                    BulkAction::make('deactivate')
                        ->label('Non-aktifkan')
                        ->icon('heroicon-o-x-circle')
                        ->color('warning')
                        ->action(fn ($records) => $records->each->update(['is_active' => false]))
                        ->deselectRecordsAfterCompletion(),
                ]),
            ])
            ->defaultSort('hit_count', 'desc')
            ->striped();
    }
}
