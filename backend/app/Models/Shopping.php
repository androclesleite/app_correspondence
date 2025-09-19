<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shopping extends Model
{
    protected $fillable = [
        'name',
        'address',
    ];

    public function stores(): HasMany
    {
        return $this->hasMany(Store::class);
    }
}
