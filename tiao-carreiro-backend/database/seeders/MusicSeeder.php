<?php

namespace Database\Seeders;

use App\Models\Music;
use Illuminate\Database\Seeder;

class MusicSeeder extends Seeder
{
    public function run(): void
    {
        $musics = [
            [
                'title' => 'Rei do Gado',
                'youtube_url' => 'https://www.youtube.com/watch?v=example1',
                'youtube_id' => 'example1',
                'views' => 15000000,
                'status' => 'approved'
            ],
            [
                'title' => 'Pagode em Brasília',
                'youtube_url' => 'https://www.youtube.com/watch?v=example2',
                'youtube_id' => 'example2',
                'views' => 12000000,
                'status' => 'approved'
            ],
            [
                'title' => 'Boi Soberano',
                'youtube_url' => 'https://www.youtube.com/watch?v=example3',
                'youtube_id' => 'example3',
                'views' => 10000000,
                'status' => 'approved'
            ],
            [
                'title' => 'Chico Mineiro',
                'youtube_url' => 'https://www.youtube.com/watch?v=example4',
                'youtube_id' => 'example4',
                'views' => 8000000,
                'status' => 'approved'
            ],
            [
                'title' => 'As Andorinhas',
                'youtube_url' => 'https://www.youtube.com/watch?v=example5',
                'youtube_id' => 'example5',
                'views' => 7000000,
                'status' => 'approved'
            ],
            [
                'title' => 'Moda da Pinga',
                'youtube_url' => 'https://www.youtube.com/watch?v=example6',
                'youtube_id' => 'example6',
                'views' => 6000000,
                'status' => 'approved'
            ]
        ];

        foreach ($musics as $music) {
            Music::create($music);
        }
    }
}
