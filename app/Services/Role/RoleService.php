<?php

namespace App\Services\Role;

use Illuminate\Support\Facades\Http;
use App\Models\Role;

class RoleService
{    
    /**
     * storeFromApi
     *
     * @return void
     */
    public function storeFromApi(): void
    {
        $url = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/roles';
        $response = Http::get($url);
        $this->createRoles($response['Roles']);
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
     * @return void
     */
    private function createRole($role): void
    {
        $attributes = [
            '_id' => $role->id,
            'code' => $role->code,
        ];
        $values = [
            'display_name' => $role->displayName,
            'primary_role' => $role->primaryRole === 'true' ? 1 : 0,
        ];
        $roleModel = Role::firstOrNew($attributes, $values);
        if(isset($roleModel->id)) {
            $roleModel->display_name = $values['display_name'];
            $roleModel->primary_role = $values['primary_role'];
        }
        $roleModel->save();
    }
}
