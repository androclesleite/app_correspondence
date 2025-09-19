<?php

namespace Database\Seeders;

use App\Models\Shopping;
use App\Models\Store;
use App\Models\User;
use App\Models\Package;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CorrespondenceSeeder extends Seeder
{
    public function run(): void
    {
        // Criar Shopping
        $shopping = Shopping::create([
            'name' => 'Plaza Shopping Center',
            'address' => 'Av. Paulista, 1000 - Bela Vista - São Paulo/SP',
        ]);

        // Criar Lojas
        $stores = [
            ['name' => 'Fashion Store', 'shopping_id' => $shopping->id],
            ['name' => 'Electronics World', 'shopping_id' => $shopping->id],
            ['name' => 'Beauty & Fragrance', 'shopping_id' => $shopping->id],
            ['name' => 'Sports Center', 'shopping_id' => $shopping->id],
            ['name' => 'Books & More', 'shopping_id' => $shopping->id],
        ];

        foreach ($stores as $storeData) {
            Store::create($storeData);
        }

        $fashionStore = Store::where('name', 'Fashion Store')->first();
        $electronicsStore = Store::where('name', 'Electronics World')->first();
        $beautyStore = Store::where('name', 'Beauty & Fragrance')->first();
        $sportsStore = Store::where('name', 'Sports Center')->first();

        // Criar Usuários
        $superAdminUser = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@plaza.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'store_id' => null,
        ]);

        $adminUser = User::create([
            'name' => 'Mall Manager',
            'email' => 'manager@plaza.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'store_id' => null,
        ]);

        $receptionistUser = User::create([
            'name' => 'Reception Desk',
            'email' => 'reception@plaza.com',
            'password' => Hash::make('password'),
            'role' => 'portaria',
            'store_id' => null,
        ]);

        $fashionUser = User::create([
            'name' => 'Fashion Store Manager',
            'email' => 'fashion@plaza.com',
            'password' => Hash::make('password'),
            'role' => 'loja',
            'store_id' => $fashionStore->id,
        ]);

        $electronicsUser = User::create([
            'name' => 'Electronics Store Manager',
            'email' => 'electronics@plaza.com',
            'password' => Hash::make('password'),
            'role' => 'loja',
            'store_id' => $electronicsStore->id,
        ]);

        $beautyUser = User::create([
            'name' => 'Beauty Store Manager',
            'email' => 'beauty@plaza.com',
            'password' => Hash::make('password'),
            'role' => 'loja',
            'store_id' => $beautyStore->id,
        ]);

        // Criar Encomendas de exemplo
        $packages = [
            [
                'store_id' => $fashionStore->id,
                'code' => 'BR123456789',
                'courier' => 'FedEx',
                'received_at' => now()->subDays(2),
                'postal_type' => 'registrada',
                'volume_type' => 'caixa',
                'observations' => 'Blue box, fragile items',
                'status' => 'pending',
            ],
            [
                'store_id' => $fashionStore->id,
                'code' => 'SP987654321',
                'courier' => 'DHL Express',
                'received_at' => now()->subDay(),
                'postal_type' => 'simples',
                'volume_type' => 'envelope',
                'observations' => 'Urgent delivery',
                'status' => 'pending',
            ],
            [
                'store_id' => $electronicsStore->id,
                'code' => 'RJ555666777',
                'courier' => 'UPS',
                'received_at' => now()->subDays(5),
                'postal_type' => 'registrada',
                'volume_type' => 'pacote',
                'observations' => 'Electronics equipment',
                'status' => 'collected',
                'collected_at' => now()->subDays(3),
                'collector_name' => 'Maria Santos',
                'collector_cpf' => '12345678901',
            ],
            [
                'store_id' => $beautyStore->id,
                'code' => 'MG111222333',
                'courier' => 'Correios',
                'received_at' => now()->subDays(1),
                'postal_type' => 'registrada',
                'volume_type' => 'caixa',
                'observations' => 'Cosmetics - handle with care',
                'status' => 'pending',
            ],
            [
                'store_id' => $electronicsStore->id,
                'code' => 'RS444555666',
                'courier' => 'TNT',
                'received_at' => now()->subDays(3),
                'postal_type' => 'simples',
                'volume_type' => 'envelope',
                'observations' => null,
                'status' => 'returned',
            ],
        ];

        foreach ($packages as $packageData) {
            Package::create($packageData);
        }

        $this->command->info('Test data created successfully!');
        $this->command->info('');
        $this->command->info('Users created:');
        $this->command->info('System Admin: admin@plaza.com / password');
        $this->command->info('Mall Manager: manager@plaza.com / password');
        $this->command->info('Reception: reception@plaza.com / password');
        $this->command->info('Fashion Store: fashion@plaza.com / password');
        $this->command->info('Electronics Store: electronics@plaza.com / password');
        $this->command->info('Beauty Store: beauty@plaza.com / password');
    }
}
