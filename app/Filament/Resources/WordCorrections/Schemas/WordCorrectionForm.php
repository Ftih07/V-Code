<?php

namespace App\Filament\Resources\WordCorrections\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class WordCorrectionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Koreksi Kata')
                    ->description('Kata yang sering salah dikenali STT → kata yang benar secara medis.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('wrong_text')
                            ->label('Teks Salah (output STT)')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Contoh: amino darah')
                            ->helperText('Apa yang ditulis oleh Web Speech / Google STT (dalam lowercase).'),

                        TextInput::make('correct_text')
                            ->label('Koreksi yang Benar')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Contoh: amiodaron')
                            ->helperText('Kata medis yang seharusnya muncul.'),

                        Select::make('match_mode')
                            ->label('Mode Pencocokan')
                            ->options([
                                'contains' => 'Contains — teks salah ada di dalam kalimat',
                                'exact' => 'Exact — kalimat persis sama',
                                'regex' => 'Regex — pola ekspresi reguler',
                            ])
                            ->default('contains')
                            ->required()
                            ->helperText('"Contains" paling aman untuk kata medis. "Regex" untuk pola kompleks.'),

                        Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true)
                            ->helperText('Non-aktifkan jika koreksi ini menyebabkan false positive.'),

                        Textarea::make('notes')
                            ->label('Catatan / Konteks')
                            ->placeholder('Kenapa kata ini sering salah? Fonetik mirip, aksen, dll...')
                            ->rows(2)
                            ->columnSpanFull(),
                    ]),

                Section::make('Statistik')
                    ->schema([
                        TextInput::make('hit_count')
                            ->label('Jumlah Koreksi Terpicu')
                            ->numeric()
                            ->disabled()
                            ->helperText('Bertambah otomatis setiap kali koreksi ini aktif dipakai.'),
                    ])
                    ->visibleOn('edit'),
            ]);
    }
}
