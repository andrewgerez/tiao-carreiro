<?php

namespace Tests\Feature\Api;

use App\Models\Music;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Mockery;
use Tests\TestCase;

class MusicTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_top_5_songs(): void
    {
        Music::factory()->create(['views' => 1000000, 'status' => 'approved']);
        Music::factory()->create(['views' => 2000000, 'status' => 'approved']);
        Music::factory()->create(['views' => 3000000, 'status' => 'approved']);
        Music::factory()->create(['views' => 4000000, 'status' => 'approved']);
        Music::factory()->create(['views' => 5000000, 'status' => 'approved']);
        Music::factory()->create(['views' => 6000000, 'status' => 'approved']);
        Music::factory()->create(['views' => 7000000, 'status' => 'approved']);

        $response = $this->getJson('/api/musics/top5');

        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data')
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id',
                             'title',
                             'youtube_url',
                             'youtube_id',
                             'views',
                             'formatted_views',
                             'duration',
                             'thumbnail',
                             'status',
                             'created_at',
                             'updated_at'
                         ]
                     ]
                 ]);

        $songs = $response->json('data');
        $this->assertTrue($songs[0]['views'] >= $songs[1]['views']);
    }

    public function test_can_get_remaining_songs_with_pagination(): void
    {
        Music::factory(12)->create(['status' => 'approved']);

        $response = $this->getJson('/api/musics?per_page=5&page=1');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data',
                     'meta' => [
                         'current_page',
                         'last_page',
                         'per_page',
                         'total'
                     ]
                 ]);

        $this->assertEquals(5, count($response->json('data')));
        $this->assertEquals(12, $response->json('meta.total'));
    }

    public function test_can_submit_song_suggestion(): void
    {
        $songData = [
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        ];

        $response = $this->postJson('/api/musics', $songData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'title',
                         'youtube_url',
                         'youtube_id',
                         'status'
                     ],
                     'message'
                 ]);

        $this->assertDatabaseHas('music', [
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'youtube_id' => 'dQw4w9WgXcQ',
            'status' => 'pending'
        ]);
    }

    public function test_cannot_submit_invalid_youtube_url(): void
    {
        $invalidUrls = [
            ['youtube_url' => 'not-a-url'],
            ['youtube_url' => 'https://example.com'],
            ['youtube_url' => ''],
            []
        ];

        foreach ($invalidUrls as $data) {
            $response = $this->postJson('/api/musics', $data);

            $response->assertStatus(422)
                     ->assertJsonValidationErrors('youtube_url');
        }
    }

    public function test_admin_can_get_pending_songs(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Music::factory(3)->create(['status' => 'pending']);
        Music::factory(2)->create(['status' => 'approved']);

        $response = $this->getJson('/api/admin/musics/pending');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
        
        foreach ($response->json('data') as $song) {
            $this->assertEquals('pending', $song['status']);
        }
    }

    public function test_unauthenticated_user_cannot_access_admin_endpoints(): void
    {
        $this->getJson('/api/admin/musics/pending')
             ->assertStatus(401);
             
        $this->patchJson('/api/admin/musics/1/approve')
             ->assertStatus(401);
    }

    public function test_admin_can_approve_song(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        
        $song = Music::factory()->create(['status' => 'pending']);

        $response = $this->patchJson("/api/admin/musics/{$song->id}/approve");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Song approved successfully!'
                 ]);

        $this->assertDatabaseHas('music', [
            'id' => $song->id,
            'status' => 'approved'
        ]);
    }

    public function test_admin_can_reject_song(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        
        $song = Music::factory()->create(['status' => 'pending']);

        $response = $this->patchJson("/api/admin/musics/{$song->id}/reject");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Song rejected!'
                 ]);

        $this->assertDatabaseHas('music', [
            'id' => $song->id,
            'status' => 'rejected'
        ]);
    }

    public function test_admin_can_update_song(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $song = Music::factory()->create();
        
        $mockYouTubeService = Mockery::mock(\App\Services\YouTubeService::class);
        $mockYouTubeService->shouldReceive('extractVideoId')
            ->with('https://www.youtube.com/watch?v=newVideoId')
            ->andReturn('newVideoId');
        
        $mockYouTubeService->shouldReceive('getVideoData')
            ->with('newVideoId')
            ->andReturn([
                'title' => 'Test Song',
                'views' => 1000,
                'duration' => 180,
                'thumbnail' => 'https://example.com/thumb.jpg'
            ]);
        
        $this->app->instance(\App\Services\YouTubeService::class, $mockYouTubeService);
        
        $updateData = [
            'youtube_url' => 'https://www.youtube.com/watch?v=newVideoId',
            'status' => 'approved'
        ];
        
        $response = $this->putJson("/api/admin/musics/{$song->id}", $updateData);
        
        $response->assertStatus(200);
        
        $this->assertDatabaseHas('music', [
            'id' => $song->id,
            'youtube_id' => 'newVideoId',
            'status' => 'approved'
        ]);
    }

    public function test_admin_can_delete_song(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        
        $song = Music::factory()->create();

        $response = $this->deleteJson("/api/admin/musics/{$song->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Song deleted successfully!'
                 ]);

        $this->assertDatabaseMissing('music', [
            'id' => $song->id
        ]);
    }

    public function test_only_approved_songs_appear_in_public_endpoints(): void
    {
        Music::factory()->create(['status' => 'approved', 'views' => 1000000]);
        Music::factory()->create(['status' => 'pending', 'views' => 2000000]);
        Music::factory()->create(['status' => 'rejected', 'views' => 3000000]);

        $response = $this->getJson('/api/musics/top5');
        $response->assertStatus(200);
        
        foreach ($response->json('data') as $song) {
            $this->assertEquals('approved', $song['status']);
        }

        $response = $this->getJson('/api/musics');
        $response->assertStatus(200);
        
        foreach ($response->json('data') as $song) {
            $this->assertEquals('approved', $song['status']);
        }
    }
}
