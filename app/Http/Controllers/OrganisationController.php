<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Http\Requests\StoreOrganisationRequest;
use App\Http\Requests\UpdateOrganisationRequest;
use App\Services\Organisation\OrganisationService;
use App\Services\Organisation\OrganisationPager;
use Illuminate\Http\JsonResponse;

class OrganisationController extends Controller
{
    private $organisationService;
    private $organisationPager;

    public function __construct(
        OrganisationService $organisationService,
        OrganisationPager $organisationPager,
    ) {
        $this->organisationService = $organisationService;
        $this->organisationPager = $organisationPager;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // \DB::enableQueryLog();
        $filters = [
            'org_id'            => request()->input('org_id', null),
            'name'              => request()->input('name', null),
            'postcode'          => request()->input('postcode', null),
            'primary_roles'     => request()->input('primary_roles', null),
            'non_primary_roles' => request()->input('non_primary_roles', null),
            'last_change_date'  => request()->input('last_change_date', null),
        ];
        $pager = $this->organisationPager->getPaginatedOrganisations(
            $filters,
            request()->input('sortCol', 'id'),
            request()->input('sortOrder', 'asc'),
            request()->input('pageNumber', 0),
            request()->input('pageSize', 10),
        );
        // $query = \DB::getQueryLog();
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
    public function store(StoreOrganisationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Organisation $organisation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organisation $organisation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrganisationRequest $request, Organisation $organisation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organisation $organisation)
    {
        //
    }

    public function storeFromApi(string $roleId): JsonResponse
    {
        $response = $this->organisationService->storeFromApi($roleId);
        return response()->json($response);
    }
}
