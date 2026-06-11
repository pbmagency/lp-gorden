<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\LabsController;
use Illuminate\Support\Facades\Route;

// ── Public landing page ───────────────────────────────────────────────────────
Route::inertia('/', 'landing')->name('home');
Route::inertia('/bio-ig-toefl-hack', 'landing')->name('home2');
Route::inertia('/toefl-hack', 'landing')->name('home3');

// 3 varian test untuk meta ads
Route::inertia('/test-hero-1', 'test-hero/test1')->name('test-hero-1');
Route::inertia('/test-hero-2', 'test-hero/test2')->name('test-hero-2');
Route::inertia('/test-hero-3', 'test-hero/test3')->name('test-hero-3');

// ── Analytics tracking endpoint (public, uses session CSRF) ──────────────────
Route::post('/analytics/track', [AnalyticsController::class, 'track'])->name('analytics.track');

// ── Authenticated routes ──────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// ── Cycle 2 Test Problem ──────────────────────────────────────────────────────
Route::inertia('/cycle2/agitation-test-1', 'cycle2/agitation-test-1')->name('cycle2.agitation1');
Route::inertia('/cycle2/agitation-test-2', 'cycle2/agitation-test-2')->name('cycle2.agitation2');
Route::inertia('/cycle2/agitation-test-3', 'cycle2/agitation-test-3')->name('cycle2.agitation3');


// ── Admin routes ──────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/export', [AnalyticsController::class, 'export'])->name('analytics.export');

    Route::get('/labs', [LabsController::class, 'index'])->name('labs');
    Route::post('/labs/clear-cache', [LabsController::class, 'clearCache'])->name('labs.clear-cache');
});

require __DIR__ . '/settings.php';
