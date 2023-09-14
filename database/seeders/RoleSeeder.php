<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use Faker\Generator;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $numRows = rand(200, 999);
        for ($i = 0; $i <= $numRows; $i++) {
            Role::factory()->create();
        }
    }
}
