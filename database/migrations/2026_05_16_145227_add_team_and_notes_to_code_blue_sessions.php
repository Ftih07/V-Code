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
            $table->string('leader_name')->nullable()->after('patient_id');
            $table->string('team_members')->nullable()->after('leader_name');
            $table->text('additional_notes')->nullable()->after('final_transcription');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('code_blue_sessions', function (Blueprint $table) {
            //
        });
    }
};
