<?php

namespace App\Services\Organisation;

// Illuminate
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Builder;

// Models
use App\Models\Role;
use App\Models\Organisation;
use App\Models\Postcode;

class OrganisationMapService
{

    public function getMapData(): array
    {
        return Organisation::query()
            ->with('postcode:id,latitude,longitude')
            ->with('primaryRole:id,display_name')
            ->select('*')
            ->whereNotNull('postcode_id')
            ->take(1000)
            ->get()
            ->toArray();
    }
}
