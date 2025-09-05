<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMusicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'youtube_url' => [
                'required',
                'url',
                'regex:/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'youtube_url.required' => 'YouTube URL is required',
            'youtube_url.url' => 'Please enter a valid URL',
            'youtube_url.regex' => 'Please enter a valid YouTube URL'
        ];
    }
}
