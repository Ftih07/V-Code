<?php

namespace App\Filament\Resources\ClassifyRules\Pages;

use App\Filament\Resources\ClassifyRules\ClassifyRuleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListClassifyRules extends ListRecords
{
    protected static string $resource = ClassifyRuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
