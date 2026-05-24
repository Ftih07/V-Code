<?php

namespace App\Filament\Resources\MedicalPhrases\Pages;

use App\Filament\Resources\MedicalPhrases\MedicalPhraseResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMedicalPhrases extends ListRecords
{
    // Mengarah ke Resource yang benar sesuai use path di atas
    protected static string $resource = MedicalPhraseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
