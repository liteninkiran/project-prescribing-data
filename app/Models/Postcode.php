<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'admin_county_id',
        'admin_district_id',
        'european_electoral_region_id',
        'nhs_ha_id',
        'nuts_id',
        'parliamentary_constituency_id',
        'pfa_id',
        'primary_care_trust_id',
        'region_id',
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

    /**
     * adminCounty
     *
     * @return BelongsTo
     */
    public function adminCounty(): BelongsTo
    {
        return $this->belongsTo(AdminCounty::class, 'admin_county_id', 'id');
    }

    /**
     * adminCountyCode
     *
     * @return BelongsTo
     */
    public function adminCountyCode(): BelongsTo
    {
        return $this->belongsTo(AdminCounty::class, 'admin_county_code', 'code');
    }

    /**
     * adminDistrict
     *
     * @return BelongsTo
     */
    public function adminDistrict(): BelongsTo
    {
        return $this->belongsTo(AdminDistrict::class, 'admin_district_id', 'id');
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

    /**
     * healthAuthority
     *
     * @return BelongsTo
     */
    public function healthAuthority(): BelongsTo
    {
        return $this->belongsTo(HealthAuthority::class, 'nhs_ha_id', 'id');
    }

    /**
     * nuts
     *
     * @return BelongsTo
     */
    public function nuts(): BelongsTo
    {
        return $this->belongsTo(Nuts::class, 'nuts_id', 'id');
    }

    /**
     * parliamentaryConstituency
     *
     * @return BelongsTo
     */
    public function parliamentaryConstituency(): BelongsTo
    {
        return $this->belongsTo(ParliamentaryConstituency::class, 'parliamentary_constituency_id', 'id');
    }

    /**
     * policeForceArea
     *
     * @return BelongsTo
     */
    public function policeForceArea(): BelongsTo
    {
        return $this->belongsTo(PoliceForceArea::class, 'pfa_id', 'id');
    }

    /**
     * primaryCareTrust
     *
     * @return BelongsTo
     */
    public function primaryCareTrust(): BelongsTo
    {
        return $this->belongsTo(PrimaryCareTrust::class, 'primary_care_trust_id', 'id');
    }

    /**
     * region
     *
     * @return BelongsTo
     */
    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class, 'region_id', 'id');
    }
}
