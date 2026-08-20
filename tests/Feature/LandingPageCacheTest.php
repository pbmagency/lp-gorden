<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class LandingPageCacheTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Cache::store('file')->flush();
    }

    public function test_anonymous_landing_page_is_served_from_the_fast_file_cache(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertHeader('X-Landing-Cache', 'MISS')
            ->assertDontSee('name="csrf-token"', false);

        $this->get('/')
            ->assertOk()
            ->assertHeader('X-Landing-Cache', 'HIT')
            ->assertHeader('Cache-Control', 'max-age=300, public, stale-while-revalidate=86400')
            ->assertSee('Gorden Custom Solo Raya');
    }

    public function test_query_strings_are_not_mixed_into_the_shared_html_cache(): void
    {
        $this->get('/?utm_source=campaign')
            ->assertOk()
            ->assertHeaderMissing('X-Landing-Cache');
    }
}
