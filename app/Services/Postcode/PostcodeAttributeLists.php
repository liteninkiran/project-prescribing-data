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
            'parliamentary_constituency' => $this->getParliamentaryConstituency(),
            'police_force_area' => $this->getPoliceForceArea(),
            'nuts' => $this->getNuts(),
        ];
    }

    public function getAdminCounty(): Collection
    {
        return $this->getCollection('App\Models\AdminCounty');
    }

    public function getAdminDistrict(): Collection
    {
        return $this->getCollection('App\Models\AdminDistrict');
    }

    public function getParliamentaryConstituency(): Collection
    {
        return $this->getCollection('App\Models\ParliamentaryConstituency');
    }

    public function getPoliceForceArea(): Collection
    {
        return $this->getCollection('App\Models\PoliceForceArea');
    }

    public function getNuts(): Collection
    {
        return $this->getCollection('App\Models\Nuts');
    }

    public function getCollection(string $class): Collection
    {
        return $class::query()
            ->select(['id', 'code', 'name'])
            ->orderBy('name', 'asc')
            ->get();
    }
}
