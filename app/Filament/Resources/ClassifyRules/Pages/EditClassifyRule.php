<?php

namespace App\Filament\Resources\ClassifyRules\Pages;

use App\Filament\Resources\ClassifyRules\ClassifyRuleResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditClassifyRule extends EditRecord
{
    protected static string $resource = ClassifyRuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
