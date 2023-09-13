<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Role;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $seed = $this->faker->numberBetween($min = 200, $max = 500);
        $maxId = Role::max('code');
        $nextId = $maxId === null ? $seed : $maxId + 1;
        return [
            '_id' => 'RO' . $nextId,
            'code' => $nextId,
            'display_name' => $this->faker->company,
            'primary_role' => $this->faker->numberBetween($min = 1, $max = 1000) > 500,
        ];
    }
}
