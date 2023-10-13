<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
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
        return $this->hasMany(Postcode::class, 'country_id', 'id');
    }

    /**
     * europeanElectoralRegions
     *
     * @return HasMany
     */
    public function europeanElectoralRegions(): HasMany
    {
        return $this->belongsTo(EuropeanElectoralRegion::class, 'european_electoral_region_id', 'id');
    }
}
