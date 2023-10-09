<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParliamentaryConstituency extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
    ];


    /****************** RELATIONSHIPS ******************/

    /**
     * postcodes
     *
     * @return HasMany
     */
    public function postcodes(): HasMany
    {
        return $this->hasMany(Postcode::class, 'parliamentary_constituency_id', 'id');
    }

    /**
     * europeanElectoralRegion
     *
     * @return BelongsTo
     */
    public function europeanElectoralRegion(): BelongsTo
    {
        return $this->belongsTo(EuropeanElectoralRegion::class, 'european_electoral_region_id', 'id');
    }
}
