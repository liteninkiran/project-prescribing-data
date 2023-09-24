<?php

namespace App\Services\Role;

use App\Models\Role;
use Illuminate\Support\Collection;

class RoleList
{    
    /**
     * allRoles
     *
     * @return Collection
     */
    public function allRoles(): Collection
    {
        return Role::query()
            ->select(['id', 'display_name', 'primary_role'])
            ->has('organisations')
            ->orderBy('display_name', 'asc')
            ->orderBy('id', 'asc')
            ->get();
    }
}
