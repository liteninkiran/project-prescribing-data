<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Role;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Services\Role\RoleService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RoleController extends Controller
{
    protected $roleService;

    public function __construct(
        RoleService $roleService
    ) {
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): LengthAwarePaginator
    {
        DB::enableQueryLog();
        $pager = $this->roleService->getPaginatedRoles([
                'primaryRole' => request()->input('primaryRole', null),
                'roleName' => request()->input('roleName', null),
                '_id' => request()->input('_id', null),
            ],
            request()->input('sortCol', 'id'),
            request()->input('sortOrder', 'asc'),
            request()->input('pageNumber', 2),
            request()->input('pageSize', 5),
        );
        $query = DB::getQueryLog();
        info($query);
        return $pager;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        //
    }

    public function storeFromApi(): int
    {
        return $this->roleService->storeFromApi();
    }
}
