<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    public function show(string $token): JsonResponse
    {
        $guest = Guest::query()
            ->where('token', $token)
            ->with('wedding')
            ->firstOrFail();

        $wedding = $guest->wedding;

        return response()->json([
            'guest' => [
                'name' => $guest->name,
                'rsvp_status' => $guest->rsvp_status,
            ],
            'wedding' => [
                'template_slug' => $wedding->template_slug,
                'bride_name' => $wedding->bride_name,
                'groom_name' => $wedding->groom_name,
                'event_date' => $wedding->event_date?->toDateString(),
                'event_time' => $wedding->event_time,
                'venue' => $wedding->venue,
                'venue_address' => $wedding->venue_address,
                'google_maps_url' => $wedding->google_maps_url,
                'message' => $wedding->message,
                'photos' => $wedding->photos ?? [],
            ],
        ]);
    }

    public function rsvp(Request $request, string $token): JsonResponse
    {
        $guest = Guest::query()
            ->where('token', $token)
            ->firstOrFail();

        $data = $request->validate([
            'status' => ['required', 'string', 'in:attending,declined'],
        ]);

        $guest->update(['rsvp_status' => $data['status']]);

        return response()->json([
            'guest' => [
                'name' => $guest->name,
                'rsvp_status' => $guest->rsvp_status,
            ],
        ]);
    }
}
