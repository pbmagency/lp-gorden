<?php

namespace App\Jobs;

use App\Services\MetaConversionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendMetaAddToCart implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly string $ip,
        private readonly string $userAgent,
        private readonly string $eventId,
        private readonly string $referer,
        private readonly ?string $fbp,
        private readonly ?string $fbc,
        private readonly array $eventData,
    ) {
        $this->onQueue('analytics');
    }

    public function handle(MetaConversionService $metaService): void
    {
        $metaService->sendAddToCartFromJob($this->ip, $this->userAgent, $this->eventId, $this->referer, $this->fbp, $this->fbc, $this->eventData);
    }
}
