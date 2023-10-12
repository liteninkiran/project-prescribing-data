<?php

namespace App\Services\Organisation;

// Illuminate
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

// Models
use App\Models\Role;
use App\Models\Organisation;

class OrganisationViewMapService
{
    /**
     * query
     *
     * @var Builder $query
     */
    private Builder $query;

    /**
     * columns
     *
     * @var string[] $columns
     */
    private array $columns;

    /**
     * limit
     *
     * @var int $limit
     */
    private int $limit = 1000;

    /**
     * organisation
     *
     * @var Organisation $organisation
     */
    private Organisation $organisation;

    /**
     * roleIds
     *
     * @var int[]|null $roleIds
     */
    private array|null $roleIds = null;

    /**
     * radius
     *
     * @var float $radius
     */
    private float $radius;

    /**
     * __construct
     *
     * @return void
     */
    public function __construct()
    {
        $this->query = $this->getQuery();
    }

    /**
     * setRoleIds
     * 
     * @param int[]|null $roleIds
     * @return self
     */
    public function setRoleIds(array|null $roleIds): self
    {
        if ($roleIds) {
            $this->roleIds = $roleIds;
        }
        return $this;
    }

    /**
     * setOrganisation
     * 
     * @param Organisation $organisation
     * @return self
     */
    public function setOrganisation(Organisation $organisation): self
    {
        $this->organisation = $organisation;
        return $this;
    }

    /**
     * setColumns
     *
     * @param string[]|null $columns
     * @return self
     */
    public function setColumns(array|null $columns = null): self
    {
        $defaultColumns = [
            'organisations.id',
            'organisations.name',
            'organisations.org_id',
            'organisations.post_code',
            'organisations.postcode_id',
            'organisations.primary_role_id',
        ];
        $this->columns = ($columns !== null && count($columns)) > 0 ? $columns : $defaultColumns;
        $this->query->select($this->columns);
        return $this;
    }

    /**
     * setLimit
     *
     * @param int $limit
     * @return self
     */
    public function setLimit(int $limit): self
    {
        $this->limit = $limit;
        return $this;
    }

    /**
     * applyRoleFilter
     *
     * @return self
     */
    public function applyRoleFilter(): self
    {
        if ($this->roleIds) {
            $this->query->primaryRolesInRaw($this->roleIds);
        }
        return $this;
    }

    /**
     * execute
     *
     * @return array
     */
    public function execute(): array
    {
        // Initialise empty collection
        $organisations = collect();

        // Load the postcode/primary role for the master organisation
        $this->organistion = $this->organisation
            ->load('postcode:id,latitude,longitude')
            ->load('primaryRole:id,display_name,icon');

        // Include the master organisation in the results
        $organisations->push($this->organistion);

        // Include other organisations by role, if required
        if ($this->roleIds) {
            $organisations->combine($this->query->take($this->limit - 1)->get());
        }

        // Convert to array
        return $organisations->toArray()[0];
    }

    /**
     * getQuery
     *
     * @return Builder
     */
    private function getQuery(): Builder
    {
        return Organisation::query()
            ->with('postcode:id,latitude,longitude')
            ->with('primaryRole:id,_id,display_name,icon')
            ->inRandomOrder();
    }
}
