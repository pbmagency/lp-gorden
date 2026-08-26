<?php

namespace App\Jobs;

use App\Models\UserAnalytic;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Deletes analytics records older than the retention period (default 90 days).
 *
 * Schedule this in ConsoleKernel or via a cron job:
 *   $schedule->job(new CleanupOldAnalytics)->daily();
 */
class CleanupOldAnalytics implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly int $retentionDays = 90,
    ) {
        $this->onQueue('analytics');
    }

    public function handle(): void
    {
        $cutoff = Carbon::now()->subDays($this->retentionDays);

        $deleted = UserAnalytic::where('created_at', '<', $cutoff)->delete();

        Log::info('Analytics data cleanup completed', [
            'retention_days' => $this->retentionDays,
            'cutoff_date' => $cutoff->toDateString(),
            'records_deleted' => $deleted,
        ]);
    }
}
