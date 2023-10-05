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
    /**
     * query
     *
     * @var Builder $query
     */
    private $query;

    /**
     * query
     *
     * @var int $limit
     */
    private $limit = 1000;

    /**
     * getMapData
     *
     * @param array $filters
     * @return array
     */
    public function getMapData(array $filters = []): array
    {
        $this->initialiseQuery()->addFilters($filters);
        $total = $this->query->count();
        $results = $this->query->take($this->limit)->get()->toArray();
        return [
            'data' => $results,
            'total' => $total,
            'limit' => $this->limit,
            'limit_exceeded' => count($results) === $this->limit,
        ];
    }

    /**
     * initialiseQuery
     *
     * @return self
     */
    private function initialiseQuery(): self
    {
        $this->query = Organisation::query()
            ->with('postcode:id,latitude,longitude')
            ->with('primaryRole:id,_id,display_name,icon')
            ->select($this->getSelectColumns());
            //->inRandomOrder();

        return $this;
    }

    private function getSelectColumns(): array
    {
        return [
            'organisations.id',
            'organisations.name',
            'organisations.org_id',
            'organisations.post_code',
            'organisations.postcode_id',
            'organisations.primary_role_id',
        ];
    }
    
    /**
     * addFilters
     *
     * @param array $filters
     * @return self
     */
    private function addFilters(array $filters): self
    {
        if ($filters['org_id']) { $this->query->orgIdLike($filters['org_id']); }
        if ($filters['name']) { $this->query->nameLike($filters['name']); }
        if ($filters['status'] !== null) { $this->query->status($filters['status']); }
        if ($filters['primary_roles']) { $this->query->primaryRolesInRaw($filters['primary_roles']); }
        if ($filters['last_change_date']) { $this->query->lastChangeDateAfter($filters['last_change_date']); }
        if ($filters['postcode']) { $this->query->postcodeLike($filters['postcode']); }
        if ($filters['admin_county']) { $this->query->adminCountiesInRaw($filters['admin_county']); }
        if ($filters['admin_district']) { $this->query->adminDistrictsInRaw($filters['admin_district']); }
        if ($filters['parliamentary_constituency']) { $this->query->parliamentaryConstituenciesInRaw($filters['parliamentary_constituency']); }
        if ($filters['pfa']) { $this->query->policeForceAreaInRaw($filters['pfa']); }
        if ($filters['nuts']) { $this->query->nutsInRaw($filters['nuts']); }
        if ($filters['postcode_area']) { $this->query->postcodeAreaInRaw($filters['postcode_area']); }
        if ($filters['european_electoral_region']) { $this->query->europeanElectoralRegionInRaw($filters['european_electoral_region']); }
        if ($filters['health_authority']) { $this->query->healthAuthorityInRaw($filters['health_authority']); }
        if ($filters['primary_care_trust']) { $this->query->primaryCareTrustInRaw($filters['primary_care_trust']); }
        if ($filters['region']) { $this->query->regionInRaw($filters['region']); }
        if ($filters['country']) { $this->query->countryInRaw($filters['country']); }
        return $this;
    }
}
