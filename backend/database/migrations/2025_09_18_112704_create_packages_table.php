<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->string('code');
            $table->string('courier'); // CDD/Transportadora (ex: Correios)
            $table->dateTime('received_at');
            $table->enum('postal_type', ['simples', 'registrada'])->default('simples');
            $table->enum('volume_type', ['caixa', 'envelope', 'pacote', 'sedex']);
            $table->text('observations')->nullable();
            $table->enum('status', ['pending', 'collected', 'returned', 'deleted'])->default('pending');

            // Campos para retirada
            $table->dateTime('collected_at')->nullable();
            $table->string('collector_name')->nullable();
            $table->string('collector_cpf')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('signature_path')->nullable();

            // Soft delete
            $table->softDeletes();
            $table->timestamps();

            // Índices
            $table->index(['store_id', 'status']);
            $table->index('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
