<?php

namespace App\Filament\Resources\Features\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class FeatureForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Judul Fitur')
                    ->required()
                    ->maxLength(255),

                Select::make('color')
                    ->label('Tema Warna')
                    ->options([
                        'blue' => 'Biru (Blue)',
                        'emerald' => 'Hijau (Emerald)',
                        'purple' => 'Ungu (Purple)',
                        'amber' => 'Kuning (Amber)',
                    ])
                    ->required()
                    ->default('blue')
                    ->native(false),

                TextInput::make('order')
                    ->label('Urutan Tampil')
                    ->numeric()
                    ->default(0)
                    ->helperText('Angka lebih kecil akan tampil lebih dulu (0, 1, 2, dst).'),

                Textarea::make('desc')
                    ->label('Deskripsi')
                    ->required()
                    ->rows(3)
                    ->columnSpanFull(),

                Textarea::make('icon_svg')
                    ->label('Kode SVG Icon')
                    ->required()
                    ->rows(6)
                    ->columnSpanFull()
                    ->helperText('Paste kode mentah <svg>...</svg> dari Heroicons atau sumber lain di sini.'),
            ]);
    }
}
