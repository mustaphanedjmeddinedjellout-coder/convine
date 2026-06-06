<?php

namespace App\Http\Controllers;

use App\Models\Wedding;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeddingController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $wedding = $this->resolveWedding($request);

        $this->authorize('view', $wedding);

        $wedding->load('guests');

        return response()->json([
            'wedding' => $this->formatWedding($wedding),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $wedding = $this->resolveWedding($request);

        $this->authorize('update', $wedding);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'bride_name' => ['nullable', 'string', 'max:255'],
            'groom_name' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date'],
            'event_time' => ['nullable', 'string', 'max:20'],
            'venue' => ['nullable', 'string', 'max:255'],
            'venue_address' => ['nullable', 'string', 'max:500'],
            'message' => ['nullable', 'string', 'max:5000'],
            'photos' => ['nullable', 'array', 'max:6'],
            'photos.*' => ['nullable', 'string', 'max:2000'],
            'status' => ['sometimes', 'string', 'in:draft,ready,sent'],
        ]);

        $wedding->update($data);

        return response()->json([
            'wedding' => $this->formatWedding($wedding->fresh('guests')),
        ]);
    }

    private function resolveWedding(Request $request): Wedding
    {
        $user = $request->user();

        if ($user->isAdmin() && $request->filled('wedding_id')) {
            return Wedding::query()->findOrFail($request->integer('wedding_id'));
        }

        $wedding = $user->wedding;

        if (! $wedding) {
            abort(404, 'No wedding found for this account.');
        }

        return $wedding;
    }

    private function formatWedding(Wedding $wedding): array
    {
        return [
            'id' => $wedding->id,
            'title' => $wedding->title,
            'slug' => $wedding->slug,
            'bride_name' => $wedding->bride_name,
            'groom_name' => $wedding->groom_name,
            'event_date' => $wedding->event_date?->toDateString(),
            'event_time' => $wedding->event_time,
            'venue' => $wedding->venue,
            'venue_address' => $wedding->venue_address,
            'template_slug' => $wedding->template_slug,
            'message' => $wedding->message,
            'photos' => $wedding->photos ?? [],
            'status' => $wedding->status,
            'guests' => $wedding->guests->map(fn ($guest) => [
                'id' => $guest->id,
                'name' => $guest->name,
                'sort_order' => $guest->sort_order,
                'token' => $guest->token,
                'rsvp_status' => $guest->rsvp_status,
                'invite_url' => $guest->token ? '/invite/'.$guest->token : null,
            ])->values(),
        ];
    }
}
