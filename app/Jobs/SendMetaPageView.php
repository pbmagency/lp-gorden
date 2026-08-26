<?php

namespace App\Jobs;

use App\Services\MetaConversionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendMetaPageView implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly string $ip,
        private readonly string $userAgent,
        private readonly string $eventId,
        private readonly string $referer,
        private readonly ?string $fbp,
        private readonly ?string $fbc,
    ) {
        $this->onQueue('analytics');
    }

    public function handle(MetaConversionService $metaService): void
    {
        $metaService->sendPageViewFromJob($this->ip, $this->userAgent, $this->eventId, $this->referer, $this->fbp, $this->fbc);
    }
}
