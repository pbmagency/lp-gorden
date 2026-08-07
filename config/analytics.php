<?php

return [
    'capabilities' => [
        'initiate_checkout' => true,
        'lead' => true,
        'payment' => false,
        'revenue' => false,
    ],

    'primary_metric' => 'total_lead_rate',
    'minimum_winner_visits' => 30,
];
