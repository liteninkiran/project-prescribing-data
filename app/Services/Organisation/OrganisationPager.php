<?php

namespace App\Services\Organisation;

// Illuminate
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

// Models
use App\Models\Organisation;
use App\Models\Role;

class OrganisationPager
{    
    /**
     * query
     *
     * @var Builder
     */
    private $query;
    
    /**
     * getPaginatedOrganisations
     *
     * @param string[] $filters
     * @param string $sortCol
     * @param string $sortOrder
     * @param int $pageNumber
     * @param int $pageSize
     * @return LengthAwarePaginator
     */
    public function getPaginatedOrganisations(array $filters = [], string $sortCol = 'id', string $sortOrder = 'asc', int $pageNumber = 0, int $pageSize = 5): LengthAwarePaginator
    {
        $this->initialiseQuery()
            ->addFilters($filters)
            ->addOrderBy($sortCol, $sortOrder);

        // Paginate & return
        return $this->query->paginate($pageSize, ['*'], 'pageNumber', $pageNumber + 1);
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
        $this->query = Organisation::select($selectColumns)
            // For ordering purposes
            ->join('roles', 'roles.id','=','organisations.primary_role_id')

            // Related data
            ->with('primaryRole:id,display_name')
            ->with('postcode:id,latitude,longitude');
        return $this;
    }

    /**
     * addFilters
     *
     * @param string[] $filters
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

    /**
     * addOrderBy
     *
     * @param string $sortCol
     * @param string $sortOrder
     * @return self
     */
    private function addOrderBy(string $sortCol = 'id', string $sortOrder = 'asc'): self
    {
        $this->query->orderBy($sortCol, $sortOrder);
        if ($sortCol !== 'id') { $this->query->orderBy('id', 'asc'); }
        return $this;
    }
}
