<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Organisation;

class OrganisationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $numRows = rand(500, 9999);
        for ($i = 0; $i <= $numRows; $i++) {
            Organisation::factory()->create();
        }
    }
}
