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
        $org_last_updated = $this->faker->dateTimeBetween($startDate = '-1 years', $endDate = 'now');
        return [
            '_id' => 'RO' . $nextId,
            'code' => $nextId,
            'display_name' => $this->faker->unique()->word,
            'primary_role' => $this->faker->numberBetween($min = 1, $max = 1000) > 500,
            'org_last_updated' => $this->faker->numberBetween($min = 1, $max = 100) < 75 ? null : $org_last_updated,
            'created_at' => $this->faker->dateTimeBetween($startDate = '-3 years', $endDate = 'now'),
            'updated_at' => $this->faker->dateTimeBetween($startDate = '-3 years', $endDate = 'now'),
        ];
    }
}
