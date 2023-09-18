<?php

namespace App\Services\Organisation;

use Illuminate\Support\Facades\Http;
use App\Models\Role;
use App\Models\Organisation;
use Illuminate\Support\Facades\Schema;

class OrganisationService
{
    private $created = 0;
    private $updated = 0;

    /**
     * storeFromApi
     * 
     * @param string $roleId
     * @return array
     */
    public function storeFromApi(string $roleId): array
    {
        $role = Role::where('_id', $roleId)->firstOrFail();
        $url = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=' . $role->_id . '&Limit=1000&Offset=50';
        $response = Http::get($url);
        $this->createOrganisations($response['Organisations']);
        return [
            'created' => $this->created,
            'updated' => $this->updated,
        ];
    }

    /**
     * createOrganisations
     *
     * @param mixed $organisations
     * @return void
     */
    private function createOrganisations(array $organisations): void
    {
        foreach ($organisations as $organisation) {
            $this->createOrganisation($organisation);
        }
    }
    
    /**
     * createOrganisation
     *
     * @param mixed $organisation
     * @return void
     */
    private function createOrganisation($organisation): void
    {
        $attributes = [
            'org_id' => $organisation['OrgId'],
        ];
        $model = new Organisation();
        $columns = Schema::getColumnListing($model->getTable());
        $unsetColumns = [
            'id',
            'org_id',
            'created_at',
            'updated_at',
        ];

        foreach ($unsetColumns as $col) {
            if (($key = array_search($col, $columns)) !== false) {
                unset($columns[$key]);
            }
        }

        $values = array_fill_keys($columns, null);

        foreach ($values as $key => &$value) {
            $arrayKey = $this->convertToCamelCase($key);
            $value = $organisation[$arrayKey];
        }

        unset($value);

        $orgModel = Organisation::firstOrNew($attributes, $values);
        if(isset($orgModel->id)) {
            foreach ($values as $key => $value) {
                info($orgModel->$key .  ' - '. $value);
                $orgModel->$key = $value;
            }
        } else {
            $this->created ++;
        }
        $orgModel->save();
        if ($orgModel->wasChanged()) {
            $this->updated ++;
        }
    }

    private function convertToCamelCase($string, $separator = '_', $capitaliseFirstCharacter = true) 
    {
        $str = str_replace($separator, '', ucwords($string, $separator));
        if (!$capitaliseFirstCharacter) {
            $str = lcfirst($str);
        }
        return $str;
    }

}
