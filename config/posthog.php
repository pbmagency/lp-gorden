<?php

return [
    'api_key' => env('POSTHOG_PROJECT_TOKEN'),
    'host' => env('POSTHOG_HOST'),
    'disabled' => (bool) env('POSTHOG_DISABLED', false),

    // Attached to every event this project sends, so all clients sharing the
    // same PostHog project can be told apart. client_type is fixed for this
    // project's funnel (CTWA leads, no form/payment), unlike client_id which
    // changes per client deployment of this codebase.
    'client_id' => env('POSTHOG_CLIENT_ID', 'fullbright-toefl'),
    'client_type' => env('POSTHOG_CLIENT_TYPE', 'ctwa_leads'),
];
