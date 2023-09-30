<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
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

class PostcodeAttributesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Has code
        $this->adminCounty();
        $this->adminDistrict();
        $this->nuts();
        $this->parliamentaryConstituency();
        $this->policeForceArea();

        // Does not have code
        $this->europeanElectoralRegion();
        $this->healthAuthority();
        $this->primaryCareTrust();
        $this->region();
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
    private function Region(): void
    {
        $this->updateOrCreateModelsNameOnly('App\Models\Region', 'region');
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
        $models = Postcode::query()
            ->select($columns)
            ->distinct()
            ->whereNotNull($fieldName)
            ->orderBy($fieldName)
            ->get();
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
}
