<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HealthAuthority extends Model
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
        return $this->hasMany(Postcode::class, 'nhs_ha_id', 'id');
    }
}
