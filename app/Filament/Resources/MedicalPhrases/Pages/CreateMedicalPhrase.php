<?php

namespace App\Filament\Resources\MedicalPhrases\Pages;

use App\Filament\Resources\MedicalPhrases\MedicalPhraseResource;
use Filament\Resources\Pages\CreateRecord;

class CreateMedicalPhrase extends CreateRecord
{
    protected static string $resource = MedicalPhraseResource::class;
}
