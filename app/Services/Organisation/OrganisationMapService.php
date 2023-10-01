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
        $selectColumns = [
            'organisations.id',
            'organisations.name',
            'organisations.org_id',
            'organisations.status',
            'organisations.org_record_class',
            'organisations.post_code',
            'organisations.postcode_id',
            'organisations.last_change_date',
            'organisations.primary_role_id',
            'organisations.org_link',
            'organisations.created_at',
            'organisations.updated_at',
        ];
        $this->query = Organisation::query()
            ->with('postcode:id,latitude,longitude')
            ->with('primaryRole:id,_id,display_name,icon')
            ->select($selectColumns)
            ->whereHas('postcode', function ($q) {
                $q->whereNotNull('latitude');
                $q->whereNotNull('longitude');
            })
            ->inRandomOrder();

        return $this;
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
        if ($filters['status']) { $this->query->status($filters['status']); }
        if ($filters['primary_roles']) { $this->query->primaryRolesInRaw($filters['primary_roles']); }
        if ($filters['last_change_date']) { $this->query->lastChangeDateAfter($filters['last_change_date']); }
        if ($filters['postcode']) { $this->query->postcodeLike($filters['postcode']); }
        if ($filters['admin_county']) { $this->query->adminCountiesInRaw($filters['admin_county']); }
        if ($filters['admin_district']) { $this->query->adminDistrictsInRaw($filters['admin_district']); }
        if ($filters['parliamentary_constituency']) { $this->query->parliamentaryConstituenciesInRaw($filters['parliamentary_constituency']); }
        if ($filters['pfa']) { $this->query->policeForceAreaInRaw($filters['pfa']); }
        if ($filters['nuts']) { $this->query->nutsInRaw($filters['nuts']); }
        return $this;
    }

}
