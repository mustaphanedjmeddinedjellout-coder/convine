<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wedding extends Model
{
    protected $fillable = [
        'user_id',
        'created_by',
        'title',
        'slug',
        'bride_name',
        'groom_name',
        'event_date',
        'event_time',
        'venue',
        'venue_address',
        'google_maps_url',
        'template_slug',
        'message',
        'photos',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'photos' => 'array',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class)->orderBy('sort_order');
    }
}
