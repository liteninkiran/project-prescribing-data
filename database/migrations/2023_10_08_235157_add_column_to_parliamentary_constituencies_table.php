<?php

// Illuminate
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Models
use App\Models\EuropeanElectoralRegion;

return new class extends Migration
{
    private $foreignKeyName = 'fk_eer_pc';
    private $foreignId = 'european_electoral_region_id';
    private $foreignTable = 'european_electoral_regions';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('parliamentary_constituencies', function (Blueprint $table) {
            $table
                ->foreignId($this->foreignId)
                ->nullable()
                ->after('name')
                ->constrained($this->foreignTable, 'id', $this->foreignKeyName);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('parliamentary_constituencies', function (Blueprint $table) {
            $table->dropForeign($this->foreignKeyName);
            $table->dropColumn($this->foreignId);
        });
    }
};
