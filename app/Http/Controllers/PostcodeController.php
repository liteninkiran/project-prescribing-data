<?php

namespace App\Http\Controllers;

// Illuminate
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

// Models
use App\Models\Postcode;

// Requests
use App\Http\Requests\StorePostcodeRequest;
use App\Http\Requests\UpdatePostcodeRequest;

// Services
use App\Services\Postcode\PostcodeService;

class PostcodeController extends Controller
{
    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(StorePostcodeRequest $request)
    {
        //
    }

    public function show(Postcode $postcode)
    {
        //
    }

    public function edit(Postcode $postcode)
    {
        //
    }

    public function update(UpdatePostcodeRequest $request, Postcode $postcode)
    {
        //
    }

    public function destroy(Postcode $postcode)
    {
        //
    }

    public function storeFromApi(PostcodeService $postcodeService): JsonResponse
    {
        $response = $postcodeService->storeFromApi(request()->input('postcodes', []));
        return response()->json($response);
    }

    public function storeFromApiAutoCreate(PostcodeService $postcodeService): JsonResponse
    {
        $response = $postcodeService->storeFromApiAutoCreate();
        return response()->json($response);
    }

    public function storeFromApiAutoUpdate(PostcodeService $postcodeService): JsonResponse
    {
        $response = $postcodeService->storeFromApiAutoUpdate();
        return response()->json($response);
    }
}
