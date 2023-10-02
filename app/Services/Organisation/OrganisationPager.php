<?php

namespace App\Services\Organisation;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
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
            'id',
            'name',
            'org_id',
            'status',
            'org_record_class',
            'post_code',
            'postcode_id',
            'last_change_date',
            'primary_role_id',
            'org_link',
            'created_at',
            'updated_at',
        ];
        $this->query = Organisation::select($selectColumns)
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
