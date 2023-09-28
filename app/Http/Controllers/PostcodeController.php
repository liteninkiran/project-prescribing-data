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
use App\Services\Postcode\PostcodeApiService;

class PostcodeController extends Controller
{
    public function index()
    {
        //
    }

    public function storeFromApi(PostcodeService $postcodeService): JsonResponse
    {
        $response = $postcodeService->storeFromApi(request()->input('postcodes', []));
        return response()->json($response);
    }

    public function storeFromApiAutoCreate(PostcodeApiService $postcodeService): JsonResponse
    {
        $response = $postcodeService->storeFromApiAutoCreate();
        return response()->json($response);
    }

    public function storeFromApiAutoUpdate(PostcodeApiService $postcodeService): JsonResponse
    {
        $response = $postcodeService->storeFromApiAutoUpdate();
        return response()->json($response);
    }
}
