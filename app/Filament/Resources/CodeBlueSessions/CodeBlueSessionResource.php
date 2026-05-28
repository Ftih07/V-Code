<?php

namespace App\Filament\Resources\CodeBlueSessions;

use App\Filament\Resources\CodeBlueSessions\Infolists\CodeBlueSessionInfolist;
use App\Filament\Resources\CodeBlueSessions\Pages\ListCodeBlueSessions;
use App\Filament\Resources\CodeBlueSessions\Pages\ViewCodeBlueSession;
use App\Filament\Resources\CodeBlueSessions\Tables\CodeBlueSessionsTable;
use App\Models\CodeBlueSession;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;          // ✅ Ganti Infolist dengan Schema
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CodeBlueSessionResource extends Resource
{
    protected static ?string $model = CodeBlueSession::class;
    
    protected static string $view = 'filament.pages.code-blue-sessions';

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::OutlinedHeart;

    protected static string|\UnitEnum|null $navigationGroup = 'V-CODE · Monitoring';

    protected static ?string $navigationLabel = 'Sesi Code Blue';

    protected static ?int $navigationSort = 1;

    protected static ?string $modelLabel = 'Sesi Code Blue';

    protected static ?string $pluralModelLabel = 'Sesi Code Blue';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit($record): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function table(Table $table): Table
    {
        return CodeBlueSessionsTable::configure($table);
    }

    // ✅ Di Filament v5, infolist() pakai Schema, BUKAN Infolist
    public static function infolist(Schema $schema): Schema
    {
        return CodeBlueSessionInfolist::configure($schema);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCodeBlueSessions::route('/'),
            'view' => ViewCodeBlueSession::route('/{record}'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with(['patient', 'user', 'logs']);
    }
}
