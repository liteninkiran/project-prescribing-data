<?php

namespace Database\Seeders;

// Illuminate
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Builder;

// Models
use App\Models\Postcode;
use App\Models\AdminCounty;
use App\Models\AdminDistrict;
use App\Models\EuropeanElectoralRegion;
use App\Models\HealthAuthority;
use App\Models\Nuts;
use App\Models\ParliamentaryConstituency;
use App\Models\PoliceForceArea;
use App\Models\PrimaryCareTrust;
use App\Models\Region;
use App\Models\Country;

class PostcodeAttributesSeeder extends Seeder
{
    private $query;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // // Has code
        // $this->adminCounty();
        // $this->adminDistrict();
        // $this->nuts();
        // $this->parliamentaryConstituency();
        // $this->policeForceArea();

        // // Does not have code
        // $this->europeanElectoralRegion();
        // $this->healthAuthority();
        // $this->primaryCareTrust();
        // $this->region();
        // $this->country();

        // // Update postcodes
        // $this->updatePostcodes();

        $this->updateParlConRegionId();
    }

    /**
     * updatePostcodes
     *
     * @return void
     */
    private function updatePostcodes(): void
    {
        $data = $this->getData();
        foreach ($data as $d) {
            $rows = 0;
            $this->setQueryForUpsert(
                $d->table,
                $d->foreignKey,
                $d->matchOnPrimary,
                $d->matchOnForeign,
            );
            $rows += $this->upsertData([$d->foreignKey]);
        }
    }
    
    /**
     * getData
     *
     * @return array
     */
    private function getData(): array
    {
        $arrays = [[
                'table' => 'admin_counties',
                'foreignKey' => 'admin_county_id',
                'matchOnPrimary' => 'admin_county_code',
                'matchOnForeign' => 'code',
            ], [
                'table' => 'admin_districts',
                'foreignKey' => 'admin_district_id',
                'matchOnPrimary' => 'admin_district_code',
                'matchOnForeign' => 'code',
            ], [
                'table' => 'nuts',
                'foreignKey' => 'nuts_id',
                'matchOnPrimary' => 'nuts_code',
                'matchOnForeign' => 'code',
            ], [
                'table' => 'parliamentary_constituencies',
                'foreignKey' => 'parliamentary_constituency_id',
                'matchOnPrimary' => 'parliamentary_constituency_code',
                'matchOnForeign' => 'code',
            ], [
                'table' => 'police_force_areas',
                'foreignKey' => 'pfa_id',
                'matchOnPrimary' => 'pfa_code',
                'matchOnForeign' => 'code',
            ], [
                'table' => 'postcode_areas',
                'foreignKey' => 'postcode_area_id',
                'matchOnPrimary' => 'postcode_area',
                'matchOnForeign' => 'code',
            ], [
                'table' => 'european_electoral_regions',
                'foreignKey' => 'european_electoral_region_id',
                'matchOnPrimary' => 'european_electoral_region',
                'matchOnForeign' => 'name',
            ], [
                'table' => 'health_authorities',
                'foreignKey' => 'nhs_ha_id',
                'matchOnPrimary' => 'nhs_ha',
                'matchOnForeign' => 'name',
            ], [
                'table' => 'primary_care_trusts',
                'foreignKey' => 'primary_care_trust_id',
                'matchOnPrimary' => 'primary_care_trust',
                'matchOnForeign' => 'name',
            ], [
                'table' => 'regions',
                'foreignKey' => 'region_id',
                'matchOnPrimary' => 'region',
                'matchOnForeign' => 'name',
            ], [
                'table' => 'countries',
                'foreignKey' => 'country_id',
                'matchOnPrimary' => 'country',
                'matchOnForeign' => 'name',
            ],
        ];

        $objArray = array_map(function ($element) {
            return (object) $element;
        }, $arrays);
        return $objArray;
    }

    /**
     * upsertData
     *
     * @param string[] $updateFields
     * @return int
     */
    private function upsertData(array $updateFields): int {
        $data = $this->query->get()->toArray();
        $chunkedData = array_chunk($data, 1000);
        $uniqueFields = ['postcode'];
        $result = 0;
        foreach ($chunkedData as $data) {
            $rows = Postcode::upsert($data, $uniqueFields, $updateFields);
            $result += $rows;
        }
        return $result / 2;
    }
    
    /**
     * setQueryForUpsert
     *
     * @param string $table
     * @param string $foreignKey
     * @param string $matchOnPrimary
     * @param string $matchOnForeign
     * @return void
     */
    private function setQueryForUpsert(string $table, string $foreignKey, string $matchOnPrimary, string $matchOnForeign): void
    {
        $selectColumns = $this->getColumnNameArrayForUpsert($foreignKey);

        $this->query = Postcode::query()
            ->select($selectColumns)
            ->from('postcodes', 'p')
            ->join($table . ' AS t', 't.' . $matchOnForeign, '=', 'p.' . $matchOnPrimary)
            ->where(function ($query) use ($foreignKey) {
                $query
                    ->whereNull('p.' . $foreignKey)
                    // The orWhere() function was behaving unpredictably so I am using orWhereRaw().
                    // The third argument was being treated as a parameter and sometimes returned 
                    // matching records. It is baffling.
                    ->orWhereRaw('p.' . $foreignKey . ' <> t.id');
            });
    }
    
    /**
     * getColumnNameArrayForUpsert
     *
     * @param string $columnAlias
     * @return array
     */
    private function getColumnNameArrayForUpsert(string $columnAlias): array
    {
        return [ 'p.postcode', 't.id as ' . $columnAlias ];
    }

    /**
     * adminCounty
     *
     * @return void
     */
    private function adminCounty(): void
    {
        $this->updateOrCreateModels('App\Models\AdminCounty', 'admin_county');
    }

    /**
     * adminDistrict
     *
     * @return void
     */
    private function adminDistrict(): void
    {
        $this->updateOrCreateModels('App\Models\AdminDistrict', 'admin_district');
    }

    /**
     * nuts
     *
     * @return void
     */
    private function nuts(): void
    {
        $this->updateOrCreateModels('App\Models\Nuts', 'nuts');
    }

    /**
     * parliamentaryConstituency
     *
     * @return void
     */
    private function parliamentaryConstituency(): void
    {
        $this->updateOrCreateModels('App\Models\ParliamentaryConstituency', 'parliamentary_constituency');
    }

    /**
     * policeForceArea
     *
     * @return void
     */
    private function policeForceArea(): void
    {
        $this->updateOrCreateModels('App\Models\PoliceForceArea', 'pfa');
    }

    /**
     * europeanElectoralRegion
     *
     * @return void
     */
    private function europeanElectoralRegion(): void
    {
        $this->updateOrCreateModelsNameOnly('App\Models\EuropeanElectoralRegion', 'european_electoral_region');
    }
    
    /**
     * healthAuthority
     *
     * @return void
     */
    private function healthAuthority(): void
    {
        $this->updateOrCreateModelsNameOnly('App\Models\HealthAuthority', 'nhs_ha');
    }

    /**
     * primaryCareTrust
     *
     * @return void
     */
    private function primaryCareTrust(): void
    {
        $this->updateOrCreateModelsNameOnly('App\Models\PrimaryCareTrust', 'primary_care_trust');
    }

    /**
     * Region
     *
     * @return void
     */
    private function region(): void
    {
        $this->updateOrCreateModelsNameOnly('App\Models\Region', 'region');
    }

    /**
     * Country
     *
     * @return void
     */
    private function country(): void
    {
        $this->updateOrCreateModelsNameOnly('App\Models\Country', 'country');
    }

    /**
     * updateOrCreateModels
     *
     * @param string $class
     * @param string $fieldName
     * @return void
     */
    private function updateOrCreateModels(string $class, string $fieldName): void
    {
        $columns = [
            $fieldName . '_code AS code',
            $fieldName . ' AS name',
        ];
        $query = Postcode::query()
            ->select($columns)
            ->distinct()
            ->whereNotNull($fieldName)
            ->orderBy($fieldName);
        $models = $query->get();
        foreach($models as $model) {
            $attributes = [ 'code' => $model->code ];
            $values = [ 'name' => $model->name ];
            $newModel = $class::updateOrCreate($attributes, $values);
        }
    }

    /**
     * updateOrCreateModelsNameOnly
     *
     * @param string $class
     * @param string $fieldName
     * @return void
     */
    private function updateOrCreateModelsNameOnly(string $class, string $fieldName): void
    {
        $columns = [
            $fieldName . ' AS name',
        ];
        $models = Postcode::query()
            ->select($columns)
            ->distinct()
            ->whereNotNull($fieldName)
            ->orderBy($fieldName)
            ->get();
        foreach($models as $model) {
            $attributes = [ 'name' => $model->name ];
            $newModel = $class::updateOrCreate($attributes);
        }
    }

    private function updateParlConRegionId(): void
    {
        $parlCons = ParliamentaryConstituency::all();
        info($parlCons->count());
    }
}
