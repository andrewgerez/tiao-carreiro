<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('music', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('youtube_url');
            $table->string('youtube_id');
            $table->bigInteger('views')->default(0);
            $table->string('duration')->nullable();
            $table->text('thumbnail')->nullable();
            $table->enum('status', ['approved', 'pending', 'rejected'])->default('pending');
            $table->timestamps();
            
            $table->index('status');
            $table->index(['status', 'views']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('music');
    }
};
