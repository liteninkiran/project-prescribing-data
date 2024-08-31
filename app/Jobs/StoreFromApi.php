<?php

namespace App\Jobs;

// Illuminate
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

// Services
use App\Services\Organisation\OrganisationApiService;
use App\Services\Postcode\PostcodeApiService;

// Models
use App\Models\Role;

class StoreFromApi implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private Role $role;

    private OrganisationApiService $orgService;

    private PostcodeApiService $pocoService;
    
    /**
     * __construct
     *
     * @param string $roleId
     * @return void
     */
    public function __construct(Role $role)
    {
        $this->role = $role;
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
        $this->orgService = $organisationApiService;
        $this->pocoService = $postcodeApiService;
        $this->updateOrCreateOrganisations();
    }

    private function updateOrCreateOrganisations(): void
    {
        info("Started running job for role {$this->role->display_name} ({$this->role->_id})");

        $this->orgService->setRole($this->role->_id);
        $lastUpdated = $this->orgService->getOrgLastUpdated();

        if ($lastUpdated <= Carbon::now()->subDays(2)) {
            $this->orgService->setOrgLastUpdated(true)->storeFromApi();
            info('Stored organisations');
            $this->pocoService->storeFromApiAutoCreate($this->role->_id);
            info('Stored postcodes');
            $this->orgService->updatePostcodeId()->setOrgLastUpdated(false);
            info('Linked postcodes');
        } else {
            info('Skipping. Last updated: ' . $lastUpdated->format('Y-m-d H:i:s'));
        }

        info("Finished running job for role {$this->role->display_name} ({$this->role->_id})");
    }
}
