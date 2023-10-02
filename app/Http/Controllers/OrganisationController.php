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
        //\DB::enableQueryLog();
        $filters = $this->getFiltersArray();
        $response = $organisationMapService->getMapData($filters);
        //info(\DB::getQueryLog());
        return response()->json($response);
    }

    public function getFiltersArray(): array
    {
        $filterNames = [
            'org_id',
            'name',
            'status',
            'primary_roles',
            'non_primary_roles',
            'last_change_date',
            'postcode',
            'admin_county',
            'admin_district',
            'parliamentary_constituency',
            'pfa',
            'nuts',
            'postcode_area',
            'european_electoral_region',
            'health_authority',
            'primary_care_trust',
            'region',
            'country',
        ];

        $filters = array_reduce($filterNames, function ($result, $item) {
            $result[$item] = request()->input($item, null);
            return $result;
        }, array());

        return $filters;
    }
}
