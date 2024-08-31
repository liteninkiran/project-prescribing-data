<?php

namespace App\Http\Controllers;

// Illuminate
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

// Models
use App\Models\Organisation;
use App\Models\Role;

// Services
use App\Services\Organisation\OrganisationMapService;
use App\Services\Organisation\OrganisationPager;
use App\Services\Organisation\OrganisationViewMapService;

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
        // \DB::enableQueryLog();
        $response = $organisationPager->getPaginatedOrganisations(
            $this->getFiltersArray(),
            request()->input('sortCol', 'id'),
            request()->input('sortOrder', 'asc'),
            request()->input('pageNumber', 0),
            request()->input('pageSize', 10),
        );
        // info(\DB::getQueryLog());
        return $response;
    }

    /**
     * storeFromApi
     *
     * @param Role $role
     * @return JsonResponse
     */
    public function storeFromApi(Role $role): JsonResponse
    {
        $dispatch = $role->org_last_updated !== '1970-01-01 00:00:01';
        StoreFromApi::dispatchIf($dispatch, $role);
        return response()->json([ 'response' => 'Added to queue' ]);
    }

    /**
     * show
     *
     * @param Organisation $organisation
     * @return JsonResponse
     */
    public function show(OrganisationViewMapService $organisationViewMapService, Organisation $organisation): JsonResponse
    {
        // \DB::enableQueryLog();
        $organisations = $organisationViewMapService
            ->setColumns()
            ->setOrganisation($organisation)
            ->setRoleIds(request()->input('primary_roles', null))
            ->setStatus(request()->input('status', 0))
            ->setRadius(request()->input('radius', null))
            ->execute();
        // info(\DB::getQueryLog());

        return response()->json($organisations);
    }

    public function updatePostcode(): JsonResponse
    {
        UpdatePostcodeId::dispatch(request()->input('roleId', null));
        return response()->json([ 'response' => 'Added to queue' ]);
    }

    public function getMapData(OrganisationMapService $organisationMapService): JsonResponse
    {
        // \DB::enableQueryLog();
        $filters = $this->getFiltersArray();
        $response = $organisationMapService->getMapData($filters);
        // info(\DB::getQueryLog());
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
