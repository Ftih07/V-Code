<?php

namespace App\Filament\Resources\ClassifyRules\Schemas;

use App\Filament\Resources\ClassifyRules\ClassifyRuleResource;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ClassifyRuleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Classify Rule')
                    ->description('Aturan keyword → kategori + field AutoFill untuk frontend dan backend.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('keyword')
                            ->label('Keyword')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Contoh: rosc, tekanan darah, saturasi')
                            ->helperText('Kata kunci dalam lowercase. Akan dicari di teks transkripsi.')
                            ->columnSpanFull(),

                        Select::make('match_mode')
                            ->label('Mode Pencocokan')
                            ->options([
                                'contains' => 'Contains — keyword ada dalam teks',
                                'exact' => 'Exact — teks persis sama dengan keyword',
                                'starts_with' => 'Starts With — teks dimulai dengan keyword',
                                'regex' => 'Regex — pola regex (advanced)',
                            ])
                            ->default('contains')
                            ->required(),

                        Select::make('category')
                            ->label('Kategori Log')
                            ->options([
                                'tindakan' => '🟢 Tindakan',
                                'pengkajian' => '🔵 Pengkajian',
                                'evaluasi' => '🟣 Evaluasi',
                            ])
                            ->required()
                            ->reactive(),

                        Select::make('target_field')
                            ->label('Target AutoFill Field')
                            ->options(ClassifyRuleResource::targetFieldOptions())
                            ->nullable()
                            ->placeholder('— (tindakan, tidak ada autofill) —')
                            ->helperText('Kosongkan untuk kategori "tindakan" yang tidak mengisi field apapun.'),

                        TextInput::make('priority')
                            ->label('Prioritas')
                            ->numeric()
                            ->default(20)
                            ->minValue(1)
                            ->maxValue(99)
                            ->helperText('Lebih kecil = dicek lebih dulu. Evaluasi = 10, Pengkajian = 20, Tindakan = 30+'),

                        Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true),

                        Textarea::make('notes')
                            ->label('Catatan')
                            ->rows(2)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
