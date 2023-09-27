<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Postcode;
use App\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('organisations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('org_id')->unique();
            $table->string('status');
            $table->string('org_record_class');
            $table->string('post_code');
            $table->foreignIdFor(Postcode::class, 'postcode_id')->nullable()->constrained('postcodes');
            $table->date('last_change_date');
            $table->foreignIdFor(Role::class, 'primary_role_id')->constrained('roles');
            $table->text('org_link');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organisations');
    }
};
