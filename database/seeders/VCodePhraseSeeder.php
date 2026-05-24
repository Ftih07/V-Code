<?php

namespace Database\Seeders;

use App\Models\ClassifyRule;
use App\Models\MedicalPhrase;
use App\Models\WordCorrection;
use Illuminate\Database\Seeder;

class VCodePhraseSeeder extends Seeder
{
    public function run(): void
    {
        // ================================================================
        // 1. MEDICAL PHRASES — untuk Google STT speech context boost
        // ================================================================

        $phrases = [
            // ── Status & Aktivasi ──────────────────────────────────────
            ['phrase' => 'CODE BLUE',              'category' => 'status'],
            ['phrase' => 'henti jantung',          'category' => 'status'],
            ['phrase' => 'henti napas',            'category' => 'status'],
            ['phrase' => 'tidak ada nadi',         'category' => 'status'],
            ['phrase' => 'tidak sadar',            'category' => 'status'],
            ['phrase' => 'tidak responsif',        'category' => 'status'],
            ['phrase' => 'pasien tidak respons',   'category' => 'status'],
            ['phrase' => 'pasien kolaps',          'category' => 'status'],
            ['phrase' => 'ROSC',                   'category' => 'status'],
            ['phrase' => 'ROSC tercapai',          'category' => 'status'],
            ['phrase' => 'pasien stabil',          'category' => 'status'],
            ['phrase' => 'kondisi stabil',         'category' => 'status'],

            // ── RJP / CPR ─────────────────────────────────────────────
            ['phrase' => 'RJP',                    'category' => 'rjp'],
            ['phrase' => 'CPR',                    'category' => 'rjp'],
            ['phrase' => 'resusitasi jantung paru', 'category' => 'rjp'],
            ['phrase' => 'mulai CPR',              'category' => 'rjp'],
            ['phrase' => 'lanjut CPR',             'category' => 'rjp'],
            ['phrase' => 'kompresi dada',          'category' => 'rjp'],
            ['phrase' => 'tiga puluh kompresi',    'category' => 'rjp'],
            ['phrase' => 'ventilasi',              'category' => 'rjp'],
            ['phrase' => 'bag valve mask',         'category' => 'rjp'],
            ['phrase' => 'BVM',                    'category' => 'rjp'],
            ['phrase' => 'napas buatan',           'category' => 'rjp'],
            ['phrase' => 'dua kali ventilasi',     'category' => 'rjp'],
            ['phrase' => 'cek nadi',               'category' => 'rjp'],
            ['phrase' => 'pasang monitor',         'category' => 'rjp'],
            ['phrase' => 'analisa irama',          'category' => 'rjp'],
            ['phrase' => 'tim resusitasi',         'category' => 'rjp'],

            // ── Defibrilasi ───────────────────────────────────────────
            ['phrase' => 'defibrilasi',            'category' => 'defibrilasi'],
            ['phrase' => 'defibrilator',           'category' => 'defibrilasi'],
            ['phrase' => 'defibrillator',          'category' => 'defibrilasi'],
            ['phrase' => 'AED',                    'category' => 'defibrilasi'],
            ['phrase' => 'siapkan defibrillator',  'category' => 'defibrilasi'],
            ['phrase' => 'pad terpasang',          'category' => 'defibrilasi'],
            ['phrase' => 'charge 200 joule',       'category' => 'defibrilasi'],
            ['phrase' => 'clear',                  'category' => 'defibrilasi'],
            ['phrase' => 'shock diberikan',        'category' => 'defibrilasi'],
            ['phrase' => 'shock 360 joule',        'category' => 'defibrilasi'],
            ['phrase' => '200 joule',              'category' => 'defibrilasi'],
            ['phrase' => '360 joule',              'category' => 'defibrilasi'],

            // ── Obat & Dosis ──────────────────────────────────────────
            ['phrase' => 'epinefrin',              'category' => 'obat'],
            ['phrase' => 'epinephrine',            'category' => 'obat'],
            ['phrase' => 'adrenalin',              'category' => 'obat'],
            ['phrase' => '1 mg epinefrin',         'category' => 'obat'],
            ['phrase' => '0,5 mg epinefrin',       'category' => 'obat'],
            ['phrase' => 'amiodaron',              'category' => 'obat'],
            ['phrase' => 'amiodarone',             'category' => 'obat'],
            ['phrase' => '300 mg amiodaron',       'category' => 'obat'],
            ['phrase' => '150 mg amiodaron',       'category' => 'obat'],
            ['phrase' => 'amiodaron dosis dua',    'category' => 'obat'],
            ['phrase' => 'atropin',                'category' => 'obat'],
            ['phrase' => 'sulfas atropin',         'category' => 'obat'],
            ['phrase' => '0,5 mg atropin',         'category' => 'obat'],
            ['phrase' => '1 mg atropin',           'category' => 'obat'],
            ['phrase' => 'dopamin',                'category' => 'obat'],
            ['phrase' => 'dobutamin',              'category' => 'obat'],
            ['phrase' => 'norepinefrin',           'category' => 'obat'],
            ['phrase' => 'lidokain',               'category' => 'obat'],
            ['phrase' => 'sodium bikarbonat',      'category' => 'obat'],
            ['phrase' => 'natrium bikarbonat',     'category' => 'obat'],
            ['phrase' => 'Meylon',                 'category' => 'obat'],
            ['phrase' => 'adenosin',               'category' => 'obat'],
            ['phrase' => 'adenosin 6 mg',          'category' => 'obat'],
            ['phrase' => 'procainamide',           'category' => 'obat'],
            ['phrase' => 'sotalol',                'category' => 'obat'],
            ['phrase' => 'magnesium',              'category' => 'obat'],
            ['phrase' => 'MgSO4',                  'category' => 'obat'],
            ['phrase' => 'magnesium sulfat',       'category' => 'obat'],
            ['phrase' => 'intravena',              'category' => 'obat'],
            ['phrase' => 'IV bolus',               'category' => 'obat'],
            ['phrase' => 'drip',                   'category' => 'obat'],
            ['phrase' => 'dopamin drip',           'category' => 'obat'],
            ['phrase' => 'epinefrin drip',         'category' => 'obat'],

            // ── Airway & Ventilasi ────────────────────────────────────
            ['phrase' => 'intubasi',               'category' => 'airway'],
            ['phrase' => 'endotracheal tube',      'category' => 'airway'],
            ['phrase' => 'ETT',                    'category' => 'airway'],
            ['phrase' => 'pipa endotrakeal',       'category' => 'airway'],
            ['phrase' => 'ETT masuk',              'category' => 'airway'],
            ['phrase' => 'ETT ukuran tujuh koma lima', 'category' => 'airway'],
            ['phrase' => 'kedalaman dua puluh dua', 'category' => 'airway'],
            ['phrase' => 'konfirmasi CO2 positif', 'category' => 'airway'],
            ['phrase' => 'auskultasi bilateral',   'category' => 'airway'],
            ['phrase' => 'fiksasi ETT',            'category' => 'airway'],
            ['phrase' => 'LMA',                    'category' => 'airway'],
            ['phrase' => 'suction',                'category' => 'airway'],
            ['phrase' => 'suction dilakukan',      'category' => 'airway'],
            ['phrase' => 'OPA dipasang',           'category' => 'airway'],
            ['phrase' => 'siapkan intubasi',       'category' => 'airway'],
            ['phrase' => 'cek jalan napas',        'category' => 'airway'],
            ['phrase' => 'jalan napas tidak paten', 'category' => 'airway'],
            ['phrase' => 'head tilt chin lift',    'category' => 'airway'],
            ['phrase' => 'jaw thrust',             'category' => 'airway'],
            ['phrase' => 'ada sekret',             'category' => 'airway'],
            ['phrase' => 'BVM diberikan',          'category' => 'airway'],
            ['phrase' => 'oksigen',                'category' => 'airway'],
            ['phrase' => 'saturasi oksigen',       'category' => 'airway'],
            ['phrase' => 'SpO2',                   'category' => 'airway'],
            ['phrase' => 'sungkup',                'category' => 'airway'],
            ['phrase' => 'nasal kanul',            'category' => 'airway'],
            ['phrase' => 'NRM',                    'category' => 'airway'],

            // ── Irama Jantung ─────────────────────────────────────────
            ['phrase' => 'VF',                     'category' => 'irama'],
            ['phrase' => 'fibrilasi ventrikel',    'category' => 'irama'],
            ['phrase' => 'ventricular fibrillation', 'category' => 'irama'],
            ['phrase' => 'VT',                     'category' => 'irama'],
            ['phrase' => 'takikardia ventrikel',   'category' => 'irama'],
            ['phrase' => 'VT tanpa nadi',          'category' => 'irama'],
            ['phrase' => 'asistol',                'category' => 'irama'],
            ['phrase' => 'asystole',               'category' => 'irama'],
            ['phrase' => 'PEA',                    'category' => 'irama'],
            ['phrase' => 'irama sinus',            'category' => 'irama'],
            ['phrase' => 'sinus ritme',            'category' => 'irama'],
            ['phrase' => 'sinus rhythm',           'category' => 'irama'],
            ['phrase' => 'SVT',                    'category' => 'irama'],
            ['phrase' => 'bradikardi',             'category' => 'irama'],
            ['phrase' => 'takikardi',              'category' => 'irama'],

            // ── TTV / Monitoring ──────────────────────────────────────
            ['phrase' => 'tekanan darah',          'category' => 'ttv'],
            ['phrase' => 'tensi',                  'category' => 'ttv'],
            ['phrase' => 'sistol',                 'category' => 'ttv'],
            ['phrase' => 'diastol',                'category' => 'ttv'],
            ['phrase' => 'nadi karotis',           'category' => 'ttv'],
            ['phrase' => 'laju jantung',           'category' => 'ttv'],
            ['phrase' => 'heart rate',             'category' => 'ttv'],
            ['phrase' => 'RR',                     'category' => 'ttv'],
            ['phrase' => 'respiratory rate',       'category' => 'ttv'],
            ['phrase' => 'laju napas',             'category' => 'ttv'],
            ['phrase' => 'GCS',                    'category' => 'ttv'],
            ['phrase' => 'Glasgow Coma Scale',     'category' => 'ttv'],
            ['phrase' => 'GCS tiga',               'category' => 'ttv'],
            ['phrase' => 'GCS empat',              'category' => 'ttv'],
            ['phrase' => 'GCS lima',               'category' => 'ttv'],
            ['phrase' => 'GCS sepuluh',            'category' => 'ttv'],
            ['phrase' => 'kesadaran',              'category' => 'ttv'],
            ['phrase' => 'somnolen',               'category' => 'ttv'],
            ['phrase' => 'sopor',                  'category' => 'ttv'],
            ['phrase' => 'koma',                   'category' => 'ttv'],
            ['phrase' => 'kompos mentis',          'category' => 'ttv'],
            ['phrase' => 'pupil',                  'category' => 'ttv'],
            ['phrase' => 'isokor',                 'category' => 'ttv'],
            ['phrase' => 'anisokor',               'category' => 'ttv'],
            ['phrase' => 'pupil isokor',           'category' => 'ttv'],
            ['phrase' => 'pupil reaktif',          'category' => 'ttv'],
            ['phrase' => 'refleks cahaya',         'category' => 'ttv'],
            ['phrase' => 'refleks cahaya positif', 'category' => 'ttv'],
            ['phrase' => 'suhu',                   'category' => 'ttv'],
            ['phrase' => 'temperatur',             'category' => 'ttv'],
            ['phrase' => 'ventilasi adekuat',      'category' => 'ttv'],

            // ── Akses Vaskular ────────────────────────────────────────
            ['phrase' => 'akses IV',               'category' => 'akses_vaskular'],
            ['phrase' => 'infus',                  'category' => 'akses_vaskular'],
            ['phrase' => 'line IV',                'category' => 'akses_vaskular'],
            ['phrase' => 'vena jugular',           'category' => 'akses_vaskular'],
            ['phrase' => 'NaCl',                   'category' => 'akses_vaskular'],
            ['phrase' => 'Ringer Laktat',          'category' => 'akses_vaskular'],
            ['phrase' => 'RL',                     'category' => 'akses_vaskular'],
            ['phrase' => 'cairan',                 'category' => 'akses_vaskular'],
            ['phrase' => 'intraoseus',             'category' => 'akses_vaskular'],

            // ── Evaluasi & Outcome ────────────────────────────────────
            ['phrase' => 'waktu kematian',         'category' => 'evaluasi'],
            ['phrase' => 'time of death',          'category' => 'evaluasi'],
            ['phrase' => 'dipindahkan',            'category' => 'evaluasi'],
            ['phrase' => 'transfer ke ICU',        'category' => 'evaluasi'],
            ['phrase' => 'transfer ICU',           'category' => 'evaluasi'],
            ['phrase' => 'RJP dihentikan',         'category' => 'evaluasi'],
            ['phrase' => 'RJPO dihentikan',        'category' => 'evaluasi'],
            ['phrase' => 'keluarga diberitahu',    'category' => 'evaluasi'],
            ['phrase' => 'informat konsen',        'category' => 'evaluasi'],
            ['phrase' => 'informed consent',       'category' => 'evaluasi'],
            ['phrase' => 'rencana pindah ICU',     'category' => 'evaluasi'],
            ['phrase' => 'pasang ventilator',      'category' => 'evaluasi'],
            ['phrase' => 'outcome baik',           'category' => 'evaluasi'],

            // ── Kontrol Sistem & Validasi (Modul 10 & 12) ──────────────
            ['phrase' => 'validasi data',          'category' => 'sistem'], // [cite: 22]
            ['phrase' => 'edit dokumentasi',       'category' => 'sistem'], // [cite: 22]
            ['phrase' => 'finalisasi',             'category' => 'sistem'], // [cite: 22]
            ['phrase' => 'suara tidak jelas',      'category' => 'sistem'], // [cite: 26]

            // ── Tambahan Spesifik Modul ───────────────────────────────
            ['phrase' => 'VF terdeteksi',          'category' => 'irama'], // [cite: 6]
            ['phrase' => 'ROSC berhasil',          'category' => 'status'], // [cite: 16]
            ['phrase' => 'tiga ratus miligram',    'category' => 'obat'],
            ['phrase' => 'seratus lima puluh miligram', 'category' => 'obat'],
        ];

        foreach ($phrases as $data) {
            MedicalPhrase::updateOrCreate(
                ['phrase' => $data['phrase']],
                array_merge($data, ['boost' => 20, 'is_active' => true])
            );
        }

        // ================================================================
        // 2. WORD CORRECTIONS — koreksi kata yang sering salah dikenali STT
        // ================================================================

        $corrections = [
            // ── Obat ──────────────────────────────────────────────────
            ['wrong_text' => 'amino darah',          'correct_text' => 'amiodaron',    'notes' => 'Google sering salah "amiodaron" → "amino darah"'],
            ['wrong_text' => 'aminodaron',            'correct_text' => 'amiodaron',    'notes' => 'Salah ejaan umum'],
            ['wrong_text' => 'amiodaron dosis 2',    'correct_text' => 'amiodaron 150 mg', 'notes' => '"dosis dua" = 150 mg (dosis lanjutan)'],
            ['wrong_text' => 'komedo',               'correct_text' => 'amiodaron',    'notes' => 'Homonim fonetik'],
            ['wrong_text' => 'ada renal',            'correct_text' => 'adrenalin',    'notes' => 'Google STT sering salah transkripsi'],
            ['wrong_text' => 'epinefrin 1 ampul',    'correct_text' => 'epinefrin 1 mg', 'notes' => 'Standarisasi dosis'],
            ['wrong_text' => 'sulfas atropine',      'correct_text' => 'sulfas atropin', 'notes' => 'Ejaan Indonesia'],
            ['wrong_text' => 'sodium bicarbonat',    'correct_text' => 'sodium bikarbonat', 'notes' => 'Ejaan Indonesia'],
            ['wrong_text' => 'meylon',               'correct_text' => 'sodium bikarbonat', 'notes' => 'Nama dagang → nama generik'],
            ['wrong_text' => 'mgi so4',              'correct_text' => 'MgSO4',        'notes' => 'Salah baca formula kimia'],
            ['wrong_text' => 'mag so4',              'correct_text' => 'MgSO4',        'notes' => 'Salah baca formula kimia'],
            ['wrong_text' => 'procaine amide',       'correct_text' => 'procainamide', 'notes' => 'Penulisan terpisah'],
            ['wrong_text' => 'nor epinefrin',        'correct_text' => 'norepinefrin', 'notes' => 'Penulisan terpisah'],

            // ── Prosedur ──────────────────────────────────────────────
            ['wrong_text' => 'debit relasi',         'correct_text' => 'defibrilasi',  'notes' => 'Google STT homonim fonetik'],
            ['wrong_text' => 'defibrasi',            'correct_text' => 'defibrilasi',  'notes' => 'Salah ucap umum'],
            ['wrong_text' => 'definisi',             'correct_text' => 'defibrilasi',  'notes' => 'Homonim fonetik'],
            ['wrong_text' => 'resurektasi',          'correct_text' => 'resusitasi',   'notes' => 'Salah ucap'],
            ['wrong_text' => 'resusitasi jantung',   'correct_text' => 'resusitasi jantung paru', 'notes' => 'Singkatan tidak lengkap'],
            ['wrong_text' => 'rjp',                  'correct_text' => 'RJP',          'notes' => 'Uppercase standar'],
            ['wrong_text' => 'cpr',                  'correct_text' => 'CPR',          'notes' => 'Uppercase standar'],
            ['wrong_text' => 'bv m',                 'correct_text' => 'BVM',          'notes' => 'Pemisahan akronim'],
            ['wrong_text' => 'b v m',                'correct_text' => 'BVM',          'notes' => 'Pemisahan akronim'],
            ['wrong_text' => 'int u basi',           'correct_text' => 'intubasi',     'notes' => 'Pemisahan suku kata'],
            ['wrong_text' => 'orogastric airway',    'correct_text' => 'OPA',          'notes' => 'Singkatan berbeda'],

            // ── Irama ─────────────────────────────────────────────────
            ['wrong_text' => 'v f',                  'correct_text' => 'VF',           'notes' => 'Pemisahan akronim'],
            ['wrong_text' => 'v t',                  'correct_text' => 'VT',           'notes' => 'Pemisahan akronim'],
            ['wrong_text' => 'p e a',                'correct_text' => 'PEA',          'notes' => 'Pemisahan akronim'],
            ['wrong_text' => 'pea ',                 'correct_text' => 'PEA',          'notes' => 'Lowercase'],
            ['wrong_text' => 'asistole',             'correct_text' => 'asistol',      'notes' => 'Penulisan bahasa Inggris'],
            ['wrong_text' => 'sistol',               'correct_text' => 'asistol',      'notes' => 'Mungkin terpotong (cek konteks)'],

            // ── TTV ───────────────────────────────────────────────────
            ['wrong_text' => 'spo 2',                'correct_text' => 'SpO2',         'notes' => 'Pemisahan angka'],
            ['wrong_text' => 'sp o2',                'correct_text' => 'SpO2',         'notes' => 'Pemisahan simbol'],
            ['wrong_text' => 'saturasi o2',          'correct_text' => 'saturasi oksigen', 'notes' => 'Standarisasi'],
            ['wrong_text' => 'gcs ',                 'correct_text' => 'GCS',          'notes' => 'Lowercase'],
            ['wrong_text' => 'glasgow',              'correct_text' => 'Glasgow Coma Scale', 'notes' => 'Nama tidak lengkap'],
            ['wrong_text' => 'r r',                  'correct_text' => 'RR',           'notes' => 'Pemisahan akronim'],
            ['wrong_text' => 'rr ',                  'correct_text' => 'RR',           'notes' => 'Lowercase'],
            ['wrong_text' => 'tensi ',               'correct_text' => 'tekanan darah', 'notes' => 'Penyeragaman istilah'],
            ['wrong_text' => 'td ',                  'correct_text' => 'tekanan darah', 'notes' => 'Singkatan'],
            ['wrong_text' => 'bp ',                  'correct_text' => 'tekanan darah', 'notes' => 'Singkatan Inggris'],

            // ── Evaluasi ──────────────────────────────────────────────
            ['wrong_text' => 'ross',                 'correct_text' => 'ROSC',         'notes' => 'Salah eja/dengar'],
            ['wrong_text' => 'rosc ',                'correct_text' => 'ROSC',         'notes' => 'Lowercase'],
            ['wrong_text' => 'return of spontaneous circulation', 'correct_text' => 'ROSC', 'notes' => 'Kepanjangan → singkatan'],
            ['wrong_text' => 'icu ',                 'correct_text' => 'ICU',          'notes' => 'Lowercase'],
            ['wrong_text' => 'i c u',                'correct_text' => 'ICU',          'notes' => 'Pemisahan akronim'],
            ['wrong_text' => 'informed konsen',      'correct_text' => 'informed consent', 'notes' => 'Campur Indonesia-Inggris'],
            ['wrong_text' => 'informat konsen',      'correct_text' => 'informed consent', 'notes' => 'Salah ucap umum di Indonesia'],

            // ── Rute Pemberian Obat & Lainnya ─────────────────────────
            ['wrong_text' => 'i ve',               'correct_text' => 'IV',             'notes' => 'Google STT sering salah transkripsi rute IV'],
            ['wrong_text' => 'ai ve',              'correct_text' => 'IV',             'notes' => 'Google STT sering salah transkripsi rute IV'],
            ['wrong_text' => 'ai o',               'correct_text' => 'IO',             'notes' => 'Google STT sering salah transkripsi rute IO'],
            ['wrong_text' => 'ip',                 'correct_text' => 'IV',             'notes' => 'Sering rancu dengan IV'],
            ['wrong_text' => 'gcs tiga',           'correct_text' => 'GCS 3',          'notes' => 'Standarisasi output angka EMR'], // [cite: 14]
            ['wrong_text' => 'gcs sepuluh',        'correct_text' => 'GCS 10',         'notes' => 'Standarisasi output angka EMR'], // [cite: 16]
            ['wrong_text' => 'charge dua ratus',   'correct_text' => 'charge 200 joule', 'notes' => 'Standarisasi kalimat defibrilasi'], // [cite: 8]
        ];

        foreach ($corrections as $data) {
            WordCorrection::updateOrCreate(
                ['wrong_text' => $data['wrong_text']],
                array_merge($data, [
                    'match_mode' => 'contains',
                    'is_active' => true,
                    'hit_count' => 0,
                ])
            );
        }

        // ================================================================
        // 3. CLASSIFY RULES — menggantikan hardcoded classify() function
        //
        // Priority: lebih kecil = dicek lebih dulu
        //   10  = evaluasi (harus dicek duluan)
        //   20  = pengkajian
        //   30  = tindakan (default/fallback)
        // ================================================================

        $rules = [
            // ── EVALUASI (priority 10) ────────────────────────────────
            ['keyword' => 'rosc',                 'category' => 'evaluasi', 'target_field' => 'evaluation_result', 'priority' => 10, 'notes' => 'Return of spontaneous circulation'],
            ['keyword' => 'return of spontaneous', 'category' => 'evaluasi', 'target_field' => 'evaluation_result', 'priority' => 10],
            ['keyword' => 'stabil',               'category' => 'evaluasi', 'target_field' => 'evaluation_result', 'priority' => 10],
            ['keyword' => 'meninggal',            'category' => 'evaluasi', 'target_field' => 'evaluation_result', 'priority' => 10],
            ['keyword' => 'time of death',        'category' => 'evaluasi', 'target_field' => 'evaluation_result', 'priority' => 10],
            ['keyword' => 'waktu kematian',       'category' => 'evaluasi', 'target_field' => 'evaluation_result', 'priority' => 10],
            ['keyword' => 'dihentikan',           'category' => 'evaluasi', 'target_field' => 'evaluation_result', 'priority' => 10],
            ['keyword' => 'keluarga diberitahu',  'category' => 'evaluasi', 'target_field' => 'evaluation_result', 'priority' => 10],
            ['keyword' => 'outcome baik',         'category' => 'evaluasi', 'target_field' => 'evaluation_result', 'priority' => 10],
            ['keyword' => 'hasil',                'category' => 'evaluasi', 'target_field' => 'evaluation_result', 'priority' => 11, 'notes' => 'Lower priority: "hasil" bisa ambigu'],
            ['keyword' => 'rencana',              'category' => 'evaluasi', 'target_field' => 'evaluation_plan',   'priority' => 10],
            ['keyword' => 'pindah icu',           'category' => 'evaluasi', 'target_field' => 'evaluation_plan',   'priority' => 10],
            ['keyword' => 'transfer icu',         'category' => 'evaluasi', 'target_field' => 'evaluation_plan',   'priority' => 10],
            ['keyword' => 'rencana pindah',       'category' => 'evaluasi', 'target_field' => 'evaluation_plan',   'priority' => 10],

            // ── PENGKAJIAN TTV (priority 20) ─────────────────────────
            ['keyword' => 'tensi',                'category' => 'pengkajian', 'target_field' => 'ttv_td',    'priority' => 20],
            ['keyword' => 'tekanan darah',        'category' => 'pengkajian', 'target_field' => 'ttv_td',    'priority' => 20],
            ['keyword' => 'nadi',                 'category' => 'pengkajian', 'target_field' => 'ttv_nadi',  'priority' => 20],
            ['keyword' => 'heart rate',           'category' => 'pengkajian', 'target_field' => 'ttv_nadi',  'priority' => 20],
            ['keyword' => 'laju jantung',         'category' => 'pengkajian', 'target_field' => 'ttv_nadi',  'priority' => 20],
            ['keyword' => 'respirasi',            'category' => 'pengkajian', 'target_field' => 'ttv_rr',    'priority' => 20],
            ['keyword' => 'respiratory rate',     'category' => 'pengkajian', 'target_field' => 'ttv_rr',    'priority' => 20],
            ['keyword' => 'laju napas',           'category' => 'pengkajian', 'target_field' => 'ttv_rr',    'priority' => 20],
            ['keyword' => ' rr ',                 'category' => 'pengkajian', 'target_field' => 'ttv_rr',    'priority' => 20, 'notes' => 'Spasi agar tidak match "CPR"'],
            ['keyword' => 'saturasi',             'category' => 'pengkajian', 'target_field' => 'ttv_spo2',  'priority' => 20],
            ['keyword' => 'spo2',                 'category' => 'pengkajian', 'target_field' => 'ttv_spo2',  'priority' => 20],
            ['keyword' => 'sp o2',                'category' => 'pengkajian', 'target_field' => 'ttv_spo2',  'priority' => 20],
            ['keyword' => 'gcs',                  'category' => 'pengkajian', 'target_field' => 'ttv_gcs',   'priority' => 20],
            ['keyword' => 'kesadaran',            'category' => 'pengkajian', 'target_field' => 'ttv_gcs',   'priority' => 20],
            ['keyword' => 'glasgow',              'category' => 'pengkajian', 'target_field' => 'ttv_gcs',   'priority' => 20],
            ['keyword' => 'ditemukan',            'category' => 'pengkajian', 'target_field' => 'assessment_condition', 'priority' => 20],
            ['keyword' => 'kondisi',              'category' => 'pengkajian', 'target_field' => 'assessment_condition', 'priority' => 20],
            ['keyword' => 'pupil',                'category' => 'pengkajian', 'target_field' => 'assessment_condition', 'priority' => 21],
            ['keyword' => 'suhu',                 'category' => 'pengkajian', 'target_field' => 'assessment_condition', 'priority' => 21],
            ['keyword' => 'temperatur',           'category' => 'pengkajian', 'target_field' => 'assessment_condition', 'priority' => 21],

            // ── TINDAKAN (priority 30, target_field = null) ───────────
            // Tidak perlu di-seed — fallback otomatis jika tidak ada rule yang cocok.
            // Tapi bisa ditambah jika ingin keyword spesifik dipaksa ke 'tindakan'

            // ── MAPPING KATEGORI EMR V-CODE (Modul 8) ──────────────────
            ['keyword' => 'cpr',                  'category' => 'Tindakan Resusitasi', 'target_field' => null, 'priority' => 30], //
            ['keyword' => 'vf',                   'category' => 'Irama Jantung',       'target_field' => null, 'priority' => 30], //
            ['keyword' => 'vt',                   'category' => 'Irama Jantung',       'target_field' => null, 'priority' => 30], //
            ['keyword' => 'asistol',              'category' => 'Irama Jantung',       'target_field' => null, 'priority' => 30], //
            ['keyword' => 'shock',                'category' => 'Defibrilasi',         'target_field' => null, 'priority' => 30], //
            ['keyword' => 'ett',                  'category' => 'Airway',              'target_field' => null, 'priority' => 30], //
            ['keyword' => 'intubasi',             'category' => 'Airway',              'target_field' => null, 'priority' => 30], //
            ['keyword' => 'bvm',                  'category' => 'Breathing',           'target_field' => null, 'priority' => 30], //
            ['keyword' => 'ventilasi',            'category' => 'Breathing',           'target_field' => null, 'priority' => 30], //
            ['keyword' => 'epinefrin',            'category' => 'Obat & Dosis',        'target_field' => null, 'priority' => 30], //
            ['keyword' => 'amiodaron',            'category' => 'Obat & Dosis',        'target_field' => null, 'priority' => 30], //
        ];

        foreach ($rules as $data) {
            ClassifyRule::updateOrCreate(
                ['keyword' => $data['keyword'], 'category' => $data['category'], 'target_field' => $data['target_field'] ?? null],
                array_merge($data, [
                    'match_mode' => 'contains',
                    'is_active' => true,
                    'notes' => $data['notes'] ?? null,
                ])
            );
        }

        $this->command->info('✅ VCodePhraseSeeder: '.MedicalPhrase::count().' phrases, '.WordCorrection::count().' corrections, '.ClassifyRule::count().' classify rules seeded.');
    }
}
