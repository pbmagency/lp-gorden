<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\LabsController;
use Illuminate\Support\Facades\Route;

// ── Public landing page ───────────────────────────────────────────────────────
Route::inertia('/', 'landing')->name('home');
// ── Cycle 4 Test Social Proof ─────────────────────
Route::inertia('/c4-sp-1', 'cycle4/sp-test-1')->name('cycle4.sp.v1');
Route::inertia('/c4-sp-2', 'cycle4/sp-test-2')->name('cycle4.sp.v2');
Route::inertia('/c5-hero', 'cycle5/hero-test')->name('cyccle5.hero.test');
Route::inertia('/c6-angle', 'test-pages/cycle6-angle/test-1')->name('cycle6.angle.v1');
Route::inertia('/c6-angle-2', 'test-pages/cycle6-angle-2/test-1')->name('cycle6.angle.v2');
Route::inertia('/bio-ig-toefl-hack', 'landing')->name('home2');
Route::inertia('/toefl-hack', 'landing')->name('home3');

// ── Analytics tracking endpoint (public, uses session CSRF) ──────────────────
Route::post('/analytics/track', [AnalyticsController::class, 'track'])->name('analytics.track');

// ── Authenticated routes ──────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::inertia('/c3-problem', 'cycle3/agitation-test')->name('cycle3.agitation');

// ── Admin routes ──────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('/export', [AnalyticsController::class, 'export'])->name('analytics.export');

    Route::get('/labs', [LabsController::class, 'index'])->name('labs');
    Route::post('/labs/clear-cache', [LabsController::class, 'clearCache'])->name('labs.clear-cache');
});

require __DIR__ . '/settings.php';
