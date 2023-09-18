<?php

namespace App\Services\Role;

use App\Models\Role;
use Illuminate\Support\Collection;

class RoleList
{    
    /**
     * getRolesList
     *
     * @return Collection
     */
    public function getRolesList(): Collection
    {
        return Role::query()
            ->select(['id', 'display_name', 'primary_role'])
            ->orderBy('display_name', 'asc')
            ->orderBy('id', 'asc')
            ->get();
    }
}
