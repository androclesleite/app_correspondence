<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\PackageLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PackageController extends Controller
{
    public function index(Request $request)
    {
        $query = Package::with(['store.shopping', 'logs.user']);

        // Filtrar por loja se usuário é do tipo loja
        if ($request->user()->isLoja() && $request->user()->store_id) {
            $query->where('store_id', $request->user()->store_id);
        }

        // Filtros opcionais
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('store_id') && !$request->user()->isLoja()) {
            $query->where('store_id', $request->store_id);
        }

        $packages = $query->orderBy('received_at', 'desc')->paginate(20);

        return response()->json($packages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'code' => 'required|string|max:255',
            'courier' => 'required|string|max:255',
            'received_at' => 'required|date',
            'postal_type' => 'required|in:simples,registrada',
            'volume_type' => 'required|in:caixa,envelope,pacote,sedex',
            'observations' => 'nullable|string',
        ]);

        $package = Package::create($request->all());

        // Criar log
        PackageLog::create([
            'package_id' => $package->id,
            'user_id' => $request->user()->id,
            'action' => 'created',
            'details' => 'Encomenda cadastrada na portaria',
        ]);

        return response()->json($package->load('store.shopping'), 201);
    }

    public function show(Package $package)
    {
        return response()->json($package->load(['store.shopping', 'logs.user']));
    }

    public function collect(Request $request, Package $package)
    {
        $request->validate([
            'collector_name' => 'required|string|max:255',
            'collector_cpf' => 'required|string|size:11',
            'photo' => 'required|image|max:2048',
            'signature' => 'required|string', // Base64 da assinatura
        ]);

        // Salvar foto
        $photoPath = $request->file('photo')->store('packages/photos', 'public');

        // Salvar assinatura (base64 para arquivo)
        $signatureData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->signature));
        $signaturePath = 'packages/signatures/' . uniqid() . '.png';
        Storage::disk('public')->put($signaturePath, $signatureData);

        // Atualizar package
        $package->update([
            'status' => 'collected',
            'collected_at' => now(),
            'collector_name' => $request->collector_name,
            'collector_cpf' => $request->collector_cpf,
            'photo_path' => $photoPath,
            'signature_path' => $signaturePath,
        ]);

        // Criar log
        PackageLog::create([
            'package_id' => $package->id,
            'user_id' => $request->user()->id,
            'action' => 'collected',
            'details' => "Retirada por: {$request->collector_name} (CPF: {$request->collector_cpf})",
        ]);

        return response()->json($package->load('store.shopping'));
    }

    public function markAsReturned(Package $package, Request $request)
    {
        $package->update(['status' => 'returned']);

        // Criar log
        PackageLog::create([
            'package_id' => $package->id,
            'user_id' => $request->user()->id,
            'action' => 'returned',
            'details' => 'Encomenda devolvida ao remetente',
        ]);

        return response()->json($package);
    }

    public function destroy(Package $package, Request $request)
    {
        if (!$request->user()->canDeletePackages()) {
            return response()->json(['message' => 'Não autorizado'], 403);
        }

        $package->update(['status' => 'deleted']);
        $package->delete(); // Soft delete

        // Criar log
        PackageLog::create([
            'package_id' => $package->id,
            'user_id' => $request->user()->id,
            'action' => 'deleted',
            'details' => 'Encomenda excluída pelo administrador',
        ]);

        return response()->json(['message' => 'Encomenda excluída com sucesso']);
    }
}
