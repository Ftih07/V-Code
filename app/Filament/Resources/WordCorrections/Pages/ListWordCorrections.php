<?php

namespace App\Filament\Resources\WordCorrections\Pages;

use App\Filament\Resources\WordCorrections\WordCorrectionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListWordCorrections extends ListRecords
{
    protected static string $resource = WordCorrectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
