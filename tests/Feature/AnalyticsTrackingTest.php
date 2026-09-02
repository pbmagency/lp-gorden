<?php

namespace Tests\Feature;

use App\Models\UserAnalytic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class AnalyticsTrackingTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_exposes_csrf_token_for_analytics(): void
    {
        $this->get('/c1-lp')
            ->assertOk()
            ->assertSee('meta name="csrf-token"', false);
    }

    public function test_tracking_an_event_invalidates_cached_dashboard_data(): void
    {
        Cache::put('analytics_dashboard_version', 7);

        $this->postJson(route('analytics.track'), [
            'event_type' => 'visit',
            'event_data' => ['event_id' => 'cache-invalidation-visit'],
        ])->assertOk();

        $this->assertSame(8, Cache::get('analytics_dashboard_version'));
    }

    public function test_unknown_event_type_is_rejected(): void
    {
        $this->postJson(route('analytics.track'), [
            'event_type' => 'made_up_event',
        ])->assertUnprocessable();

        $this->assertDatabaseCount('user_analytics', 0);
    }

    public function test_initiate_checkout_is_stored_as_its_own_event(): void
    {
        $this->postJson(route('analytics.track'), [
            'event_type' => 'initiate_checkout',
            'event_data' => [
                'event_id' => 'checkout-event-1',
                'landing_source' => '/c6-angle',
                'type' => 'external_payment_redirect',
                'package' => 'Starter',
            ],
            'referral_source' => 'direct',
        ])->assertOk()->assertJson(['success' => true]);

        $event = UserAnalytic::query()->sole();

        $this->assertSame('initiate_checkout', $event->event_type);
        $this->assertSame('/c6-angle', $event->event_data['landing_source']);
        $this->assertSame('external_payment_redirect', $event->event_data['type']);
        $this->assertSame('Starter', $event->event_data['package']);
    }

    public function test_event_id_prevents_duplicate_tracking(): void
    {
        $payload = [
            'event_type' => 'visit',
            'event_data' => [
                'event_id' => 'page-view-1',
                'landing_source' => '/',
            ],
        ];

        $this->postJson(route('analytics.track'), $payload)->assertOk();
        $this->postJson(route('analytics.track'), $payload)
            ->assertOk()
            ->assertJson(['duplicate' => true]);

        $this->assertDatabaseCount('user_analytics', 1);
    }

    public function test_cta_and_section_dimensions_are_preserved(): void
    {
        $this->postJson(route('analytics.track'), [
            'event_type' => 'cta_click',
            'event_data' => [
                'landing_source' => '/c6-angle',
                'location' => 'faq_primary',
                'text' => 'Chat Via WA',
                'destination' => 'https://wa.me/628123456789',
                'page' => '/c6-angle',
            ],
        ])->assertOk();

        $this->postJson(route('analytics.track'), [
            'event_type' => 'section_view',
            'event_data' => [
                'landing_source' => '/c6-angle',
                'section' => 'faq',
                'page' => '/c6-angle',
            ],
        ])->assertOk();

        $this->postJson(route('analytics.track'), [
            'event_type' => 'conversion',
            'event_data' => [
                'landing_source' => '/c6-angle',
                'type' => 'wa_registration',
                'location' => 'pricing_starter',
                'package' => 'Starter',
                'price' => 250000,
            ],
        ])->assertOk();

        $cta = UserAnalytic::query()->where('event_type', 'cta_click')->sole();
        $section = UserAnalytic::query()->where('event_type', 'section_view')->sole();
        $conversion = UserAnalytic::query()->where('event_type', 'conversion')->sole();

        $this->assertSame('faq_primary', $cta->event_data['location']);
        $this->assertSame('Chat Via WA', $cta->event_data['text']);
        $this->assertSame('https://wa.me/628123456789', $cta->event_data['destination']);
        $this->assertSame('faq', $section->event_data['section']);
        $this->assertSame('wa_registration', $conversion->event_data['type']);
        $this->assertSame('pricing_starter', $conversion->event_data['location']);
        $this->assertSame('Starter', $conversion->event_data['package']);
        $this->assertSame(250000, $conversion->event_data['price']);
    }
}
