<?php

namespace App\Filament\Resources\CodeBlueSessions\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LogsRelationManager extends RelationManager
{
    protected static string $relationship = 'logs';

    protected static ?string $inverseRelationship = 'session';

    protected static ?string $recordTitleAttribute = 'id';

    public static function getPluralModelLabel(): string
    {
        return 'Log Medis';
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('action_text')
            ->heading('Log Tindakan Medis')
            ->columns([
                TextColumn::make('time_mark')
                    ->label('Waktu')
                    ->badge()
                    ->color('gray'),
                TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->color('info'),
                TextColumn::make('action_text')
                    ->label('Detail Tindakan')
                    ->wrap(),
            ])
            ->defaultSort('time_mark', 'asc');
    }
}
