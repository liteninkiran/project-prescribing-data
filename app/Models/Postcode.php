<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Postcode extends Model
{
    use HasFactory;

    protected $fillable = [
        'postcode',
        'incode',
        'outcode',
        'country',
        'quality',
        'admin_county',
        'admin_county_code',
        'admin_district',
        'admin_district_code',
        'admin_ward',
        'admin_ward_code',
        'ccg',
        'ccg_code',
        'ccg_id_code',
        'ced',
        'ced_code',
        'date_of_introduction',
        'eastings',
        'european_electoral_region',
        'latitude',
        'lau2_code',
        'longitude',
        'lsoa',
        'lsoa_code',
        'msoa',
        'msoa_code',
        'nhs_ha',
        'northings',
        'nuts',
        'nuts_code',
        'parish',
        'parish_code',
        'parliamentary_constituency',
        'parliamentary_constituency_code',
        'pfa',
        'pfa_code',
        'primary_care_trust',
        'region',
    ];


    /****************** RELATIONSHIPS ******************/

    /**
     * organisations
     *
     * @return HasMany
     */
    public function organisations(): HasMany
    {
        return $this->hasMany(Organisation::class, 'postcode_id', 'id');
    }
}
