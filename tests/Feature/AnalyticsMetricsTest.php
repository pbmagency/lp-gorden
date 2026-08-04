<?php

namespace Tests\Feature;

use App\Http\Controllers\AnalyticsController;
use App\Models\User;
use App\Models\UserAnalytic;
use App\Services\AbTestingService;
use App\Services\AnalyticsMetricsService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AnalyticsMetricsTest extends TestCase
{
    use RefreshDatabase;

    public function test_engagement_uses_dwell_or_scroll_or_funnel_action(): void
    {
        $now = Carbon::now();

        foreach (['bounce', 'dwell', 'scroll', 'action'] as $sessionId) {
            $this->event($sessionId, 'visit', '/', $now);
        }

        $this->event('dwell', 'engagement', '/', $now, [
            'type' => 'dwell_ping',
            'duration' => 15000,
        ]);
        $this->event('scroll', 'scroll', '/', $now, ['depth' => 25]);
        $this->event('action', 'cta_click', '/', $now, ['location' => 'hero']);

        $metrics = app(AnalyticsMetricsService::class);
        $stats = $metrics->dashboardStats($now->copy()->subHour(), $now->copy()->addHour());

        $this->assertSame(1, $metrics->bouncedSessions($now->copy()->subHour(), $now->copy()->addHour()));
        $this->assertSame(3, $stats['engaged']);
        $this->assertSame(75.0, $stats['engagement_rate']);

        $engagedQuery = DB::table('user_analytics')
            ->whereBetween('created_at', [
                $now->copy()->subHour(),
                $now->copy()->addHour(),
            ]);
        $metrics->applyEngagedEventConditions($engagedQuery);

        $this->assertSame(3, $engagedQuery->distinct()->count('session_id'));

        $chartMethod = new \ReflectionMethod(
            AnalyticsController::class,
            'getChartData',
        );
        $chartData = $chartMethod->invoke(
            app(AnalyticsController::class),
            $now->copy()->subHour(),
            $now->copy()->addHour(),
        );

        $this->assertSame(
            3,
            (int) $chartData->get('engagement')->first()->total,
        );
    }

    public function test_checkout_lead_and_untracked_payment_are_not_conflated(): void
    {
        $now = Carbon::now();

        foreach (['checkout', 'lead'] as $sessionId) {
            $this->event($sessionId, 'visit', '/c6-angle', $now);
            $this->event($sessionId, 'cta_click', '/c6-angle', $now);
        }

        $this->event('checkout', 'initiate_checkout', '/c6-angle', $now);
        $this->event('checkout', 'conversion', '/c6-angle', $now, ['type' => 'checkout_redirect']);
        $this->event('lead', 'conversion', '/c6-angle', $now, ['type' => 'wa_inquiry']);
        $this->event('lead', 'payment', '/c6-angle', $now, [
            'status' => 'success',
            'amount' => 250000,
        ]);

        $start = $now->copy()->subHour();
        $end = $now->copy()->addHour();
        $stats = app(AnalyticsMetricsService::class)->dashboardStats($start, $end);
        $metrics = app(AnalyticsMetricsService::class);
        $matrix = app(AbTestingService::class)->getPerformanceMatrix($start, $end);
        $funnel = collect($metrics->dashboardFunnel($start, $end))->keyBy('stage');
        $splitFunnel = app(AbTestingService::class)->getSplitFunnel($start, $end);

        $this->assertSame(1, $stats['initiate_checkouts']);
        $this->assertSame(1, $stats['leads']);
        $this->assertSame(0, $stats['payments']);
        $this->assertSame(0.0, $stats['total_revenue']);
        $this->assertSame(1, $matrix[0]['initiate_checkouts']);
        $this->assertSame(1, $matrix[0]['leads']);
        $this->assertSame(0.0, $matrix[0]['bounce_rate']);
        $this->assertSame(0, $matrix[0]['payments']);
        $this->assertSame(0, $matrix[0]['revenue']);
        $this->assertSame('Intent', $funnel['Initiate Checkout']['from_stage']);
        $this->assertSame('checkout', $funnel['Initiate Checkout']['branch']);
        $this->assertSame('Intent', $funnel['WhatsApp Leads']['from_stage']);
        $this->assertSame('lead', $funnel['WhatsApp Leads']['branch']);
        $this->assertSame(50.0, $funnel['WhatsApp Leads']['transition_percentage']);
        $this->assertSame(
            ['Visits', 'Engaged', 'Intent', 'Initiate Checkout', 'WhatsApp Leads', 'Payments'],
            collect($splitFunnel[0]['steps'])->pluck('stage')->all(),
        );
        $this->assertSame(
            2,
            collect($splitFunnel[0]['steps'])->firstWhere('stage', 'Engaged')['count'],
        );
    }

    public function test_whatsapp_inquiries_and_registrations_roll_up_to_unique_leads(): void
    {
        $now = Carbon::now();

        foreach (['inquiry', 'registration', 'both', 'other'] as $sessionId) {
            $this->event($sessionId, 'visit', '/', $now);
        }

        $this->event('inquiry', 'conversion', '/', $now, ['type' => 'wa_inquiry']);
        $this->event('registration', 'conversion', '/', $now, ['type' => 'wa_registration']);
        $this->event('both', 'conversion', '/', $now, ['type' => 'wa_inquiry']);
        $this->event('both', 'conversion', '/', $now, ['type' => 'wa_registration']);
        $this->event('other', 'conversion', '/', $now, ['type' => 'checkout_redirect']);

        $start = $now->copy()->subHour();
        $end = $now->copy()->addHour();
        $stats = app(AnalyticsMetricsService::class)->dashboardStats($start, $end);
        $matrix = app(AbTestingService::class)->getPerformanceMatrix($start, $end);

        $chartMethod = new \ReflectionMethod(
            AnalyticsController::class,
            'getChartData',
        );
        $chartData = $chartMethod->invoke(
            app(AnalyticsController::class),
            $start,
            $end,
        );

        $this->assertSame(3, $stats['leads']);
        $this->assertSame(75.0, $stats['lead_rate']);
        $this->assertSame(3, $matrix[0]['leads']);
        $this->assertSame(3, (int) $chartData->get('conversion')->first()->total);
    }

    public function test_deleting_a_user_keeps_their_anonymous_analytics_history(): void
    {
        $user = User::factory()->create();

        UserAnalytic::create([
            'session_id' => 'retained-session',
            'event_type' => 'visit',
            'event_data' => ['landing_source' => '/'],
            'user_id' => $user->id,
            'created_at' => now(),
        ]);

        $user->delete();

        $this->assertDatabaseHas('user_analytics', [
            'session_id' => 'retained-session',
            'user_id' => null,
        ]);
    }

    public function test_section_heatmap_uses_pbm_visibility_order(): void
    {
        $now = Carbon::now();

        $this->event('reader-one', 'visit', '/', $now);
        $this->event('reader-two', 'visit', '/', $now);
        $this->event('reader-one', 'section_view', '/', $now->copy()->subMinute(), [
            'section' => 'harga',
        ]);
        $this->event('reader-one', 'section_view', '/', $now, ['section' => 'hero']);
        $this->event('reader-two', 'section_view', '/', $now, ['section' => 'hero']);

        $heatmap = app(AbTestingService::class)->getSectionHeatmap(
            $now->copy()->subHour(),
            $now->copy()->addHour(),
        );
        $sections = collect($heatmap[0]['sections'])->keyBy('id');

        $this->assertSame(['hero', 'harga'], collect($heatmap[0]['sections'])->pluck('id')->all());
        $this->assertSame(100.0, $sections['hero']['pct']);
        $this->assertSame(50.0, $sections['harga']['pct']);
        $this->assertSame(50.0, $sections['harga']['drop_from_prev']);
    }

    private function event(
        string $sessionId,
        string $eventType,
        string $landingSource,
        Carbon $createdAt,
        array $eventData = [],
    ): void {
        UserAnalytic::create([
            'session_id' => $sessionId,
            'event_type' => $eventType,
            'event_data' => ['landing_source' => $landingSource, ...$eventData],
            'referral_source' => 'direct',
            'created_at' => $createdAt,
        ]);
    }
}
