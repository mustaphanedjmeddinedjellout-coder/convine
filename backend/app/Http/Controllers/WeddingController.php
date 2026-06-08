<?php

namespace App\Http\Controllers;

use App\Models\Wedding;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'google_maps_url' => ['nullable', 'url', 'max:2000'],
            'message' => ['nullable', 'string', 'max:5000'],
            'photos' => ['nullable', 'array', 'max:6'],
            'status' => ['sometimes', 'string', 'in:draft,ready,sent'],
        ]);

        $wedding->update([
            ...$data,
            'photos' => $this->resolvePhotos($request),
        ]);

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
            'google_maps_url' => $wedding->google_maps_url,
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
            'accepted_count' => $wedding->guests->where('rsvp_status', 'attending')->count(),
            'refused_count' => $wedding->guests->where('rsvp_status', 'declined')->count(),
            'pending_count' => $wedding->guests->whereNull('rsvp_status')->count(),
            'invitations' => $wedding->guests->map(fn ($guest) => [
                'id' => $guest->id,
                'name' => $guest->name,
                'token' => $guest->token,
                'invite_url' => $guest->token ? '/invite/'.$guest->token : null,
                'status' => $guest->rsvp_status ? ($guest->rsvp_status === 'attending' ? 'accepted' : ($guest->rsvp_status === 'declined' ? 'refused' : $guest->rsvp_status)) : 'pending',
                'raw_status' => $guest->rsvp_status,
            ])->values(),
        ];
    }

    private function resolvePhotos(Request $request): array
    {
        $existingPhotos = collect($request->input('photos', []))
            ->filter(fn ($photo) => is_string($photo) && trim($photo) !== '')
            ->values()
            ->all();

        $uploadedPhotos = collect($request->file('photos', []))
            ->filter()
            ->map(function ($photo) {
                $path = $photo->storePublicly('weddings/photos', 'public');

                return Storage::disk('public')->url($path);
            })
            ->values()
            ->all();

        return array_slice(array_values(array_filter(array_merge($existingPhotos, $uploadedPhotos))), 0, 6);
    }
}
