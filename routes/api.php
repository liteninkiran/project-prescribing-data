<?php

// Illuminate
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\RoleController;
use App\Http\Controllers\OrganisationController;
use App\Http\Controllers\PostcodeController;

// Models
use App\Models\Role;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('roles/store_from_api', [RoleController::class, 'storeFromApi']);
Route::get('roles/rolesList', [RoleController::class, 'allRoles']);
Route::get('roles', [RoleController::class, 'index']);

Route::post('organisations/update_postcode', [OrganisationController::class, 'updatePostcode']);
Route::post('organisations/store_from_api/{role:_id}', [OrganisationController::class, 'storeFromApi']);
Route::get('organisations/{organisation:org_id}', [OrganisationController::class, 'show']);
Route::get('organisations-map', [OrganisationController::class, 'getMapData']);
Route::get('organisations', [OrganisationController::class, 'index']);

Route::post('postcodes/store_from_api', [PostcodeController::class, 'storeFromApi']);
Route::post('postcodes/store_from_api_auto_create', [PostcodeController::class, 'storeFromApiAutoCreate']);
Route::post('postcodes/store_from_api_auto_update', [PostcodeController::class, 'storeFromApiAutoUpdate']);
Route::get('postcodes/postcode_attributes', [PostcodeController::class, 'getPostcodeAttributes']);
Route::get('postcodes', [PostcodeController::class, 'index']);
