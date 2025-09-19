<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index()
    {
        $stores = Store::with('shopping')->orderBy('name')->get();

        return response()->json($stores);
    }

    public function show(Store $store)
    {
        return response()->json($store->load(['shopping', 'packages' => function($query) {
            $query->orderBy('received_at', 'desc')->limit(10);
        }]));
    }
}
