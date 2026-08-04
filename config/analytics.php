<?php

return [
    'capabilities' => [
        'initiate_checkout' => true,
        'lead' => true,
        'payment' => false,
        'revenue' => false,
    ],

    'primary_metric' => 'lead_cr',
    'minimum_winner_visits' => 30,
];
