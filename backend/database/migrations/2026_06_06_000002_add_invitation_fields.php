<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('weddings', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
            $table->string('event_time')->nullable()->after('event_date');
            $table->string('venue_address')->nullable()->after('venue');
            $table->json('photos')->nullable()->after('message');
        });

        Schema::table('guests', function (Blueprint $table) {
            $table->uuid('token')->nullable()->unique()->after('wedding_id');
            $table->string('rsvp_status')->nullable()->after('sort_order');
        });
    }

    public function down(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->dropColumn(['token', 'rsvp_status']);
        });

        Schema::table('weddings', function (Blueprint $table) {
            $table->dropColumn(['slug', 'event_time', 'venue_address', 'photos']);
        });
    }
};
