<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdminDistrict extends Model
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
        return $this->hasMany(Postcode::class, 'admin_district_id', 'id');
    }
}
