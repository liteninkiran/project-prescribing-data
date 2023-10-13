<?php

// Illuminate
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Models
use App\Models\Country;

return new class extends Migration
{
    private $foreignKeyName = 'fk_country_eer';
    private $foreignId = 'country_id';
    private $foreignTable = 'countries';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('european_electoral_regions', function (Blueprint $table) {
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
        Schema::table('european_electoral_regions', function (Blueprint $table) {
            $table->dropForeign($this->foreignKeyName);
            $table->dropColumn($this->foreignId);
        });
    }
};
