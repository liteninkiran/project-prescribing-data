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

class UpdatePostcodeId implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $roleId = null;

    /**
     * __construct
     *
     * @param string|null $roleId
     * @return void
     */
    public function __construct(string|null $roleId)
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
    ): void
    {
        $response['org_postcodes'] = $organisationApiService->updatePostcodeId($this->roleId);
    }
}
