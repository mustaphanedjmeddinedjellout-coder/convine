<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CustomerProvisioner
{
    /**
     * @return array{user: User, wedding: Wedding, password: string}
     */
    public function create(User $admin, array $data): array
    {
        $password = Str::password(12);

        return DB::transaction(function () use ($admin, $data, $password) {
            $emailLocal = $data['email_local'] ?? 'customer-'.User::query()->where('role', UserRole::Customer)->count() + 1;
            $email = strtolower($emailLocal).'@'.config('convive.customer_email_domain');

            $customer = User::query()->create([
                'name' => $data['name'],
                'email' => $email,
                'password' => $password,
                'role' => UserRole::Customer,
            ]);

            $wedding = Wedding::query()->create([
                'user_id' => $customer->id,
                'created_by' => $admin->id,
                'title' => $data['title'],
                'template_slug' => $data['template_slug'] ?? 'velvet',
                'status' => 'draft',
            ]);

            return [
                'user' => $customer,
                'wedding' => $wedding,
                'password' => $password,
            ];
        });
    }
}
