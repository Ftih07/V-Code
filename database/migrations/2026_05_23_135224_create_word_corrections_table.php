<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel ini menyimpan koreksi kata yang sering salah dikenali oleh
     * Web Speech API maupun Google STT.
     *
     * Contoh kasus nyata:
     *   "amino darah"   → "amiodaron"
     *   "debit relasi"  → "defibrilasi"
     *   "ada renal"     → "adrenalin"
     *   "komedo"        → "amiodaron"
     *
     * Koreksi dilakukan di sisi PHP (backend) setelah Google STT menghasilkan
     * teks, SEBELUM dikirim ke frontend.
     *
     * Kolom:
     *   wrong_text  : apa yang dikenali STT (salah)
     *   correct_text: kata yang benar secara medis
     *   match_mode  : 'exact' = kecocokan tepat (default, lebih aman)
     *                 'contains' = teks salah adalah bagian dari kalimat
     *                 'regex' = pola regex (advanced, hati-hati)
     *   is_active   : toggle on/off tanpa hapus data
     *   hit_count   : berapa kali koreksi ini aktif terpicu (auto-increment)
     *   notes       : konteks / kenapa kata ini sering salah
     */
    public function up(): void
    {
        Schema::create('word_corrections', function (Blueprint $table) {
            $table->id();

            $table->string('wrong_text');
            $table->string('correct_text');

            // 'exact' | 'contains' | 'regex'
            $table->string('match_mode')->default('contains');

            $table->boolean('is_active')->default(true);

            // Counter otomatis bertambah saat koreksi ini dipakai
            $table->unsignedInteger('hit_count')->default(0);

            $table->string('notes')->nullable();

            $table->timestamps();

            $table->index(['is_active', 'match_mode']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('word_corrections');
    }
};
