<?php

namespace App\Filament\Resources\Patients\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PatientForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Pasien')
                    ->description('Data dasar pasien untuk rekam medis.')
                    ->schema([
                        TextInput::make('rm_number')
                            ->label('Nomor Rekam Medis')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->placeholder('Contoh: RM-102938'),
                        TextInput::make('name')
                            ->label('Nama Lengkap')
                            ->required(),
                        TextInput::make('ward_location')
                            ->label('Ruangan / Lokasi')
                            ->placeholder('Contoh: Bangsal Flamboyan'),
                    ])->columns(2),
            ]);
    }
}
