<?php

namespace Tests\Unit;

use App\Services\YouTubeService;
use Tests\TestCase;

class YouTubeServiceTest extends TestCase
{
    protected YouTubeService $youtubeService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->youtubeService = new YouTubeService();
    }

    public function test_extract_video_id_from_various_urls(): void
    {
        $testCases = [
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ' => 'dQw4w9WgXcQ',
            'https://youtube.com/watch?v=dQw4w9WgXcQ' => 'dQw4w9WgXcQ',
            'https://youtu.be/dQw4w9WgXcQ' => 'dQw4w9WgXcQ',
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s' => 'dQw4w9WgXcQ',
            'https://www.youtube.com/embed/dQw4w9WgXcQ' => 'dQw4w9WgXcQ',
        ];

        foreach ($testCases as $url => $expectedId) {
            $this->assertEquals(
                $expectedId,
                $this->youtubeService->extractVideoId($url),
                "Failed for URL: $url"
            );
        }
    }

    public function test_extract_video_id_returns_null_for_invalid_urls(): void
    {
        $invalidUrls = [
            'https://example.com',
            'not-a-url',
            'https://vimeo.com/123456',
            '',
        ];

        foreach ($invalidUrls as $url) {
            $this->assertNull(
                $this->youtubeService->extractVideoId($url),
                "Should return null for: $url"
            );
        }
    }

    public function test_get_video_data_returns_mock_data_in_testing(): void
    {
        // In testing environment, should always return mock data
        $videoData = $this->youtubeService->getVideoData('dQw4w9WgXcQ');

        $this->assertArrayHasKey('title', $videoData);
        $this->assertArrayHasKey('views', $videoData);
        $this->assertArrayHasKey('duration', $videoData);
        $this->assertArrayHasKey('thumbnail', $videoData);
        
        $this->assertIsString($videoData['title']);
        $this->assertIsInt($videoData['views']);
        $this->assertStringContainsString('dQw4w9WgXcQ', $videoData['thumbnail']);
        $this->assertStringContainsString('Mock Song Title', $videoData['title']);
    }

    public function test_get_video_data_handles_different_video_ids(): void
    {
        $videoIds = ['abc123', 'xyz789', 'test123'];
        
        foreach ($videoIds as $videoId) {
            $videoData = $this->youtubeService->getVideoData($videoId);
            
            $this->assertStringContainsString($videoId, $videoData['title']);
            $this->assertStringContainsString($videoId, $videoData['thumbnail']);
            $this->assertGreaterThan(0, $videoData['views']);
        }
    }

    public function test_get_video_data_returns_mock_data_without_api_key(): void
    {
        // This should return mock data in testing environment
        $videoData = $this->youtubeService->getVideoData('dQw4w9WgXcQ');

        // Verify it's mock data by checking the title pattern
        $this->assertStringStartsWith('Mock Song Title', $videoData['title']);
        $this->assertStringContainsString('dQw4w9WgXcQ', $videoData['title']);
        $this->assertArrayHasKey('views', $videoData);
        $this->assertArrayHasKey('duration', $videoData);
        $this->assertArrayHasKey('thumbnail', $videoData);
        
        $this->assertIsString($videoData['title']);
        $this->assertIsInt($videoData['views']);
        $this->assertEquals('3:45', $videoData['duration']);
        $this->assertStringContainsString('dQw4w9WgXcQ', $videoData['thumbnail']);
    }
}
