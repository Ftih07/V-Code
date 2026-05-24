<?php

namespace App\Filament\Resources\WordCorrections\Pages;

use App\Filament\Resources\WordCorrections\WordCorrectionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditWordCorrection extends EditRecord
{
    protected static string $resource = WordCorrectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
