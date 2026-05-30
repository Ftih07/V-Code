<?php

namespace App\Filament\Resources\Users\Tables;

use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('email')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('role')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'user' => 'success',
                        default => 'gray',
                    }),

                IconColumn::make('email_verified_at')
                    ->label('Status Approval')
                    ->boolean()
                    // Mengubah timestamp menjadi boolean (true jika ada isinya, false jika null)
                    ->getStateUsing(fn (User $record): bool => $record->email_verified_at !== null),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                // Tombol Approve
                Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Approve User')
                    ->modalDescription('Apakah Anda yakin ingin memberikan akses ke user ini?')
                    ->action(fn (User $record) => $record->update(['email_verified_at' => now()]))
                    // Sembunyikan tombol jika user sudah di-approve
                    ->hidden(fn (User $record): bool => $record->email_verified_at !== null),

                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
