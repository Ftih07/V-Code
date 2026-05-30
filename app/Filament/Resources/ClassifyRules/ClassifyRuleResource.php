<?php

namespace App\Filament\Resources\ClassifyRules;

use App\Filament\Resources\ClassifyRules\Pages\CreateClassifyRule;
use App\Filament\Resources\ClassifyRules\Pages\EditClassifyRule;
use App\Filament\Resources\ClassifyRules\Pages\ListClassifyRules;
use App\Filament\Resources\ClassifyRules\Schemas\ClassifyRuleForm;
use App\Filament\Resources\ClassifyRules\Tables\ClassifyRulesTable;
use App\Models\ClassifyRule;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ClassifyRuleResource extends Resource
{
    protected static ?string $model = ClassifyRule::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTag;

    protected static string|\UnitEnum|null $navigationGroup = 'V-CODE · Phrase DB';

    protected static ?string $navigationLabel = 'Classify Rules';

    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = 'Classify Rule';

    protected static ?string $pluralModelLabel = 'Classify Rules';

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'info';
    }

    public static function targetFieldOptions(): array
    {
        return [
            'assessment_condition' => 'Kondisi Awal (assessment_condition)',
            'ttv_td' => 'Tekanan Darah (ttv_td)',
            'ttv_nadi' => 'Nadi (ttv_nadi)',
            'ttv_rr' => 'Laju Napas / RR (ttv_rr)',
            'ttv_spo2' => 'Saturasi O₂ (ttv_spo2)',
            'ttv_gcs' => 'GCS / Kesadaran (ttv_gcs)',
            'evaluation_result' => 'Hasil Evaluasi (evaluation_result)',
            'evaluation_plan' => 'Rencana / Plan (evaluation_plan)',
        ];
    }

    public static function form(Schema $schema): Schema
    {
        return ClassifyRuleForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ClassifyRulesTable::configure($table);
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
            'index' => ListClassifyRules::route('/'),
            'create' => CreateClassifyRule::route('/create'),
            'edit' => EditClassifyRule::route('/{record}/edit'),
        ];
    }
}
