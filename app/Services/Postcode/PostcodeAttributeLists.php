<?php

namespace App\Services\Postcode;

// Illuminate
use Illuminate\Support\Collection;

// Models
use App\Models\Postcode;
use App\Models\AdminCounty;
use App\Models\AdminDistrict;
use App\Models\EuropeanElectoralRegion;
use App\Models\HealthAuthority;
use App\Models\Nuts;
use App\Models\ParliamentaryConstituency;
use App\Models\PoliceForceArea;
use App\Models\PrimaryCareTrust;
use App\Models\Region;

class PostcodeAttributeLists
{    

    public function getPostcodeAttributes(): array
    {
        return [
            'admin_county' => $this->getAdminCounty(),
            'admin_district' => $this->getAdminDistrict(),
        ];
    }

    public function getAdminCounty(): Collection
    {
        return AdminCounty::query()
            ->select(['id', 'code', 'name'])
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getAdminDistrict(): Collection
    {
        return AdminDistrict::query()
            ->select(['id', 'code', 'name'])
            ->orderBy('name', 'asc')
            ->get();
    }
}
