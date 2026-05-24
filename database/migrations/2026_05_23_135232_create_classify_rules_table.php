<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel ini menggantikan hardcoded classify() di controller dan record.tsx.
     *
     * Cara kerja:
     *   - Backend (PHP) membaca rules ini dari DB/cache untuk classify()
     *   - Frontend (React) fetch rules via GET /api/code-blue/classify-rules
     *     saat pertama load halaman record, lalu memakai rules tsb secara lokal
     *
     * Kolom:
     *   keyword      : kata kunci yang dicari di teks (lowercase)
     *   match_mode   : 'contains' (default) | 'exact' | 'starts_with' | 'regex'
     *   category     : 'tindakan' | 'pengkajian' | 'evaluasi'
     *   target_field : field AutoFillData yang akan diisi (nullable = tindakan)
     *                  Contoh: 'ttv_td', 'ttv_nadi', 'evaluation_result', dll.
     *   priority     : urutan pengecekan — lebih kecil = dicek lebih dulu
     *                  (evaluasi harus di atas pengkajian, default: evaluasi=10,
     *                   pengkajian=20, tindakan=30)
     *   is_active    : toggle on/off
     *   notes        : keterangan operator
     */
    public function up(): void
    {
        Schema::create('classify_rules', function (Blueprint $table) {
            $table->id();

            $table->string('keyword');

            // 'contains' | 'exact' | 'starts_with' | 'regex'
            $table->string('match_mode')->default('contains');

            $table->string('category');           // tindakan | pengkajian | evaluasi

            // Kolom target_field sesuai AutoFillData di record.tsx
            $table->string('target_field')->nullable();

            $table->unsignedSmallInteger('priority')->default(20);

            $table->boolean('is_active')->default(true);

            $table->string('notes')->nullable();

            $table->timestamps();

            $table->index(['is_active', 'priority']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classify_rules');
    }
};
