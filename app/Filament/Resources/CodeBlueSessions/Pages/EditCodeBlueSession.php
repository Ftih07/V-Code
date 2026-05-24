<?php

namespace App\Filament\Resources\CodeBlueSessions\Pages;

use App\Filament\Resources\CodeBlueSessions\CodeBlueSessionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCodeBlueSession extends EditRecord
{
    protected static string $resource = CodeBlueSessionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
