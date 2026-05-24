<?php

namespace App\Filament\Resources\MedicalPhrases\Tables;

use App\Filament\Resources\MedicalPhrases\MedicalPhraseResource;
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

class MedicalPhrasesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('phrase')
                    ->label('Frasa')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold'),

                TextColumn::make('category')
                    ->label('Kategori')
                    ->formatStateUsing(fn (string $state): string => MedicalPhraseResource::categoryOptions()[$state] ?? $state)
                    ->badge()
                    ->colors([
                        'danger' => 'status',
                        'warning' => 'rjp',
                        'info' => 'defibrilasi',
                        'success' => 'obat',
                        'primary' => 'airway',
                    ]),

                TextColumn::make('boost')
                    ->label('Boost')
                    ->badge()
                    ->color(fn (int $state): string => $state >= 18 ? 'success' : ($state >= 10 ? 'warning' : 'danger')),

                IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),

                TextColumn::make('notes')
                    ->label('Catatan')
                    ->limit(40)
                    ->placeholder('—'),

                TextColumn::make('updated_at')
                    ->label('Diperbarui')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->options(MedicalPhraseResource::categoryOptions())
                    ->label('Kategori'),

                TernaryFilter::make('is_active')
                    ->label('Status')
                    ->trueLabel('Aktif saja')
                    ->falseLabel('Non-aktif saja'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),

                    // Custom bulk action diletakkan di dalam toolbarActions
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
            ->defaultSort('category')
            ->striped();
    }
}
