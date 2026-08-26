<?php

use App\Jobs\CleanupOldAnalytics;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Clean up analytics data older than 90 days daily at 3 AM
Schedule::job(new CleanupOldAnalytics)->daily()->at('03:00');
