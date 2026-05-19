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
        Schema::create('code_blue_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('patient_id')->constrained();
            $table->string('leader_name');
            // Ganti tipe data team_members jadi JSON untuk repeater
            $table->json('team_members')->nullable();
            $table->string('incident_type')->nullable();
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->integer('duration_seconds');
            $table->string('status')->default('draft');
            $table->text('additional_notes')->nullable();

            // --- KOLOM BARU UNTUK PENGKAJIAN ---
            $table->text('assessment_condition')->nullable(); // A. Kondisi Pasien
            $table->string('ttv_time')->nullable();         // Pukul
            $table->string('ttv_td')->nullable();           // TD
            $table->string('ttv_nadi')->nullable();         // Nadi
            $table->string('ttv_rr')->nullable();           // RR
            $table->string('ttv_spo2')->nullable();         // SpO2
            $table->string('ttv_gcs')->nullable();          // Kesadaran (GCS)

            // --- KOLOM BARU UNTUK EVALUASI ---
            $table->text('evaluation_result')->nullable();  // A. Hasil
            $table->text('evaluation_plan')->nullable();    // B. Rencana Tindak Lanjut

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('code_blue_sessions');
    }
};
