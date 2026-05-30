<?php

namespace App\Filament\Resources\Features\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class FeaturesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order')
                    ->label('Urutan')
                    ->sortable()
                    ->badge()
                    ->color('gray'),

                TextColumn::make('title')
                    ->label('Judul Fitur')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('color')
                    ->label('Warna')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'blue' => 'info',
                        'emerald' => 'success',
                        'purple' => 'primary',
                        'amber' => 'warning',
                        default => 'gray',
                    }),

                TextColumn::make('desc')
                    ->label('Deskripsi')
                    ->limit(40)
                    ->color('gray'),
            ])
            ->defaultSort('order', 'asc') // Otomatis urutkan berdasarkan order terkecil
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
