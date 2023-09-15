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
     * @param string $filter
     * @param string $sortCol
     * @param string $sortOrder
     * @param int $pageNumber
     * @param int $pageSize
     * @return LengthAwarePaginator
     */
    public function getPaginatedRoles(
        string $filter = null,
        string $sortCol = 'id',
        string $sortOrder = 'asc',
        int $pageNumber = 0,
        int $pageSize = 5
    ): LengthAwarePaginator {
        $query = Role::query();
        if ($filter) {
            $query->where('display_name', 'LIKE', '%' . $filter . '%');
        }
        $query->orderBy($sortCol, $sortOrder);
        if ($sortCol !== 'id') {
            $query->orderBy('id', 'asc');
        }
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
