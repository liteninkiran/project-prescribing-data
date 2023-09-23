<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Role;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Services\Role\RoleService;
use App\Services\Role\RolePager;
use App\Services\Role\RoleList;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

class RoleController extends Controller
{
    private $roleService;
    private $rolePager;
    private $roleList;

    public function __construct(
        RoleService $roleService,
        RolePager $rolePager,
        RoleList $roleList,
    ) {
        $this->roleService = $roleService;
        $this->rolePager = $rolePager;
        $this->roleList = $roleList;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): LengthAwarePaginator
    {
        // DB::enableQueryLog();
        $pager = $this->rolePager->getPaginatedRoles([
                'primary_role' => request()->input('primary_role', null),
                'display_name' => request()->input('display_name', null),
                '_id' => request()->input('_id', null),
            ],
            request()->input('sortCol', 'id'),
            request()->input('sortOrder', 'asc'),
            request()->input('pageNumber', 0),
            request()->input('pageSize', 10),
        );
        // $query = DB::getQueryLog();
        // info($query);
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

    public function storeFromApi(): JsonResponse
    {
        $response = $this->roleService->storeFromApi();
        return response()->json($response);
    }

    public function allRoles(): Collection
    {
        return $this->roleList->allRoles();
    }
}
