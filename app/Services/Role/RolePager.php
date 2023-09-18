<?php

namespace App\Services\Role;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Query\Builder;
use App\Models\Role;

class RolePager
{    
    /**
     * query
     *
     * @var Builder
     */
    private $query;
    
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
    public function getPaginatedRoles(array $filters = [], string $sortCol = 'id', string $sortOrder = 'asc', int $pageNumber = 0, int $pageSize = 5): LengthAwarePaginator
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
}
