<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MetaConversionService
{
    private string $pixelId;
    private string $accessToken;
    private bool $sdkAvailable;

    public function __construct()
    {
        $this->pixelId      = config('services.meta.pixel_id', '');
        $this->accessToken  = config('services.meta.access_token', '');
        $this->sdkAvailable = class_exists('\FacebookAds\Api');

        if ($this->isConfigured() && $this->sdkAvailable) {
            \FacebookAds\Api::init(null, null, $this->accessToken, false);
        }
    }

    public function isConfigured(): bool
    {
        return $this->pixelId !== '' && $this->accessToken !== '';
    }

    /**
     * Send PageView from a queued job (raw data, not Request).
     */
    public function sendPageViewFromJob(
        string $ip,
        string $userAgent,
        string $eventId,
        string $referer,
        ?string $fbp,
        ?string $fbc,
    ): void {
        if (! $this->isConfigured() || ! $this->sdkAvailable) {
            return;
        }

        $userData = $this->buildUserDataFromRaw($ip, $userAgent, $fbp, $fbc);

        $event = (new \FacebookAds\Object\ServerSide\Event)
            ->setEventName('PageView')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($referer)
            ->setActionSource(\FacebookAds\Object\ServerSide\ActionSource::WEBSITE)
            ->setUserData($userData);

        $this->sendEvents([$event]);
    }

    /**
     * Send AddToCart from a queued job (raw data, not Request).
     */
    public function sendAddToCartFromJob(
        string $ip,
        string $userAgent,
        string $eventId,
        string $referer,
        ?string $fbp,
        ?string $fbc,
        array $eventData = [],
    ): void {
        if (! $this->isConfigured() || ! $this->sdkAvailable) {
            return;
        }

        $userData = $this->buildUserDataFromRaw($ip, $userAgent, $fbp, $fbc);

        $level       = $eventData['level'] ?? 'Starter';
        $price       = match ($level) {
            'Intermediate' => 350000,
            'Bundling'     => 375000,
            default        => 250000,
        };
        $productId   = 'toefl-' . strtolower($level);
        $contentName = "TOEFL Full Bright Level {$level}";

        $content = (new \FacebookAds\Object\ServerSide\Content)
            ->setProductId($productId)
            ->setQuantity(1);

        $customData = (new \FacebookAds\Object\ServerSide\CustomData)
            ->setContentName($contentName)
            ->setContentType('product')
            ->setValue($price)
            ->setCurrency('IDR')
            ->setContents([$content]);

        $event = (new \FacebookAds\Object\ServerSide\Event)
            ->setEventName('AddToCart')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($referer)
            ->setActionSource(\FacebookAds\Object\ServerSide\ActionSource::WEBSITE)
            ->setUserData($userData)
            ->setCustomData($customData);

        $this->sendEvents([$event]);
    }

    public function sendPageView(Request $request, string $eventId): void
    {
        $this->sendPageViewFromJob(
            $request->ip(),
            $request->userAgent(),
            $eventId,
            $request->header('Referer', $request->url()),
            $request->input('event_data._fbp') ?? $request->cookie('_fbp'),
            $request->input('event_data._fbc') ?? $request->cookie('_fbc'),
        );
    }

    public function sendAddToCart(Request $request, string $eventId, array $eventData = []): void
    {
        $this->sendAddToCartFromJob(
            $request->ip(),
            $request->userAgent(),
            $eventId,
            $request->header('Referer', $request->url()),
            $request->input('event_data._fbp') ?? $request->cookie('_fbp'),
            $request->input('event_data._fbc') ?? $request->cookie('_fbc'),
            $eventData,
        );
    }

    private function buildUserDataFromRaw(
        string $ip,
        string $userAgent,
        ?string $fbp,
        ?string $fbc,
    ): \FacebookAds\Object\ServerSide\UserData {
        $userData = (new \FacebookAds\Object\ServerSide\UserData)
            ->setClientIpAddress($ip)
            ->setClientUserAgent($userAgent);

        if ($fbp) {
            $userData->setFbp($fbp);
        }

        if ($fbc) {
            $userData->setFbc($fbc);
        }

        return $userData;
    }

    private function sendEvents(array $events): void
    {
        try {
            $eventRequest = (new \FacebookAds\Object\ServerSide\EventRequest($this->pixelId))
                ->setEvents($events);

            $eventRequest->execute();
        } catch (\Throwable $e) {
            Log::warning('Meta CAPI request failed', ['error' => $e->getMessage()]);
        }
    }
}
