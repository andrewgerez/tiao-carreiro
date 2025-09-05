<?php

namespace Database\Factories;

use App\Models\Music;
use Illuminate\Database\Eloquent\Factories\Factory;

class MusicFactory extends Factory
{
    protected $model = Music::class;

    public function definition(): array
    {
        $youtubeId = $this->faker->regexify('[A-Za-z0-9_-]{11}');
        
        return [
            'title' => $this->faker->sentence(3),
            'youtube_url' => "https://www.youtube.com/watch?v={$youtubeId}",
            'youtube_id' => $youtubeId,
            'views' => $this->faker->numberBetween(1000, 50000000),
            'duration' => $this->faker->time('i:s'),
            'thumbnail' => "https://img.youtube.com/vi/{$youtubeId}/mqdefault.jpg",
            'status' => $this->faker->randomElement(['approved', 'pending', 'rejected'])
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
        ]);
    }
}
