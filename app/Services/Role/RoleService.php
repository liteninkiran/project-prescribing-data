<?php

namespace App\Services\Role;

use Illuminate\Support\Facades\Http;
use App\Models\Role;

class RoleService
{    
    /**
     * storeFromApi
     *
     * @return int
     */
    public function storeFromApi(): int
    {
        $url = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/roles';
        $response = Http::get($url);
        $counter = $this->createRoles($response['Roles']);
        return $counter;
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
