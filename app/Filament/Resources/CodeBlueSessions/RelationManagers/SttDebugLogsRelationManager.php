<?php

namespace App\Filament\Resources\CodeBlueSessions\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SttDebugLogsRelationManager extends RelationManager
{
    protected static string $relationship = 'sttDebugLogs';

    protected static ?string $inverseRelationship = 'session';

    protected static ?string $recordTitleAttribute = 'id';

    public static function getPluralModelLabel(): string
    {
        return 'Log Debug STT';
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('message')
            ->heading('Log Debug Sistem (STT)')
            ->columns([
                TextColumn::make('created_at')
                    ->label('Waktu')
                    ->dateTime('H:i:s')
                    ->sortable(),
                TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'error' => 'danger',
                        'info' => 'info',
                        default => 'warning',
                    }),
                TextColumn::make('message')
                    ->label('Hasil STT / Pesan Error')
                    ->wrap(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
