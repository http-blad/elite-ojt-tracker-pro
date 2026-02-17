<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtpCode extends Model
{
    protected $fillable = [
        'otp_code',
        'otp_expires_at',
        'user_id',
    ];

    protected $casts = [
        'otp_expires_at' => 'datetime',
    ];

    /**
     * Get the user that owns the OTP code.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
