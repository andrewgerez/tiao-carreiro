<?php

namespace Tests\Unit;

use App\Models\Music;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MusicModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_formatted_views_attribute(): void
    {
        // Test billion views
        $musica = new Music(['views' => 1500000000]);
        $this->assertEquals('1.5B', $musica->formatted_views);

        // Test million views
        $musica = new Music(['views' => 2500000]);
        $this->assertEquals('2.5M', $musica->formatted_views);

        // Test thousand views
        $musica = new Music(['views' => 1500]);
        $this->assertEquals('1.5K', $musica->formatted_views);

        // Test regular views
        $musica = new Music(['views' => 500]);
        $this->assertEquals('500', $musica->formatted_views);
    }

    public function test_approved_scope(): void
    {
        // Arrange
        Music::factory()->create(['status' => 'approved']);
        Music::factory()->create(['status' => 'pending']);
        Music::factory()->create(['status' => 'rejected']);

        // Act
        $approved = Music::approved()->get();

        // Assert
        $this->assertCount(1, $approved);
        $this->assertEquals('approved', $approved->first()->status);
    }

    public function test_top5_scope(): void
    {
        // Arrange - Create 6 approved songs
        Music::factory()->create(['status' => 'approved', 'views' => 1000]);
        Music::factory()->create(['status' => 'approved', 'views' => 2000]);
        Music::factory()->create(['status' => 'approved', 'views' => 3000]);
        Music::factory()->create(['status' => 'approved', 'views' => 4000]);
        Music::factory()->create(['status' => 'approved', 'views' => 5000]);
        Music::factory()->create(['status' => 'approved', 'views' => 6000]);
        
        // Create one pending (should be excluded)
        Music::factory()->create(['status' => 'pending', 'views' => 7000]);

        // Act
        $top5 = Music::top5()->get();

        // Assert
        $this->assertCount(5, $top5);
        $this->assertEquals(6000, $top5->first()->views); // Highest approved
        $this->assertEquals(2000, $top5->last()->views);  // 5th highest approved
    }

    public function test_table_name_is_correct(): void
    {
        $musica = new Music();
        $this->assertEquals('music', $musica->getTable());
    }

    public function test_fillable_attributes(): void
    {
        $musica = new Music();
        $expected = [
            'title',
            'youtube_url',
            'youtube_id',
            'views',
            'duration',
            'thumbnail',
            'status'
        ];
        
        $this->assertEquals($expected, $musica->getFillable());
    }

    public function test_views_casting(): void
    {
        $musica = Music::factory()->create(['views' => '1000']);
        
        $this->assertIsInt($musica->views);
        $this->assertEquals(1000, $musica->views);
    }
}
