<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    protected $fillable = [
        'name',
        'shopping_id',
    ];

    public function shopping(): BelongsTo
    {
        return $this->belongsTo(Shopping::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
