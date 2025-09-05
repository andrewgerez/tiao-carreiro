<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMusicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'youtube_url' => [
                'sometimes',
                'url',
                'regex:/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//'
            ],
            'status' => 'sometimes|in:approved,pending,rejected'
        ];
    }
}
