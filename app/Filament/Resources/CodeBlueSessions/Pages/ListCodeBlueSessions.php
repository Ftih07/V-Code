<?php

namespace App\Filament\Resources\CodeBlueSessions\Pages;

use App\Filament\Resources\CodeBlueSessions\CodeBlueSessionResource;
use Filament\Resources\Pages\ListRecords;

class ListCodeBlueSessions extends ListRecords
{
    protected static string $resource = CodeBlueSessionResource::class;

    protected function getHeaderActions(): array
    {
        return [

        ];
    }
}
