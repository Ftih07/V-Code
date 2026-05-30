<?php

namespace App\Filament\Resources\MedicalPhrases;

use App\Filament\Resources\MedicalPhrases\Pages\CreateMedicalPhrase;
use App\Filament\Resources\MedicalPhrases\Pages\EditMedicalPhrase;
use App\Filament\Resources\MedicalPhrases\Pages\ListMedicalPhrases;
use App\Filament\Resources\MedicalPhrases\Schemas\MedicalPhraseForm;
use App\Filament\Resources\MedicalPhrases\Tables\MedicalPhrasesTable;
use App\Models\MedicalPhrase;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MedicalPhraseResource extends Resource
{
    protected static ?string $model = MedicalPhrase::class;

    // Menyesuaikan icon dengan format BackedEnum
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBookOpen;

    protected static string|\UnitEnum|null $navigationGroup = 'V-CODE · Phrase DB';

    protected static ?string $navigationLabel = 'Medical Phrases';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Medical Phrase';

    protected static ?string $pluralModelLabel = 'Medical Phrases';

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'info';
    }

    // Daftar kategori dipusatkan di sini
    public static function categoryOptions(): array
    {
        return [
            'status' => '🔴 Status & Aktivasi',
            'rjp' => '💓 RJP / CPR',
            'defibrilasi' => '⚡ Defibrilasi',
            'obat' => '💊 Obat & Dosis',
            'airway' => '🫁 Airway & Ventilasi',
            'irama' => '📈 Irama Jantung',
            'ttv' => '📊 TTV & Monitoring',
            'akses_vaskular' => '💉 Akses Vaskular',
            'evaluasi' => '✅ Evaluasi & Outcome',
            'umum' => '📝 Umum',
            'sistem' => '⚙️ Sistem & Validasi',
        ];
    }

    public static function form(Schema $schema): Schema
    {
        return MedicalPhraseForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MedicalPhrasesTable::configure($table);
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
            'index' => ListMedicalPhrases::route('/'),
            'create' => CreateMedicalPhrase::route('/create'),
            'edit' => EditMedicalPhrase::route('/{record}/edit'),
        ];
    }
}
