<?php

namespace App\Http\Controllers;

// Illuminate
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

// Models
use App\Models\Organisation;

// Services
use App\Services\Organisation\OrganisationApiService;
use App\Services\Organisation\OrganisationMapService;
use App\Services\Organisation\OrganisationPager;
use App\Services\Postcode\PostcodeApiService;

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
        $filters = $this->getFiltersArray();
        $pager = $organisationPager->getPaginatedOrganisations(
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
     * @param OrganisationApiService $organisationApiService
     * @param PostcodeApiService $postcodeApiService
     * @param string $roleId
     * @return JsonResponse
     */
    public function storeFromApi(OrganisationApiService $organisationApiService, PostcodeApiService $postcodeApiService, string $roleId): JsonResponse
    {
        $response['organisations'] = $organisationApiService->storeFromApi($roleId);
        $response['postcodes'] = $postcodeApiService->storeFromApiAutoCreate($roleId);
        $response['org_postcodes'] = $organisationApiService->updatePostcodeId($roleId);
        return response()->json($response);
    }

    public function updatePostcode(OrganisationApiService $organisationApiService): JsonResponse
    {
        $response = $organisationApiService->updatePostcodeId(request()->input('roleId', null));
        return response()->json($response);
    }

    public function getMapData(OrganisationMapService $organisationMapService): JsonResponse
    {
        $filters = $this->getFiltersArray();
        $response = $organisationMapService->getMapData($filters);
        return response()->json($response);
    }

    public function getFiltersArray(): array
    {
        return [
            'org_id'            => request()->input('org_id', null),
            'name'              => request()->input('name', null),
            'status'            => request()->input('status', null),
            'primary_roles'     => request()->input('primary_roles', null),
            'non_primary_roles' => request()->input('non_primary_roles', null),
            'last_change_date'  => request()->input('last_change_date', null),
            'postcode'          => request()->input('postcode', null),
            'admin_county'      => request()->input('admin_county', null),
            'admin_district'    => request()->input('admin_district', null),
        ];
    }
}
