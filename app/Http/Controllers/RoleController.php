<?php

namespace App\Http\Controllers;

// Illuminate
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Artisan;

// Models
use App\Models\Role;

// Requests
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;

// Services
use App\Services\Role\RoleApiService;
use App\Services\Role\RolePager;
use App\Services\Role\RoleList;

class RoleController extends Controller
{
    
    /**
     * index
     *
     * @param RolePager $rolePager
     * @return LengthAwarePaginator
     */
    public function index(RolePager $rolePager): LengthAwarePaginator
    {
        $filters = [
            'primary_role' => request()->input('primary_role', null),
            'display_name' => request()->input('display_name', null),
            '_id'          => request()->input('_id', null),
        ];
        $pager = $rolePager->getPaginatedRoles(
            $filters,
            request()->input('sortCol', 'id'),
            request()->input('sortOrder', 'asc'),
            request()->input('pageNumber', 0),
            request()->input('pageSize', 10),
        );
        return $pager;
    }
    
    /**
     * storeFromApi
     *
     * @param RoleApiService $roleApiService
     * @return JsonResponse
     */
    public function storeFromApi(RoleApiService $roleApiService): JsonResponse
    {
        $response = $roleApiService->storeFromApi();
        Artisan::call('db:seed', ['--class' => 'RoleIconSeeder']);
        return response()->json($response);
    }
    
    /**
     * allRoles
     *
     * @param RoleList $roleList
     * @return Collection
     */
    public function allRoles(RoleList $roleList): Collection
    {
        return $roleList->allRoles();
    }
}
