<?php

namespace App\Services\Postcode;

// Illuminate
use Illuminate\Database\Eloquent\Builder;

class PostcodeAttributeList
{    

    private string $class;
    private array $includeRows = [];
    private array $excludeRows = [];
    private array $columns = [];
    private array $orderBy = [];
    private Builder $query;

    public function __construct()
    {
    }

    public function setClass(string $class): self
    {
        $this->class = 'App\Models\\' . $class;
        return $this;
    }

    public function setExcludeRows(array $excludeRows): self
    {
        $this->excludeRows = $excludeRows;
        return $this;
    }

    public function setIncludeRows(array $includeRows): self
    {
        $this->includeRows = $includeRows;
        return $this;
    }

    public function setColumns(array $include): self
    {
        $this->columns = array_merge(['id', 'name'], $include);
        return $this;
    }

    public function setQuery(): self
    {
        $this->query = $this->getQuery();
        return $this;
    }

    public function setOrderBy(array $orderBy): self
    {
        $this->orderBy = $orderBy;
        return $this->addOrderBy();
    }

    public function execute(): array
    {
        $data = $this->query->get()->toArray();
        foreach($this->includeRows as $row) {
            array_push($data, $row);
        }
        return $data;
    }

    private function getQuery(): Builder
    {
        return $this->class::query()
            ->select($this->columns)
            ->when(count($this->excludeRows) > 0, function (Builder $query) {
                $array = array_values($this->excludeRows);
                $query->whereNotIn('name', $array);
            });
    }

    private function addOrderBy(): self
    {
        $this->query->orderBy('name', 'asc');
        return $this;
    }
}
