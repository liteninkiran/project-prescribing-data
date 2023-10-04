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
use App\Models\PostcodeArea;
use App\Models\ParliamentaryConstituency;
use App\Models\PoliceForceArea;
use App\Models\PrimaryCareTrust;
use App\Models\Region;
use App\Models\Country;

class PostcodeAttributeLists
{    

    public function getPostcodeAttributes(): array
    {
        return [
            'admin_county'                  => $this->getCollection('App\Models\AdminCounty'),
            'admin_district'                => $this->getCollection('App\Models\AdminDistrict'),
            'parliamentary_constituency'    => $this->getCollection('App\Models\ParliamentaryConstituency'),
            'police_force_area'             => $this->getCollection('App\Models\PoliceForceArea'),
            'nuts'                          => $this->getCollection('App\Models\Nuts'),
            'postcode_area'                 => $this->getCollection('App\Models\PostcodeArea', true),
            'european_electoral_region'     => $this->getCollection('App\Models\EuropeanElectoralRegion'),
            'health_authority'              => $this->getCollection('App\Models\HealthAuthority'),
            'primary_care_trust'            => $this->getCollection('App\Models\PrimaryCareTrust'),
            'region'                        => $this->getCollection('App\Models\Region'),
            'country'                       => $this->getCollection('App\Models\Country'),
        ];
    }

    public function getCollection(string $class, bool $code = false): Collection
    {
        $columns = ['id', 'name'];
        if ($code) {
            $columns[] = 'code';
        }
        return $class::query()
            ->select($columns)
            // ->whereHas('postcodes', function ($q) {
            //     $q->whereNotNull('latitude');
            //     $q->whereNotNull('longitude');
            // })
            ->orderBy('name', 'asc')
            ->get();
    }
}
