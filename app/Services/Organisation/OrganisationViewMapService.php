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
     * defaultColumns
     *
     * @var string[] $defaultColumns
     */
    private array $defaultColumns = [
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
     * lat
     *
     * @var float $lat
     */
    private float $lat;

    /**
     * long
     *
     * @var float $long
     */
    private float $long;

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
            $this->query->primaryRolesInRaw($roleIds);
        }
        return $this;
    }

    /**
     * setStatus
     * 
     * @param int|null $status
     * @return self
     */
    public function setStatus(int|null $status): self
    {
        if ($status !== null) {
            $this->query->status($status);
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
        $this->lat = $organisation->postcode->latitude;
        $this->long = $organisation->postcode->longitude;
        return $this;
    }

    /**
     * setColumns
     *
     * @param string[]|null $columns
     * @return self
     */
    public function setColumns(array $columns = null): self
    {
        $this->query->select($this->columns ?? $this->defaultColumns);
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
     * setRadius
     *
     * @param float $radius
     * @return self
     */
    public function setRadius(float|null $radius): self
    {
        if ($radius !== null) {
            $this->radius = $radius;
            $this->query->withinDistanceOf($radius, $this->lat, $this->long);
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
            $otherOrgs = $this->query->take($this->limit - 1)->get();
            $organisations = $organisations->concat($otherOrgs);
        }

        // Convert to array
        return $organisations->toArray();
    }

    /**
     * getQuery
     *
     * @return Builder
     */
    private function getQuery(): Builder
    {
        return Organisation::query()
            ->join('roles', 'roles.id', '=', 'organisations.primary_role_id')
            ->with('postcode:id,latitude,longitude')
            ->with('primaryRole:id,_id,display_name,icon')
            ->orderBy('roles.display_name')
            ->orderBy('organisations.name');
    }
}
