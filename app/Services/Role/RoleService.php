<?php

namespace App\Services\Role;

use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Query\Builder;
use App\Models\Role;

class RoleService
{    
    /**
     * query
     *
     * @var Builder
     */
    private $query;

    public function storeFromApi(): int
    {
        $url = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/roles';
        $response = Http::get($url);
        $counter = $this->createRoles($response['Roles']);
        return $counter;
    }

    /**
     * getPaginatedRoles
     *
     * @param string[] $filters
     * @param string $sortCol
     * @param string $sortOrder
     * @param int $pageNumber
     * @param int $pageSize
     * @return LengthAwarePaginator
     */
    public function getPaginatedRoles(
        array $filters = [],
        string $sortCol = 'id',
        string $sortOrder = 'asc',
        int $pageNumber = 0,
        int $pageSize = 5
    ): LengthAwarePaginator
    {
        // Initialise query
        $this->query = Role::query();

        // Add filters and order by clause
        $this->addFilters($filters)
            ->addOrderBy($sortCol, $sortOrder);

        // Paginate & return
        return $this->query->paginate($pageSize, ['*'], 'pageNumber', $pageNumber + 1);
    }

    /**
     * addFilters
     *
     * @param string[] $filters
     * @return self
     */
    private function addFilters(array $filters): self
    {
        foreach ($filters as $key => $value) {
            $operator = $key === 'primary_role' ? '=' : 'LIKE';
            $compare = $key === 'primary_role' ? $value === 'false' ? 0 : 1 : '%' . $value . '%';
            $this->addFilter($value, $key, $operator, $compare);
        }
        return $this;
    }

    /**
     * addFilter
     *
     * @param string|null $filter
     * @param string $field
     * @param string $operator
     * @param mixed $compare
     * @return self
     */
    private function addFilter(string | null $filter, string $field, string $operator, mixed $compare): self
    {
        if ($filter) {
            $this->query->where($field, $operator, $compare);
        }
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
    
    /**
     * createRoles
     *
     * @param mixed $roles
     * @return int
     */
    private function createRoles(array $roles): int
    {
        $counter = 0;
        foreach ($roles as $role) {
            $counter += $this->createRole((object)$role);
        }
        return $counter;
    }
    
    /**
     * createRole
     *
     * @param mixed $role
     * @return int
     */
    private function createRole($role): int
    {
        $r = Role::where('code', $role->code)->first();
        if (is_null($r)) {
            Role::create([
                '_id' => $role->id,
                'code' => $role->code,
                'display_name' => $role->displayName,
                'primary_role' => $role->primaryRole === 'true',
            ]);
        }
        return is_null($r) ? 1 : 0;
    }
}
