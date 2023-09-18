<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Http\Requests\StoreOrganisationRequest;
use App\Http\Requests\UpdateOrganisationRequest;
use App\Services\Organisation\OrganisationService;
use Illuminate\Http\JsonResponse;

class OrganisationController extends Controller
{
    private $organisationService;

    public function __construct(
        OrganisationService $organisationService,
    ) {
        $this->organisationService = $organisationService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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

    public function test($id): JsonResponse
    {
        return response()->json(['test' => $id]);
    }

}
