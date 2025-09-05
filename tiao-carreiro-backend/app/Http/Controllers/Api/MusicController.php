<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMusicRequest;
use App\Http\Requests\UpdateMusicRequest;
use App\Http\Resources\MusicResource;
use App\Models\Music;
use App\Services\YouTubeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MusicController extends Controller
{
    public function __construct(private YouTubeService $youtubeService)
    {
        $this->middleware('auth:sanctum')->except(['index', 'top5', 'store']);
    }

    public function index(Request $request): JsonResponse
    {
        $musics = Music::remaining()
            ->paginate($request->get('per_page', 10));

        return response()->json([
            'data' => MusicResource::collection($musics),
            'meta' => [
                'current_page' => $musics->currentPage(),
                'last_page' => $musics->lastPage(),
                'per_page' => $musics->perPage(),
                'total' => $musics->total()
            ]
        ]);
    }

    public function top5(): JsonResponse
    {
        $musics = Music::top5()->get();
        
        return response()->json([
            'data' => MusicResource::collection($musics)
        ]);
    }

    public function store(StoreMusicRequest $request): JsonResponse
    {
        try {
            $videoId = $this->youtubeService->extractVideoId($request->youtube_url);
            
            if (!$videoId) {
                return response()->json([
                    'message' => 'Invalid YouTube URL'
                ], 400);
            }

            $videoData = $this->youtubeService->getVideoData($videoId);
            
            $music = Music::create([
                'title' => $videoData['title'],
                'youtube_url' => $request->youtube_url,
                'youtube_id' => $videoId,
                'views' => $videoData['views'],
                'duration' => $videoData['duration'],
                'thumbnail' => $videoData['thumbnail'],
                'status' => 'pending'
            ]);

            return response()->json([
                'data' => new MusicResource($music),
                'message' => 'Suggestion submitted successfully!'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function show(Music $music): JsonResponse
    {
        return response()->json([
            'data' => new MusicResource($music)
        ]);
    }

    public function update(UpdateMusicRequest $request, int $id): JsonResponse
    {
        try {
            $music = Music::findOrFail($id);
            
            if ($request->has('youtube_url')) {
                $videoId = $this->youtubeService->extractVideoId($request->youtube_url);
                
                if (!$videoId) {
                    return response()->json([
                        'message' => 'Invalid YouTube URL'
                    ], 400);
                }

                $videoData = $this->youtubeService->getVideoData($videoId);
                
                $music->update([
                    'title' => $videoData['title'],
                    'youtube_url' => $request->youtube_url,
                    'youtube_id' => $videoId,
                    'views' => $videoData['views'],
                    'duration' => $videoData['duration'],
                    'thumbnail' => $videoData['thumbnail'],
                    'status' => $request->status ?? $music->status
                ]);
            } else {
                $music->update($request->validated());
            }

            return response()->json([
                'data' => new MusicResource($music),
                'message' => 'Song updated successfully!'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Song not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy(Music $music): JsonResponse
    {
        $music->delete();

        return response()->json([
            'message' => 'Song deleted successfully!'
        ]);
    }

    public function approve(Music $music): JsonResponse
    {
        $music->update(['status' => 'approved']);

        return response()->json([
            'data' => new MusicResource($music),
            'message' => 'Song approved successfully!'
        ]);
    }

    public function reject(Music $music): JsonResponse
    {
        $music->update(['status' => 'rejected']);

        return response()->json([
            'data' => new MusicResource($music),
            'message' => 'Song rejected!'
        ]);
    }

    public function pending(): JsonResponse
    {
        $musics = Music::where('status', 'pending')
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json([
            'data' => MusicResource::collection($musics),
            'meta' => [
                'current_page' => $musics->currentPage(),
                'last_page' => $musics->lastPage(),
                'per_page' => $musics->perPage(),
                'total' => $musics->total()
            ]
        ]);
    }
}
