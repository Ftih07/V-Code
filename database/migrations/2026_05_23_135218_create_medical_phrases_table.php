<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_phrases', function (Blueprint $table) {
            $table->id();

            // Kata / frasa yang akan di-boost ke Google STT
            $table->string('phrase');

            // Kategori kelompok frasa (untuk filter di Filament)
            // Contoh: 'status', 'rjp', 'defibrilasi', 'obat', 'airway',
            //         'irama', 'ttv', 'akses_vaskular', 'evaluasi'
            $table->string('category')->default('umum');

            // Nilai boost Google STT (1–20, default 20 = maks)
            $table->unsignedTinyInteger('boost')->default(20);

            // Apakah frasa ini aktif?
            $table->boolean('is_active')->default(true);

            // Catatan internal untuk operator
            $table->string('notes')->nullable();

            $table->timestamps();

            // Index untuk query cepat
            $table->index(['is_active', 'category']);
            $table->unique('phrase');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_phrases');
    }
};
