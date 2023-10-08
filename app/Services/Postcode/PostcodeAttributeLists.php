<?php

namespace App\Services\Postcode;

// Illuminate
use Illuminate\Database\Eloquent\Builder;

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
    private PostcodeAttributeList $postcodeAttributeList;

    public function __construct(
        PostcodeAttributeList $postcodeAttributeList
    ) {
        $this->postcodeAttributeList = $postcodeAttributeList;
    }

    public function getPostcodeAttributes(): array
    {
        $excludeRows = [
            'country' => [ 'Channel Islands', 'Isle of Man' ],
        ];
        $includeRows = [
            'admin_county' => [[ 'id' => 0, 'name' => 'NULL' ]],
        ];
        return [
            'admin_county'                  => $this->getAttributeList('AdminCounty', [], $includeRows['admin_county']),
            'admin_district'                => $this->getAttributeList('AdminDistrict'),
            'parliamentary_constituency'    => $this->getAttributeList('ParliamentaryConstituency'),
            'police_force_area'             => $this->getAttributeList('PoliceForceArea'),
            'nuts'                          => $this->getAttributeList('Nuts'),
            'postcode_area'                 => $this->getAttributeList('PostcodeArea', [], [], ['code']),
            'european_electoral_region'     => $this->getAttributeList('EuropeanElectoralRegion'),
            'health_authority'              => $this->getAttributeList('HealthAuthority'),
            'primary_care_trust'            => $this->getAttributeList('PrimaryCareTrust'),
            'region'                        => $this->getAttributeList('Region'),
            'country'                       => $this->getAttributeList('Country', $excludeRows['country']),
        ];
    }

    public function getAttributeList(string $class, array $excludeRows = [], array $includeRows = [], array $includeColumns = []): array
    {
        return $this->postcodeAttributeList
            ->setClass($class)
            ->setExcludeRows($excludeRows)
            ->setIncludeRows($includeRows)
            ->setColumns($includeColumns)
            ->setModels()
            ->setExtraModels()
            ->getModels();
    }
}
