<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('code_blue_sessions', function (Blueprint $table) {
            $table->string('leader_name')->nullable()->change();
            $table->string('recorder_name')->nullable()->after('leader_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('code_blue_sessions', function (Blueprint $table) {
            $table->string('leader_name')->nullable(false)->change();
            $table->dropColumn('recorder_name');
        });
    }
};
