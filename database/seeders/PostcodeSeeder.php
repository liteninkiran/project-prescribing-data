<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Postcode;

class PostcodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $numRows = rand(10, 50);
        for ($i = 0; $i <= $numRows; $i++) {
            Postcode::factory()->create();
        }
    }
}
