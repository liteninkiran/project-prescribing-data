<?php

namespace App\Http\Controllers;

// Illuminate
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

// Models
use App\Models\Organisation;

// Requests
use App\Http\Requests\StoreOrganisationRequest;
use App\Http\Requests\UpdateOrganisationRequest;

// Services
use App\Services\Organisation\OrganisationService;
use App\Services\Organisation\OrganisationPager;

class OrganisationController extends Controller
{
    
    /**
     * index
     *
     * @param OrganisationPager $organisationPager
     * @return LengthAwarePaginator
     */
    public function index(OrganisationPager $organisationPager): LengthAwarePaginator
    {
        $filters = [
            'org_id'            => request()->input('org_id', null),
            'name'              => request()->input('name', null),
            'postcode'          => request()->input('postcode', null),
            'primary_roles'     => request()->input('primary_roles', null),
            'non_primary_roles' => request()->input('non_primary_roles', null),
            'last_change_date'  => request()->input('last_change_date', null),
            'status'            => request()->input('status', null),
        ];
        $pager = $organisationPager->getPaginatedOrganisations(
            $filters,
            request()->input('sortCol', 'id'),
            request()->input('sortOrder', 'asc'),
            request()->input('pageNumber', 0),
            request()->input('pageSize', 10),
        );
        return $pager;
    }

    public function create()
    {
        //
    }

    public function store(StoreOrganisationRequest $request)
    {
        //
    }

    public function show(Organisation $organisation)
    {
        //
    }

    public function edit(Organisation $organisation)
    {
        //
    }

    public function update(UpdateOrganisationRequest $request, Organisation $organisation)
    {
        //
    }

    public function destroy(Organisation $organisation)
    {
        //
    }
    
    /**
     * storeFromApi
     *
     * @param OrganisationService $organisationService
     * @param string $roleId
     * @return JsonResponse
     */
    public function storeFromApi(OrganisationService $organisationService, string $roleId): JsonResponse
    {
        $response = $organisationService->storeFromApi($roleId);
        return response()->json($response);
    }
}
