<?php

namespace App\Jobs;

// Illuminate
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

// Services
use App\Services\Organisation\OrganisationApiService;
use App\Services\Postcode\PostcodeApiService;

class StoreFromApi implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $roleId;
    
    /**
     * __construct
     *
     * @param string $roleId
     * @return void
     */
    public function __construct(string $roleId)
    {
        $this->roleId = $roleId;
    }

    /**
     * handle
     *
     * @param OrganisationApiService $organisationApiService
     * @param PostcodeApiService $postcodeApiService
     * @return void
     */
    public function handle(
        OrganisationApiService $organisationApiService,
        PostcodeApiService $postcodeApiService,
    ): void
    {
        $response['organisations'] = $organisationApiService->storeFromApi($this->roleId);
        $response['postcodes'] = $postcodeApiService->storeFromApiAutoCreate($this->roleId);
        $response['org_postcodes'] = $organisationApiService->updatePostcodeId($this->roleId);
    }
}
