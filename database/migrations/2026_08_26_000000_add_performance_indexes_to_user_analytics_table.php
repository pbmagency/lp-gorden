<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_analytics', function (Blueprint $table) {
            // Standalone created_at index for date-range queries (export, chart data)
            $table->index('created_at', 'ua_created_at_idx');

            // Session-based lookups (bounce analysis, device performance, segmentation)
            $table->index('session_id', 'ua_session_id_idx');

            // Composite for the most common aggregation pattern:
            // WHERE event_type = X AND created_at BETWEEN ... GROUP BY session_id
            $table->index(['session_id', 'event_type', 'created_at'], 'ua_session_event_time_idx');
        });
    }

    public function down(): void
    {
        Schema::table('user_analytics', function (Blueprint $table) {
            $table->dropIndex('ua_created_at_idx');
            $table->dropIndex('ua_session_id_idx');
            $table->dropIndex('ua_session_event_time_idx');
        });
    }
};
