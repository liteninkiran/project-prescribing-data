<?php

// Illuminate
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Models
Use App\Models\AdminCounty;
Use App\Models\AdminDistrict;
Use App\Models\EuropeanElectoralRegion;
Use App\Models\HealthAuthority;
Use App\Models\Nuts;
Use App\Models\ParliamentaryConstituency;
Use App\Models\PoliceForceArea;
Use App\Models\PrimaryCareTrust;
Use App\Models\Region;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('postcodes', function (Blueprint $table) {
            $table->id();
            $table->string ('postcode'                       )->unique();
            $table->string ('incode'                         )->default('');
            $table->string ('outcode'                        )->default('');
            $table->string ('country'                        )->default('');
            $table->integer('quality'                        )->default(0);
            $table->string ('admin_county'                   )->nullable();
            $table->string ('admin_county_code'              )->nullable();
            $table->string ('admin_district'                 )->nullable();
            $table->string ('admin_district_code'            )->nullable();
            $table->string ('admin_ward'                     )->nullable();
            $table->string ('admin_ward_code'                )->nullable();
            $table->string ('ccg'                            )->nullable();
            $table->string ('ccg_code'                       )->nullable();
            $table->string ('ccg_id_code'                    )->nullable();
            $table->string ('ced'                            )->nullable();
            $table->string ('ced_code'                       )->nullable();
            $table->string ('date_of_introduction'           )->nullable();
            $table->integer('eastings'                       )->nullable();
            $table->string ('european_electoral_region'      )->nullable();
            $table->double ('latitude', 9, 6                 )->nullable();
            $table->string ('lau2_code'                      )->nullable();
            $table->double ('longitude', 9, 6                )->nullable();
            $table->string ('lsoa'                           )->nullable();
            $table->string ('lsoa_code'                      )->nullable();
            $table->string ('msoa'                           )->nullable();
            $table->string ('msoa_code'                      )->nullable();
            $table->string ('nhs_ha'                         )->nullable();
            $table->integer('northings'                      )->nullable();
            $table->string ('nuts'                           )->nullable();
            $table->string ('nuts_code'                      )->nullable();
            $table->string ('parish'                         )->nullable();
            $table->string ('parish_code'                    )->nullable();
            $table->string ('parliamentary_constituency'     )->nullable();
            $table->string ('parliamentary_constituency_code')->nullable();
            $table->string ('pfa'                            )->nullable();
            $table->string ('pfa_code'                       )->nullable();
            $table->string ('primary_care_trust'             )->nullable();
            $table->string ('region'                         )->nullable();

            $table->foreignIdFor(AdminCounty::class                 , 'admin_county_id'                 )->nullable()->constrained('admin_counties');
            $table->foreignIdFor(AdminDistrict::class               , 'admin_district_id'               )->nullable()->constrained('admin_districts');
            $table->foreignIdFor(EuropeanElectoralRegion::class     , 'european_electoral_region_id'    )->nullable()->constrained('european_electoral_regions');
            $table->foreignIdFor(HealthAuthority::class             , 'nhs_ha_id'                       )->nullable()->constrained('health_authorities');
            $table->foreignIdFor(Nuts::class                        , 'nuts_id'                         )->nullable()->constrained('nuts');
            $table->foreignIdFor(ParliamentaryConstituency::class   , 'parliamentary_constituency_id'   )->nullable()->constrained('parliamentary_constituencies');
            $table->foreignIdFor(PoliceForceArea::class             , 'pfa_id'                          )->nullable()->constrained('police_force_areas');
            $table->foreignIdFor(PrimaryCareTrust::class            , 'primary_care_trust_id'           )->nullable()->constrained('primary_care_trusts');
            $table->foreignIdFor(Region::class                      , 'region_id'                       )->nullable()->constrained('regions');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('postcodes');
    }
};
