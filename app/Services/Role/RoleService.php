<?php

namespace App\Services\Role;

use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Role;

class RoleService
{
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
    ): LengthAwarePaginator {
        // Initialise query
        $query = Role::query();

        // Add filters
        if ($filters['primaryRole']) { $query->where('primary_role', $filters['primaryRole'] === 'false' ? 0 : 1); }
        if ($filters['roleName']) { $query->where('display_name', 'LIKE', '%' . $filters['roleName'] . '%'); }
        if ($filters['_id']) { $query->where('_id', 'LIKE', '%' . $filters['_id'] . '%'); }

        // Add order by clause
        $query->orderBy($sortCol, $sortOrder);
        if ($sortCol !== 'id') { $query->orderBy('id', 'asc'); }

        // Paginate & return
        return $query->paginate($pageSize, ['*'], 'pageNumber', $pageNumber + 1);
    }

    private function createRoles(array $roles): int {
        $counter = 0;
        foreach ($roles as $role) {
            $counter += $this->createRole((object)$role);
        }
        return $counter;
    }

    private function createRole($role): int {
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
