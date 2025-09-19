<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Package extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'store_id',
        'code',
        'courier',
        'received_at',
        'postal_type',
        'volume_type',
        'observations',
        'status',
        'collected_at',
        'collector_name',
        'collector_cpf',
        'photo_path',
        'signature_path',
    ];

    protected $casts = [
        'received_at' => 'datetime',
        'collected_at' => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(PackageLog::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCollected($query)
    {
        return $query->where('status', 'collected');
    }

    public function scopeForStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }
}
