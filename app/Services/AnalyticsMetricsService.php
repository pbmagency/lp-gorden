<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class AnalyticsMetricsService
{
    public const DWELL_THRESHOLD_MS = 15000;

    public const SCROLL_THRESHOLD = 25;

    public const FUNNEL_ACTION_EVENTS = [
        'cta_click',
        'initiate_checkout',
        'conversion',
        'payment',
    ];

    public const LEAD_CONVERSION_TYPES = [
        'wa_inquiry',
        'wa_registration',
    ];

    public function capabilities(): array
    {
        return config('analytics.capabilities');
    }

    public function dashboardStats(Carbon $startDate, Carbon $endDate): array
    {
        $totalVisits = $this->eventQuery('visit', $startDate, $endDate)->count();
        $uniqueVisitors = $this->eventSessions('visit', $startDate, $endDate);
        $bounces = $this->bouncedSessions($startDate, $endDate);
        $engaged = max(0, $uniqueVisitors - $bounces);
        $intent = $this->eventSessions('cta_click', $startDate, $endDate);
        $initiateCheckouts = $this->eventSessions('initiate_checkout', $startDate, $endDate);
        $leads = $this->leadSessions($startDate, $endDate);

        $payments = 0;
        $revenue = 0.0;

        if ($this->capabilities()['payment']) {
            $payments = $this->eventQuery('payment', $startDate, $endDate)
                ->where('event_data->status', 'success')
                ->distinct()
                ->count('session_id');
        }

        if ($this->capabilities()['revenue']) {
            $revenue = (float) $this->eventQuery('payment', $startDate, $endDate)
                ->where('event_data->status', 'success')
                ->sum(DB::raw("CAST(json_extract(event_data, '$.amount') AS DECIMAL(20, 2))"));
        }

        return [
            'total_visits' => $totalVisits,
            'unique_visitors' => $uniqueVisitors,
            'engaged' => $engaged,
            'engagement_rate' => round($this->safePct($engaged, $uniqueVisitors), 2),
            'intent' => $intent,
            'intent_rate' => round($this->safePct($intent, $uniqueVisitors), 2),
            'initiate_checkouts' => $initiateCheckouts,
            'initiate_checkout_rate' => round($this->safePct($initiateCheckouts, $uniqueVisitors), 2),
            'leads' => $leads,
            'lead_rate' => round($this->safePct($leads, $uniqueVisitors), 2),
            'payments' => $payments,
            'lead_to_payment_rate' => round($this->safePct($payments, $leads), 2),
            'payment_rate' => round($this->safePct($payments, $uniqueVisitors), 2),
            'total_revenue' => $revenue,
        ];
    }

    public function dashboardFunnel(Carbon $startDate, Carbon $endDate): array
    {
        $stats = $this->dashboardStats($startDate, $endDate);
        $visits = $stats['unique_visitors'];
        $steps = [
            ['stage' => 'Visits', 'count' => $visits, 'branch' => 'main', 'from_stage' => null],
            ['stage' => 'Engaged', 'count' => $stats['engaged'], 'branch' => 'main', 'from_stage' => 'Visits'],
            ['stage' => 'Intent', 'count' => $stats['intent'], 'branch' => 'main', 'from_stage' => 'Engaged'],
            ['stage' => 'Initiate Checkout', 'count' => $stats['initiate_checkouts'], 'branch' => 'checkout', 'from_stage' => 'Intent'],
            ['stage' => 'Payments', 'count' => $stats['payments'], 'branch' => 'checkout', 'from_stage' => 'Initiate Checkout'],
            ['stage' => 'WhatsApp Leads', 'count' => $stats['leads'], 'branch' => 'lead', 'from_stage' => 'Intent'],
        ];
        $counts = collect($steps)->pluck('count', 'stage');

        return collect($steps)->map(function (array $step) use ($counts, $visits) {
            $fromStage = $step['from_stage'];
            $previousCount = $fromStage ? (int) $counts->get($fromStage, 0) : 0;

            return [
                ...$step,
                'percentage' => $fromStage === null ? 100 : round($this->safePct($step['count'], $visits), 1),
                'transition_percentage' => $fromStage === null
                    ? 100
                    : round($this->safePct($step['count'], $previousCount), 1),
            ];
        })->all();
    }

    public function applyEngagedEventConditions(Builder $query): Builder
    {
        return $query->where(function (Builder $events) {
            $events
                ->where(function (Builder $dwell) {
                    $dwell->where('event_type', 'engagement')
                        ->where('event_data->type', 'dwell_ping')
                        ->where('event_data->duration', '>=', self::DWELL_THRESHOLD_MS);
                })
                ->orWhere(function (Builder $scroll) {
                    $scroll->where('event_type', 'scroll')
                        ->where('event_data->depth', '>=', self::SCROLL_THRESHOLD);
                })
                ->orWhereIn('event_type', self::FUNNEL_ACTION_EVENTS);
        });
    }

    public function bouncedSessions(Carbon $startDate, Carbon $endDate, ?string $referralSource = null): int
    {
        $query = DB::table('user_analytics as visits')
            ->where('visits.event_type', 'visit')
            ->whereBetween('visits.created_at', [$startDate, $endDate])
            ->when($referralSource && $referralSource !== 'all', fn (Builder $query) => $query->where('visits.referral_source', $referralSource));

        $this->applyBounceConditions($query, $startDate, $endDate, 'visits');

        return $query->distinct()->count('visits.session_id');
    }

    public function applyBounceConditions(Builder $query, Carbon $startDate, Carbon $endDate, string $visitAlias): Builder
    {
        return $query
            ->whereNotExists(function (Builder $event) use ($startDate, $endDate, $visitAlias) {
                $event->from('user_analytics as dwell')
                    ->whereColumn('dwell.session_id', "{$visitAlias}.session_id")
                    ->where('dwell.event_type', 'engagement')
                    ->where('dwell.event_data->type', 'dwell_ping')
                    ->where('dwell.event_data->duration', '>=', self::DWELL_THRESHOLD_MS)
                    ->whereBetween('dwell.created_at', [$startDate, $endDate]);
            })
            ->whereNotExists(function (Builder $event) use ($startDate, $endDate, $visitAlias) {
                $event->from('user_analytics as scrolls')
                    ->whereColumn('scrolls.session_id', "{$visitAlias}.session_id")
                    ->where('scrolls.event_type', 'scroll')
                    ->where('scrolls.event_data->depth', '>=', self::SCROLL_THRESHOLD)
                    ->whereBetween('scrolls.created_at', [$startDate, $endDate]);
            })
            ->whereNotExists(function (Builder $event) use ($startDate, $endDate, $visitAlias) {
                $event->from('user_analytics as actions')
                    ->whereColumn('actions.session_id', "{$visitAlias}.session_id")
                    ->whereIn('actions.event_type', self::FUNNEL_ACTION_EVENTS)
                    ->whereBetween('actions.created_at', [$startDate, $endDate]);
            });
    }

    private function eventSessions(string $eventType, Carbon $startDate, Carbon $endDate): int
    {
        return $this->eventQuery($eventType, $startDate, $endDate)
            ->distinct()
            ->count('session_id');
    }

    private function leadSessions(Carbon $startDate, Carbon $endDate): int
    {
        return $this->eventQuery('conversion', $startDate, $endDate)
            ->whereIn('event_data->type', self::LEAD_CONVERSION_TYPES)
            ->distinct()
            ->count('session_id');
    }

    private function eventQuery(string $eventType, Carbon $startDate, Carbon $endDate): Builder
    {
        return DB::table('user_analytics')
            ->where('event_type', $eventType)
            ->whereBetween('created_at', [$startDate, $endDate]);
    }

    private function safePct(float|int $numerator, float|int $denominator): float
    {
        return $denominator > 0 ? ($numerator / $denominator) * 100 : 0;
    }
}
