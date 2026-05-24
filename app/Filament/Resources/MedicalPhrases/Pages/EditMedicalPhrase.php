<?php

namespace App\Filament\Resources\MedicalPhrases\Pages;

use App\Filament\Resources\MedicalPhrases\MedicalPhraseResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditMedicalPhrase extends EditRecord
{
    protected static string $resource = MedicalPhraseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
