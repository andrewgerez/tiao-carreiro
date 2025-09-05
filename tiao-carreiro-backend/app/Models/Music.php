<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Music extends Model
{
    use HasFactory;

    protected $table = 'music';

    protected $fillable = [
        'title',
        'youtube_url',
        'youtube_id',
        'views',
        'duration',
        'thumbnail',
        'status'
    ];

    protected $casts = [
        'views' => 'integer',
    ];

    public function getFormattedViewsAttribute(): string
    {
        $number = $this->views;
        
        if ($number >= 1000000000) {
            return number_format($number / 1000000000, 1) . 'B';
        }
        if ($number >= 1000000) {
            return number_format($number / 1000000, 1) . 'M';
        }
        if ($number >= 1000) {
            return number_format($number / 1000, 1) . 'K';
        }
        
        return (string) $number;
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeTop5($query)
    {
        return $query->approved()
                    ->orderByDesc('views')
                    ->limit(5);
    }

    public function scopeRemaining($query)
    {
        return $query->approved()
                    ->orderByDesc('views')
                    ->skip(5);
    }
}
