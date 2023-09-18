<?php

namespace App\Services\Role;

use Illuminate\Support\Facades\Http;
use App\Models\Role;

class RoleService
{
    private $created = 0;
    private $updated = 0;

    /**
     * storeFromApi
     *
     * @return array
     */
    public function storeFromApi(): array
    {
        $url = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/roles';
        $response = Http::get($url);
        $this->createRoles($response['Roles']);
        return [
            'created' => $this->created,
            'updated' => $this->updated,
        ];
    }

    /**
     * createRoles
     *
     * @param mixed $roles
     * @return void
     */
    private function createRoles(array $roles): void
    {
        foreach ($roles as $role) {
            $obj = (object)$role;
            $this->createRole($obj);
        }
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
        } else {
            $this->created ++;
        }
        $roleModel->save();
        if ($roleModel->wasChanged()) {
            $this->updated ++;
        }
    }
}
