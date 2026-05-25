<?php

namespace App\Http\Controllers;

use App\Models\ClassifyRule;
use App\Models\CodeBlueSession;
use App\Models\MedicalPhrase;
use App\Models\Patient;
use App\Models\SessionLog;
use App\Models\SttDebugLog;
use App\Models\WordCorrection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CodeBlueController extends Controller
{
    // =========================================================
    // Halaman & navigasi
    // =========================================================

    public function index(Request $request)
    {
        $recentSessions = CodeBlueSession::with('patient')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', ['sessions' => $recentSessions]);
    }

    public function history(Request $request)
    {
        $query = CodeBlueSession::with('patient')->orderBy('created_at', 'desc');

        // 1. Filter Pencarian Nama Pasien
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%');
            });
        }

        // 2. Filter Jenis Kejadian
        if ($request->filled('incident_type')) {
            $query->where('incident_type', $request->incident_type);
        }

        // 3. Filter Status (Draft / Finalized)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // 4. Filter Waktu (Hari ini / Minggu ini)
        if ($request->filled('date_filter')) {
            if ($request->date_filter === 'today') {
                $query->whereDate('created_at', today());
            } elseif ($request->date_filter === 'this_week') {
                $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
            }
        }

        // 5. Filter Ada Audio
        if ($request->filled('has_audio') && $request->has_audio === 'true') {
            $query->whereNotNull('audio_path');
        }

        // (Opsional) Ambil daftar unik incident_type dari DB untuk dropdown seperti di Filament
        $incidentTypes = CodeBlueSession::distinct()->pluck('incident_type')->filter()->values();

        return Inertia::render('riwayat', [
            'sessions' => $query->get(), // Gunakan ->paginate(10) jika data sudah sangat banyak
            'incidentTypes' => $incidentTypes, // Kirim opsi dropdown ke React
            'filters' => $request->only(['search', 'incident_type', 'status', 'date_filter', 'has_audio']),
        ]);
    }

    public function setup()
    {
        return Inertia::render('record-setup');
    }

    public function startSession(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'rm_number' => 'required|string|max:50',
            'ward_location' => 'required|string|max:100',
            'leader_name' => 'required|string|max:255',
            'team_members' => 'required|string',
            'incident_type' => 'required|string',
        ]);

        $patient = Patient::create([
            'name' => $request->name,
            'rm_number' => $request->rm_number,
            'ward_location' => $request->ward_location,
        ]);

        return redirect()->route('record.create', [
            'patient' => $patient->id,
            'leader_name' => $request->leader_name,
            'team_members' => $request->team_members,
            'incident_type' => $request->incident_type,
        ]);
    }

    public function create(Patient $patient, Request $request)
    {
        return Inertia::render('record', [
            'patient' => $patient,
            'leader_name' => $request->query('leader_name'),
            'team_members' => $request->query('team_members'),
            'incident_type' => $request->query('incident_type'),
        ]);
    }

    public function storeDraft(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|integer',
            'duration_seconds' => 'required|integer',
            'logs' => 'array',
        ]);

        $audioPath = null;
        if ($request->hasFile('full_audio')) {
            $audioPath = $request->file('full_audio')->store('recordings', 'public');
        }

        $session = CodeBlueSession::create([
            'user_id' => $request->user()->id,
            'patient_id' => $request->patient_id,
            'leader_name' => $request->leader_name,
            'team_members' => $request->team_members,
            'incident_type' => $request->incident_type,
            'start_time' => now()->subSeconds($request->duration_seconds),
            'end_time' => now(),
            'duration_seconds' => $request->duration_seconds,
            'status' => 'draft',
            'assessment_condition' => $request->assessment_condition,
            'ttv_td' => $request->ttv_td,
            'ttv_nadi' => $request->ttv_nadi,
            'ttv_rr' => $request->ttv_rr,
            'ttv_spo2' => $request->ttv_spo2,
            'ttv_gcs' => $request->ttv_gcs,
            'evaluation_result' => $request->evaluation_result,
            'evaluation_plan' => $request->evaluation_plan,
            'audio_path' => $audioPath,
        ]);

        if ($request->filled('logs') && is_array($request->logs)) {
            foreach ($request->logs as $log) {
                SessionLog::create([
                    'session_id' => $session->id,
                    'time_mark' => $log['time_mark'],
                    'action_text' => $log['action_text'],
                    'category' => $log['category'] ?? 'tindakan',
                ]);
            }
        }

        SttDebugLog::where('patient_id', $request->patient_id)
            ->whereNull('session_id')
            ->update(['session_id' => $session->id]);

        return redirect()->route('record.summary', $session->id);
    }

    public function summary(CodeBlueSession $codeBlueSession)
    {
        $codeBlueSession->load(['user', 'logs']);

        return Inertia::render('record-summary', ['sessionData' => $codeBlueSession]);
    }

    public function edit(CodeBlueSession $codeBlueSession)
    {
        $codeBlueSession->load(['patient', 'logs', 'user']);

        return Inertia::render('review', ['sessionData' => $codeBlueSession]);
    }

    public function update(Request $request, CodeBlueSession $codeBlueSession)
    {
        $request->validate([
            'additional_notes' => 'nullable|string',
            'logs' => 'array',
            'assessment_condition' => 'nullable|string',
        ]);

        $codeBlueSession->update([
            'additional_notes' => $request->additional_notes,
            'assessment_condition' => $request->assessment_condition,
            'ttv_time' => $request->ttv_time,
            'ttv_td' => $request->ttv_td,
            'ttv_nadi' => $request->ttv_nadi,
            'ttv_rr' => $request->ttv_rr,
            'ttv_spo2' => $request->ttv_spo2,
            'ttv_gcs' => $request->ttv_gcs,
            'evaluation_result' => $request->evaluation_result,
            'evaluation_plan' => $request->evaluation_plan,
            'status' => 'finalized',
        ]);

        if ($request->has('logs')) {
            $remainingIds = collect($request->logs)->pluck('id')->filter()->toArray();

            SessionLog::where('session_id', $codeBlueSession->id)
                ->whereNotIn('id', $remainingIds)
                ->delete();

            foreach ($request->logs as $logData) {
                if (isset($logData['id'])) {
                    SessionLog::where('id', $logData['id'])->update([
                        'action_text' => $logData['action_text'],
                        'category' => $logData['category'] ?? 'tindakan',
                    ]);
                }
            }
        } else {
            SessionLog::where('session_id', $codeBlueSession->id)->delete();
        }

        return redirect()->route('dashboard')->with('success', 'Dokumentasi berhasil diintegrasikan ke EMR!');
    }

    // =========================================================
    // Endpoint: classify rules untuk frontend React
    // Dipanggil sekali saat halaman record dimuat.
    // Cache 10 menit, auto-bust via VCodeCacheBuster observer.
    // =========================================================

    public function classifyRules()
    {
        $rules = Cache::remember('vcode_classify_rules_api', 600, function () {
            return ClassifyRule::active()
                ->get(['keyword', 'match_mode', 'category', 'target_field', 'priority']);
        });

        return response()->json($rules);
    }

    // =========================================================
    // Transcribe — Google STT dengan word correction + dynamic classify
    // =========================================================

    public function transcribe(Request $request)
    {
        if (! $request->hasFile('audio')) {
            return response()->json(['text' => '']);
        }

        $audioFile = $request->file('audio');

        if ($audioFile->getSize() < 3_500) {
            return response()->json(['text' => '']);
        }

        try {
            $accessToken = $this->getGoogleAccessToken();

            if (! $accessToken) {
                Log::error('[STT] Gagal dapat access token');

                return response()->json(['error' => 'Auth failed'], 500);
            }

            $audio = file_get_contents($audioFile->getRealPath());
            $mimeType = $audioFile->getClientMimeType();

            $fileSizeBytes = $audioFile->getSize();

            [$encoding, $sampleRate] = $this->resolveEncoding($mimeType);

            $dynamicModel = $fileSizeBytes > 150000 ? 'latest_long' : 'latest_short';

            $payload = [
                'config' => [
                    'encoding' => $encoding,
                    'sampleRateHertz' => $sampleRate,
                    'languageCode' => 'id-ID',
                    'alternativeLanguageCodes' => ['id-ID'],
                    'enableAutomaticPunctuation' => true,
                    'model' => $dynamicModel,
                    'useEnhanced' => true,
                    'maxAlternatives' => 1,
                    'profanityFilter' => false,
                    'speechContexts' => [
                        [
                            'phrases' => $this->getMedicalPhrases(),
                            'boost' => 20,
                        ],
                    ],
                ],
                'audio' => [
                    'content' => base64_encode($audio),
                ],
            ];

            $response = Http::withToken($accessToken)
                ->timeout(20)
                ->retry(2, 500)
                ->post('https://speech.googleapis.com/v1/speech:recognize', $payload);

            if (! $response->successful()) {
                Log::error('[STT] Google error', [
                    'status' => $response->status(),
                    'body' => substr($response->body(), 0, 400),
                ]);

                return response()->json(['error' => 'STT '.$response->status()], 500);
            }

            $data = $response->json();

            // ── Ambil transcript mentah dari Google ──
            $rawTranscript = $this->joinResults($data);

            if (! $rawTranscript || mb_strlen($rawTranscript) < 2) {
                return response()->json(['text' => '']);
            }

            // ── [BARU] Koreksi kata salah sebelum normalize + classify ──
            $corrected = $this->applyWordCorrections($rawTranscript);

            // ── Normalize & classify ──
            $clean = $this->normalize($corrected);
            $classification = $this->classify($clean);

            // ── Confidence check ──
            $confidence = $data['results'][0]['alternatives'][0]['confidence'] ?? 0.0;

            Log::info('[STT] OK', [
                'raw' => $rawTranscript,
                'corrected' => $corrected,
                'clean' => $clean,
                'category' => $classification['category'],
                'field' => $classification['target_field'],
                'confidence' => $confidence,
                'size_kb' => round($audioFile->getSize() / 1024, 1),
            ]);

            return response()->json([
                'text' => $clean,
                'category' => $classification['category'],
                'target_field' => $classification['target_field'],
                'confidence' => (float) $confidence,
            ]);

        } catch (\Exception $e) {
            Log::error('[STT] Exception: '.$e->getMessage());

            return response()->json(['error' => 'Processing failed'], 500);
        }
    }

    // =========================================================
    // Helper: getMedicalPhrases — dynamic dari DB
    // =========================================================

    private function getMedicalPhrases(): array
    {
        return Cache::remember('vcode_medical_phrases', 600, function () {
            return MedicalPhrase::active()
                ->orderBy('category')
                ->orderBy('phrase')
                ->pluck('phrase')
                ->toArray();
        });
    }

    // =========================================================
    // Helper: applyWordCorrections — koreksi kata salah STT
    // =========================================================

    /**
     * Terapkan koreksi kata dari tabel word_corrections.
     * Dipanggil setelah joinResults(), sebelum normalize() + classify().
     * hit_count di-increment untuk setiap koreksi yang aktif terpicu.
     */
    private function applyWordCorrections(string $text): string
    {
        $corrections = Cache::remember('vcode_word_corrections', 600, function () {
            return WordCorrection::active()
                ->orderByRaw("FIELD(match_mode, 'exact', 'contains', 'regex')")
                ->get(['id', 'wrong_text', 'correct_text', 'match_mode'])
                ->toArray();
        });

        $corrected = $text;
        $hitIds = [];

        foreach ($corrections as $c) {
            $wrong = $c['wrong_text'];
            $correct = $c['correct_text'];

            switch ($c['match_mode']) {
                case 'exact':
                    if (mb_strtolower($corrected) === mb_strtolower($wrong)) {
                        $corrected = $correct;
                        $hitIds[] = $c['id'];
                    }
                    break;

                case 'regex':
                    $new = @preg_replace('/'.$wrong.'/iu', $correct, $corrected);
                    if ($new !== null && $new !== $corrected) {
                        $corrected = $new;
                        $hitIds[] = $c['id'];
                    }
                    break;

                default: // 'contains' — case-insensitive
                    $new = preg_replace('/'.preg_quote($wrong, '/').'/iu', $correct, $corrected);
                    if ($new !== $corrected) {
                        $corrected = $new;
                        $hitIds[] = $c['id'];
                    }
                    break;
            }
        }

        if (! empty($hitIds)) {
            WordCorrection::whereIn('id', $hitIds)->increment('hit_count');
            Cache::forget('vcode_word_corrections');
        }

        return $corrected;
    }

    // =========================================================
    // Helper: classify — dynamic dari DB classify_rules
    // =========================================================

    private function classify(string $text): array
    {
        $lower = mb_strtolower($text);

        $rules = Cache::remember('vcode_classify_rules', 600, function () {
            return ClassifyRule::active()
                ->get(['keyword', 'match_mode', 'category', 'target_field', 'priority'])
                ->toArray();
        });

        foreach ($rules as $rule) {
            $kw = mb_strtolower($rule['keyword']);
            $matched = match ($rule['match_mode']) {
                'exact' => $lower === $kw,
                'starts_with' => str_starts_with($lower, $kw),
                'regex' => (bool) @preg_match('/'.$kw.'/u', $lower),
                default => str_contains($lower, $kw), // 'contains'
            };

            if ($matched) {
                return [
                    'category' => $rule['category'],
                    'target_field' => $rule['target_field'],
                ];
            }
        }

        return ['category' => 'tindakan', 'target_field' => null];
    }

    // =========================================================
    // Helper: encoding dari MIME type
    // =========================================================

    private function resolveEncoding(string $mime): array
    {
        if (str_contains($mime, 'webm')) {
            return ['WEBM_OPUS', 48000];
        }
        if (str_contains($mime, 'ogg')) {
            return ['OGG_OPUS', 48000];
        }

        return ['LINEAR16', 16000];
    }

    // =========================================================
    // Helper: gabungkan semua result Google STT
    // =========================================================

    private function joinResults(array $data): string
    {
        if (empty($data['results'])) {
            return '';
        }

        return implode(' ', array_filter(
            array_map(fn ($r) => trim($r['alternatives'][0]['transcript'] ?? ''), $data['results'])
        ));
    }

    // =========================================================
    // Helper: normalisasi teks
    // =========================================================

    private function normalize(string $text): string
    {
        $text = trim(preg_replace('/\s+/', ' ', $text));
        if (! $text) {
            return '';
        }

        $numbers = [
            '/\bnol\b/i' => '0',
            '/\bsatu\b/i' => '1',
            '/\bdua\b/i' => '2',
            '/\btiga\b/i' => '3',
            '/\bempat\b/i' => '4',
            '/\blima\b/i' => '5',
            '/\benam\b/i' => '6',
            '/\btujuh\b/i' => '7',
            '/\bdelapan\b/i' => '8',
            '/\bsembilan\b/i' => '9',
            '/\bpuluh\b/i' => '0',
            '/\bratus\b/i' => '00',
        ];
        foreach ($numbers as $p => $r) {
            $text = preg_replace($p, $r, $text);
        }

        $acronyms = [
            '/\bcpr\b/i' => 'CPR',
            '/\brjp\b/i' => 'RJP',
            '/\brosc\b/i' => 'ROSC',
            '/\bvf\b/i' => 'VF',
            '/\bvt\b/i' => 'VT',
            '/\bpea\b/i' => 'PEA',
            '/\bicu\b/i' => 'ICU',
            '/\baed\b/i' => 'AED',
            '/\bgcs\b/i' => 'GCS',
            '/\bett\b/i' => 'ETT',
            '/\blma\b/i' => 'LMA',
            '/\bspo2\b/i' => 'SpO2',
            '/\bspo 2\b/i' => 'SpO2',
            '/\brr\b/i' => 'RR',
            '/\bbvm\b/i' => 'BVM',
            '/\bnacl\b/i' => 'NaCl',
            '/\bsvt\b/i' => 'SVT',
        ];
        foreach ($acronyms as $p => $r) {
            $text = preg_replace($p, $r, $text);
        }

        return ucfirst($text);
    }

    // =========================================================
    // Helper: base64url encode untuk JWT
    // =========================================================

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    // =========================================================
    // Helper: Google Access Token dengan cache 55 menit
    // =========================================================

    private function getGoogleAccessToken(): ?string
    {
        $key = 'gcp_stt_token_v3';
        $cached = Cache::get($key);

        if ($cached) {
            return $cached;
        }

        $token = $this->fetchToken();

        if ($token) {
            Cache::put($key, $token, now()->addMinutes(55));
        }

        return $token;
    }

    private function fetchToken(): ?string
    {
        $keyPath = storage_path('app/gcp-stt-key.json');

        if (! file_exists($keyPath)) {
            Log::error('[STT] Key file tidak ada: '.$keyPath);

            return null;
        }

        $key = json_decode(file_get_contents($keyPath), true);

        if (! $key || ($key['type'] ?? '') !== 'service_account') {
            Log::error('[STT] Key file tidak valid');

            return null;
        }

        if (empty($key['client_email']) || empty($key['private_key'])) {
            Log::error('[STT] client_email / private_key kosong');

            return null;
        }

        $now = time();
        $header = $this->base64UrlEncode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
        $claims = $this->base64UrlEncode(json_encode([
            'iss' => $key['client_email'],
            'scope' => 'https://www.googleapis.com/auth/cloud-platform',
            'aud' => 'https://oauth2.googleapis.com/token',
            'iat' => $now,
            'exp' => $now + 3600,
        ]));

        $unsigned = $header.'.'.$claims;
        $sig = '';

        if (! openssl_sign($unsigned, $sig, $key['private_key'], OPENSSL_ALGO_SHA256)) {
            Log::error('[STT] openssl_sign gagal');

            return null;
        }

        $jwt = $unsigned.'.'.$this->base64UrlEncode($sig);

        try {
            $resp = Http::asForm()->timeout(10)->post('https://oauth2.googleapis.com/token', [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => $jwt,
            ]);

            if ($resp->successful()) {
                return $resp->json('access_token') ?: null;
            }

            Log::error('[STT] Token exchange gagal', [
                'status' => $resp->status(),
                'body' => substr($resp->body(), 0, 300),
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('[STT] Token exception: '.$e->getMessage());

            return null;
        }
    }

    // =========================================================
    // Debug log endpoints
    // =========================================================

    public function storeDebugLog(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|integer',
            'time_mark' => 'required|string',
            'type' => 'required|string',
            'message' => 'required|string',
        ]);

        SttDebugLog::create([
            'patient_id' => $request->patient_id,
            'time_mark' => $request->time_mark,
            'type' => $request->type,
            'message' => $request->message,
        ]);

        return response()->json(['status' => 'success']);
    }

    public function getDebugLogs($sessionId)
    {
        $logs = SttDebugLog::where('session_id', $sessionId)
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($logs);
    }
}
