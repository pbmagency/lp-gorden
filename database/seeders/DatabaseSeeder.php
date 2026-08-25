<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::firstOrNew(['email' => 'justin@gmail.com']);

        $admin->forceFill([
            'name' => 'justin',
            'role' => 'admin',
            'email_verified_at' => now(),
            'password' => Hash::make('123justin'),
        ])->save();
    }
}
