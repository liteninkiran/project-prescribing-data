<?php

namespace App\Services\Organisation;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Query\Builder;
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

        // $this->query->primaryRolesIn([
        //     'RO103',
        //     'RO105',
        // ]);

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
        $this->query = Organisation::with('primaryRole:id,display_name');
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
        if ($filters) {
            foreach ($filters as $key => $value) {
                $operator = 'LIKE';
                $compare = '%' . $value . '%';
                $this->addFilter($value, $key, $operator, $compare);
            }
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
