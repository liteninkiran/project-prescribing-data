<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Role;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organisation>
 */
class OrganisationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $role = Role::inRandomOrder()->first();
        $randBool = $this->faker->numberBetween(1, 100) < 75;
        $status = $randBool ? 'Active' : 'Inactive';
        $inactive = $randBool ? 0 : 1;
        return [
            'name' => $this->faker->sentence(10),
            'org_id' => $this->faker->sentence(10),
            'status' => $status,
            'inactive' => $inactive,
            'org_record_class' => 'RC1',
            'post_code' => $this->faker->postcode,
            'last_change_date' => $this->faker->date($format = 'Y-m-d', $max = 'now'),
            'primary_role_id' => $role->id,
            'org_link' => $this->faker->url,
        ];
    }
}
