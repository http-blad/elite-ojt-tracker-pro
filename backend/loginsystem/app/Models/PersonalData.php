<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalData extends Model
{
    protected $fillable = [
        'name',
        'institution',
        'batch',
        'term',
        'internId',
        'theme',
        'user_id'
    ];

}
