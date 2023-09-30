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
        $this->query = Organisation::query()
            ->with('postcode:id,latitude,longitude')
            ->with('primaryRole:id,display_name')
            ->select($selectColumns)
            ->whereHas('postcode', function ($q) {
                $q->whereNotNull('latitude');
                $q->whereNotNull('longitude');
            })
            ->orderBy('org_id');

        return $this;
    }

    private function addFilters(array $filters): self
    {
        if ($filters['org_id']) { $this->query->orgIdLike($filters['org_id']); }
        if ($filters['name']) { $this->query->nameLike($filters['name']); }
        if ($filters['postcode']) { $this->query->postcodeLike($filters['postcode']); }
        if ($filters['primary_roles']) { $this->query->primaryRolesInRaw($filters['primary_roles']); }
        if ($filters['last_change_date']) { $this->query->lastChangeDateAfter($filters['last_change_date']); }
        if ($filters['status']) { $this->query->status($filters['status']); }
        return $this;
    }

}
