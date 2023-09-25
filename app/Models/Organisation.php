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
        'org_record_class',
        'post_code',
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

    public function scopeLastChangeDateAfter(Builder $query, string $date): Builder
    {
        return $query->where('last_change_date', '>=', $date);
    }
}
