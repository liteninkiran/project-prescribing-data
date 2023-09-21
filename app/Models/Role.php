<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        '_id',
        'code',
        'display_name',
        'primary_role',
    ];

    public function organisations(): HasMany
    {
        return $this->hasMany(Organisations::class, 'primary_role_id', 'id');
    }
}
