<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MusicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'youtube_url' => $this->youtube_url,
            'youtube_id' => $this->youtube_id,
            'views' => $this->views,
            'formatted_views' => $this->formatted_views,
            'duration' => $this->duration,
            'thumbnail' => $this->thumbnail,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
