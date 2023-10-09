<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EuropeanElectoralRegion extends Model
{
    use HasFactory;

    protected $fillable = [
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
        return $this->hasMany(Postcode::class, 'european_electoral_region_id', 'id');
    }

    /**
     * parliamentaryConstituencies
     *
     * @return HasMany
     */
    public function parliamentaryConstituencies(): HasMany
    {
        return $this->hasMany(ParliamentaryConstituency::class, 'european_electoral_region_id', 'id');
    }
}
