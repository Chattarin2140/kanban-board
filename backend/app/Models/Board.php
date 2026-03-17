<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Board extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'owner_id'];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'board_members');
    }

    public function columns()
    {
        return $this->hasMany(Column::class)->orderBy('position');
    }

    public function tasks()
    {
        return $this->hasManyThrough(Task::class, Column::class);
    }
}
