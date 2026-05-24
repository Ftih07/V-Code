<?php

namespace App\Filament\Resources\WordCorrections;

use App\Filament\Resources\WordCorrections\Pages\CreateWordCorrection;
use App\Filament\Resources\WordCorrections\Pages\EditWordCorrection;
use App\Filament\Resources\WordCorrections\Pages\ListWordCorrections;
use App\Filament\Resources\WordCorrections\Schemas\WordCorrectionForm;
use App\Filament\Resources\WordCorrections\Tables\WordCorrectionsTable;
use App\Models\WordCorrection;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class WordCorrectionResource extends Resource
{
    protected static ?string $model = WordCorrection::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedWrenchScrewdriver;

    protected static string|\UnitEnum|null $navigationGroup = 'V-CODE · Phrase DB';

    protected static ?string $navigationLabel = 'Word Corrections';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = 'Word Correction';

    protected static ?string $pluralModelLabel = 'Word Corrections';

    public static function form(Schema $schema): Schema
    {
        return WordCorrectionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return WordCorrectionsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListWordCorrections::route('/'),
            'create' => CreateWordCorrection::route('/create'),
            'edit' => EditWordCorrection::route('/{record}/edit'),
        ];
    }
}
