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
    private array $models = [];

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

    public function setModels(): self
    {
        $this->models = $this->getModelsQuery()->get()->toArray();
        return $this;
    }

    public function getModels(): array
    {
        return $this->models;
    }

    public function setExtraModels(): self
    {
        foreach($this->includeRows as $row) {
            array_push($this->models, $row);
        }
        return $this;
    }

    private function getModelsQuery(): Builder
    {
        return $this->class::query()
            ->select($this->columns)
            ->when(count($this->excludeRows) > 0, function (Builder $query) {
                $query->whereNotIn(
                    array_keys($this->excludeRows)[0],
                    array_values($this->excludeRows)
                );
            })
            ->orderBy('name', 'asc');
    }
}
