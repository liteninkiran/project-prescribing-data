<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function primaryRole(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'primary_role_id', 'id');
    }
}
