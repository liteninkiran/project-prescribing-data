<?php

namespace App\Jobs;

// Illuminate
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

// Models
use App\Models\Role;

class StoreAllFromApi implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * __construct
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * handle
     *
     * @return void
     */
    public function handle(): void
    {
        $roles = Role::all();
        $roles->each(function (Role $role) {
            StoreFromApi::dispatch($role);
        });
    }
}
