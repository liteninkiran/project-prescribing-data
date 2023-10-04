<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Organisation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'org_id',
        'status',
        'inactive',
        'org_record_class',
        'post_code',
        'postcode_id',
        'last_change_date',
        'primary_role_id',
        'org_link',
    ];

    
    /****************** RELATIONSHIPS ******************/

    /**
     * primaryRole
     *
     * @return BelongsTo
     */
    public function primaryRole(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'primary_role_id', 'id');
    }

    /**
     * postcode
     *
     * @return BelongsTo
     */
    public function postcode(): BelongsTo
    {
        return $this->belongsTo(Postcode::class, 'postcode_id', 'id');
    }


    /******************    SCOPES    *******************/

    /**
     * scopeOrgIdLike
     *
     * @param Builder $query
     * @param string $orgId
     * @return Builder
     */
    public function scopeOrgIdLike(Builder $query, string $orgId): Builder
    {
        return $query->where('org_id', 'LIKE', '%' . $orgId . '%');
    }

    /**
     * scopeNameLike
     *
     * @param Builder $query
     * @param string $name
     * @return Builder
     */
    public function scopeNameLike(Builder $query, string $name): Builder
    {
        return $query->where('name', 'LIKE', '%' . $name . '%');
    }

    /**
     * scopePostcodeLike
     *
     * @param Builder $query
     * @param string $postcode
     * @return Builder
     */
    public function scopePostcodeLike(Builder $query, string $postcode): Builder
    {
        return $query->where('post_code', 'LIKE', '%' . $postcode . '%');
    }

    /**
     * scopePrimaryRolesIn
     *
     * @param Builder $query
     * @param string[] $roleIds
     * @return Builder
     */
    public function scopePrimaryRolesIn(Builder $query, array $roleIds): Builder
    {
        return $query->whereHas('primaryRole', function($q) use ($roleIds) {
            $q->whereIn('_id', $roleIds);
        });
    }

    /**
     * scopePrimaryRolesInRaw
     *
     * @param Builder $query
     * @param int[] $roleIds
     * @return Builder
     */
    public function scopePrimaryRolesInRaw(Builder $query, array $roleIds): Builder
    {
        return $query->whereHas('primaryRole', function($q) use ($roleIds) {
            $q->whereIntegerInRaw('id', $roleIds);
        });
    }

    /**
     * scopeLastChangeDateAfter
     *
     * @param Builder $query
     * @param string $date
     * @return Builder
     */
    public function scopeLastChangeDateAfter(Builder $query, string $date): Builder
    {
        return $query->where('last_change_date', '>=', $date);
    }

    /**
     * scopeStatus
     *
     * @param Builder $query
     * @param int $status
     * @return Builder
     */
    public function scopeStatus(Builder $query, int $status): Builder
    {
        return $query->where('inactive', '=', $status);
    }

    /**
     * scopeStatusText
     *
     * @param Builder $query
     * @param string $status
     * @return Builder
     */
    public function scopeStatusText(Builder $query, string $status): Builder
    {
        return $query->where('status', '=', $status);
    }
    
    /**
     * scopeAdminCountiesInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopeAdminCountiesInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('adminCounty', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }
    
    /**
     * scopeAdminDistrictsInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopeAdminDistrictsInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('adminDistrict', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }
    
    /**
     * scopeParliamentaryConstituenciesInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopeParliamentaryConstituenciesInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('parliamentaryConstituency', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }
    
    /**
     * scopePoliceForceAreaInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopePoliceForceAreaInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('policeForceArea', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }
    
    /**
     * scopeNutsInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopeNutsInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('nuts', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }
    
    /**
     * scopeEuropeanElectoralRegionInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopeEuropeanElectoralRegionInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('europeanElectoralRegion', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }
    
    /**
     * scopeHealthAuthorityInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopeHealthAuthorityInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('healthAuthority', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }
    
    /**
     * scopePrimaryCareTrustInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopePrimaryCareTrustInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('primaryCareTrust', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }
    
    /**
     * scopeRegionInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopeRegionInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('region', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }
    
    /**
     * scopeCountryInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopeCountryInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('country', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }

    /**
     * scopePostcodeAreaInRaw
     *
     * @param Builder $query
     * @param int[] $ids
     * @return Builder
     */
    public function scopePostcodeAreaInRaw(Builder $query, array $ids): Builder
    {
        return $query->whereHas('postcode', function($postcode) use ($ids) {
            $postcode->whereHas('postcodeArea', function($attribute) use ($ids) {
                $attribute->whereIntegerInRaw('id', $ids);
            });
        });
    }
}
