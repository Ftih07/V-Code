<?php

namespace App\Filament\Resources\ClassifyRules\Tables;

use App\Filament\Resources\ClassifyRules\ClassifyRuleResource;
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

class ClassifyRulesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('priority')
                    ->label('Priority')
                    ->sortable()
                    ->badge()
                    ->color(fn (int $state): string => $state <= 10 ? 'danger' : ($state <= 20 ? 'warning' : 'gray')),

                TextColumn::make('keyword')
                    ->label('Keyword')
                    ->searchable()
                    ->sortable()
                    ->copyable()
                    ->weight('bold'),

                // Mengganti BadgeColumn
                TextColumn::make('match_mode')
                    ->label('Mode')
                    ->badge()
                    ->colors([
                        'primary' => 'contains',
                        'warning' => 'exact',
                        'info' => 'starts_with',
                        'danger' => 'regex',
                    ]),

                // Mengganti BadgeColumn
                TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->colors([
                        'success' => 'tindakan',
                        'info' => 'pengkajian',
                        'warning' => 'evaluasi',
                    ]),

                TextColumn::make('target_field')
                    ->label('AutoFill Field')
                    ->formatStateUsing(fn (?string $state): string => $state
                        ? (ClassifyRuleResource::targetFieldOptions()[$state] ?? $state)
                        : '—'
                    )
                    ->placeholder('—'),

                IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),

                TextColumn::make('notes')
                    ->label('Catatan')
                    ->limit(40)
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->options([
                        'tindakan' => 'Tindakan',
                        'pengkajian' => 'Pengkajian',
                        'evaluasi' => 'Evaluasi',
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
            ->defaultSort('priority')
            ->striped();
    }
}
