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

// Jobs
use App\Jobs\StoreFromApi;
use App\Jobs\UpdatePostcodeId;

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
     * @param string $roleId
     * @return JsonResponse
     */
    public function storeFromApi(string $roleId): JsonResponse
    {
        StoreFromApi::dispatch($roleId);
        $response['organisations'] = [ 'created' => 'Added to queue'];
        $response['postcodes'    ] = [ 'created' => 'Added to queue'];
        $response['org_postcodes'] = [ 'created' => 'Added to queue'];
        return response()->json($response);
    }

    public function updatePostcode(): JsonResponse
    {
        UpdatePostcodeId::dispatch(request()->input('roleId', null));
        return response()->json([ 'response' => 'Added to queue' ]);
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
