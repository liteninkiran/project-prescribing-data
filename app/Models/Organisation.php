<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'primary_role_description',
        'org_link',
    ];

}
