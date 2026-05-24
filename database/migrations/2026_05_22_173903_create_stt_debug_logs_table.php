<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('stt_debug_logs', function (Blueprint $table) {
            $table->id();
            // Digunakan saat proses perekaman berlangsung
            $table->unsignedBigInteger('patient_id')->nullable();
            // Digunakan untuk relasi final setelah draft disimpan
            $table->unsignedBigInteger('session_id')->nullable();

            $table->string('time_mark'); // Menyimpan waktu log ex: "20.04.54.60"
            $table->string('type');      // 'info', 'send', 'result', 'silence', 'error', 'ws'
            $table->text('message');     // Isi pesan log debug
            $table->timestamps();

            // Indexing agar query pencarian log cepat
            $table->index('patient_id');
            $table->index('session_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('stt_debug_logs');
    }
};
