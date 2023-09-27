<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Postcode>
 */
class PostcodeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $postcode = $this->faker->unique()->postcode;
        $codes = explode(' ', $postcode);
        return [
            'postcode' => $postcode,
            'incode' => $codes[0],
            'outcode' => $codes[1],
            'country' => $this->faker->country,
            'quality' => $this->faker->numberBetween(1, 100),
        ];
    }
}
