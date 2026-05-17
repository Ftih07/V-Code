<?php

namespace App\Http\Controllers;

use App\Models\CodeBlueSession;
use App\Models\Patient;
use App\Models\SessionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CodeBlueController extends Controller
{
    public function index(Request $request)
    {
        $sessions = CodeBlueSession::with('patient')
            // ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('dashboard', [
            'sessions' => $sessions,
        ]);
    }

    /**
     * Tampilkan Form Input Identitas Pasien sebelum merekam
     */
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
            'team_members' => 'required|string|max:255',
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
        ]);
    }

    // Tangkap data tim di halaman form rekam
    public function create(Patient $patient, Request $request)
    {
        return Inertia::render('record', [
            'patient' => $patient,
            'leader_name' => $request->query('leader_name'),
            'team_members' => $request->query('team_members'),
        ]);
    }

    // Update simpan draf agar menyimpan data tim, dan alihkan ke Halaman Summary
    public function storeDraft(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|integer',
            'duration_seconds' => 'required|integer',
            'logs' => 'array',
        ]);

        $session = CodeBlueSession::create([
            'user_id' => $request->user()->id,
            'patient_id' => $request->patient_id,
            'leader_name' => $request->leader_name,
            'team_members' => $request->team_members,
            'start_time' => now()->subSeconds($request->duration_seconds),
            'end_time' => now(),
            'duration_seconds' => $request->duration_seconds,
            'status' => 'draft',
        ]);

        if ($request->has('logs') && is_array($request->logs)) {
            foreach ($request->logs as $log) {
                SessionLog::create([
                    'session_id' => $session->id,
                    'time_mark' => $log['time_mark'],
                    'action_text' => $log['action_text'],
                ]);
            }
        }

        return redirect()->route('record.summary', $session->id);
    }

    // Buat fungsi baru untuk menampilkan Halaman Summary (Layar 3)
    public function summary(CodeBlueSession $codeBlueSession)
    {
        $codeBlueSession->load(['user', 'logs']);

        return Inertia::render('record-summary', [
            'sessionData' => $codeBlueSession,
        ]);
    }

    /**
     * Tampilkan halaman Review (Versi Desktop EMR)
     */
    public function edit(CodeBlueSession $codeBlueSession)
    {
        // if ((int) $codeBlueSession->user_id !== (int) request()->user()->id) {
        //     abort(403, 'Anda tidak memiliki akses ke draf ini.');
        // }

        $codeBlueSession->load(['patient', 'logs', 'user']);

        return Inertia::render('review', ['sessionData' => $codeBlueSession]);
    }

    /**
     * Simpan Catatan Tambahan dan ubah status jadi "Final"
     */
    public function update(Request $request, CodeBlueSession $codeBlueSession)
    {
        // if ((int) $codeBlueSession->user_id !== (int) $request->user()->id) {
        //     abort(403, 'Anda tidak memiliki akses ke draf ini.');
        // }

        $request->validate([
            'additional_notes' => 'nullable|string',
            'logs' => 'array',
        ]);

        $codeBlueSession->update([
            'additional_notes' => $request->additional_notes,
            'status' => 'finalized',
        ]);

        if ($request->has('logs')) {
            $remainingLogIds = collect($request->logs)->pluck('id')->filter()->toArray();

            SessionLog::where('session_id', $codeBlueSession->id)
                ->whereNotIn('id', $remainingLogIds)
                ->delete();

            foreach ($request->logs as $logData) {
                if (isset($logData['id'])) {
                    SessionLog::where('id', $logData['id'])->update([
                        'action_text' => $logData['action_text'],
                    ]);
                }
            }
        } else {
            SessionLog::where('session_id', $codeBlueSession->id)->delete();
        }

        return redirect()->route('dashboard')->with('success', 'Dokumentasi berhasil diintegrasikan ke EMR!');
    }
}
