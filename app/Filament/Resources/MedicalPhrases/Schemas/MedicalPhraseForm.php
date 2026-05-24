<?php

namespace App\Filament\Resources\MedicalPhrases\Schemas;

use App\Filament\Resources\MedicalPhrases\MedicalPhraseResource;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MedicalPhraseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Phrase Detail')
                    ->columns(2)
                    ->schema([
                        TextInput::make('phrase')
                            ->label('Frasa / Kata')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->placeholder('Contoh: amiodaron 300 mg')
                            ->helperText('Kata atau frasa yang akan di-boost ke Google STT. Case-sensitive.')
                            ->columnSpanFull(),

                        Select::make('category')
                            ->label('Kategori')
                            ->options(MedicalPhraseResource::categoryOptions())
                            ->required()
                            ->searchable(),

                        TextInput::make('boost')
                            ->label('Boost Value')
                            ->numeric()
                            ->default(20)
                            ->minValue(1)
                            ->maxValue(20)
                            ->helperText('1–20. Google merekomendasikan maks 20.'),

                        Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true)
                            ->helperText('Non-aktifkan tanpa menghapus data.'),

                        Textarea::make('notes')
                            ->label('Catatan')
                            ->placeholder('Konteks penggunaan frasa ini...')
                            ->rows(2)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
