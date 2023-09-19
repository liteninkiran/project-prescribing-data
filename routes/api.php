<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\OrganisationController;

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
Route::resource('roles', RoleController::class);

Route::get('organisations/store_from_api/{roleId}', [OrganisationController::class, 'storeFromApi']);
Route::resource('organisations', OrganisationController::class);
