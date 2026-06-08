<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Wedding;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeddingController extends Controller
{
    public function index(): JsonResponse
    {
        $weddings = Wedding::query()
            ->with(['owner:id,name,email', 'guests'])
            ->latest()
            ->get()
            ->map(fn (Wedding $wedding) => $this->formatWedding($wedding));

        $summary = [
            'accepted' => $weddings->sum('accepted_count'),
            'refused' => $weddings->sum('refused_count'),
            'pending' => $weddings->sum('pending_count'),
        ];

        return response()->json([
            'summary' => $summary,
            'weddings' => $weddings,
        ]);
    }

    private function formatWedding(Wedding $wedding): array
    {
        $acceptedCount = $wedding->guests->where('rsvp_status', 'attending')->count();
        $refusedCount = $wedding->guests->where('rsvp_status', 'declined')->count();
        $pendingCount = $wedding->guests->whereNull('rsvp_status')->count();

        return [
            'id' => $wedding->id,
            'title' => $wedding->title,
            'bride_name' => $wedding->bride_name,
            'groom_name' => $wedding->groom_name,
            'event_date' => $wedding->event_date?->toDateString(),
            'venue' => $wedding->venue,
            'template_slug' => $wedding->template_slug,
            'message' => $wedding->message,
            'status' => $wedding->status,
            'guest_count' => $wedding->guests->count(),
            'accepted_count' => $acceptedCount,
            'refused_count' => $refusedCount,
            'pending_count' => $pendingCount,
            'invitations' => $wedding->guests->map(fn ($guest) => [
                'id' => $guest->id,
                'name' => $guest->name,
                'token' => $guest->token,
                'invite_url' => $guest->token ? '/invite/'.$guest->token : null,
                'status' => $this->statusLabel($guest->rsvp_status),
                'raw_status' => $guest->rsvp_status,
            ])->values(),
            'owner' => [
                'id' => $wedding->owner->id,
                'name' => $wedding->owner->name,
                'email' => $wedding->owner->email,
            ],
        ];
    }

    private function statusLabel(?string $status): string
    {
        return match ($status) {
            'attending' => 'accepted',
            'declined' => 'refused',
            default => 'pending',
        };
    }
}
