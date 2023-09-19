<?php

namespace App\Services\Organisation;

use Illuminate\Support\Facades\Http;
use App\Models\Role;
use App\Models\Organisation;
use Illuminate\Support\Facades\Schema;

class OrganisationService
{
    private $limit = 1;
    private $offset = 10;
    private $created = 0;
    private $updated = 0;
    private $keyCols = [
        'org_id' => 'OrgId',
    ];

    /**
     * storeFromApi
     * 
     * @param string $roleId
     * @return array
     */
    public function storeFromApi(string $roleId): array
    {
        $role = Role::where('_id', $roleId)->firstOrFail();
        $url = $this->getUrl($role);
        $response = Http::accept('application/json')->get($url);
        $organisations = $response->json()['Organisations'];
        $this->createOrUpdateOrganisations($organisations);
        return [
            'created' => $this->created,
            'updated' => $this->updated,
        ];
    }

    /**
     * createOrUpdateOrganisations
     *
     * @param array $organisations
     * @return void
     */
    private function createOrUpdateOrganisations(array &$organisations): void
    {
        foreach ($organisations as $organisation) {
            $this->createOrUpdateOrganisation($organisation);
        }
    }
    
    /**
     * createOrUpdateOrganisation
     *
     * @param array $organisation
     * @return void
     */
    private function createOrUpdateOrganisation(array &$organisation): void
    {
        $attributes = $this->getAttributes($organisation);
        $columns = $this->getColumns();
        $values = $this->getAttributeValues($organisation, $columns);
        $model = Organisation::firstOrNew($attributes, $values);
        $this->updateModel($model, $values);
    }
    
    /**
     * convertToCamelCase
     *
     * @param string $string
     * @param string $separator
     * @param bool $capFirstChar
     * @return string
     */
    private function convertToCamelCase(string $string, string $separator = '_', bool $capFirstChar = true): string
    {
        $str = str_replace($separator, '', ucwords($string, $separator));
        if (!$capFirstChar) {
            $str = lcfirst($str);
        }
        return $str;
    }

    /**
     * getAttributes
     *
     * @param array $organisation
     * @return array
     */
    private function getAttributes(array &$organisation): array
    {
        foreach ($this->keyCols as $key => $value) {
            $attributes[$key] = $organisation[$value];
        }
        return $attributes;
    }
    
    /**
     * getColumns
     *
     * @return array
     */
    private function getColumns(): array
    {
        // Find all database fields
        $columns = Schema::getColumnListing((new Organisation())->getTable());

        // Remove meta data fields
        $unsetColumns = [
            'id',
            'created_at',
            'updated_at',
        ];

        // Also remove key fields
        $unsetColumns = array_merge($unsetColumns, $this->keyCols);

        // Remove necessary columns from array
        foreach ($unsetColumns as $col) {
            if (($key = array_search($col, $columns)) !== false) {
                unset($columns[$key]);
            }
        }

        // Return the remaining columns
        return $columns;
    }
    
    /**
     * getAttributeValues
     *
     * @param array $organisation
     * @param array $columns
     * @return array
     */
    private function getAttributeValues(array &$organisation, array &$columns): array
    {
        // Create associative array with key/value pairs, initialising value to NULL
        $values = array_fill_keys($columns, null);

        // Populate array with values from org array
        foreach ($values as $key => &$value) {
            $arrayKey = $this->convertToCamelCase($key);
            $value = $organisation[$arrayKey];
        }

        // This is needed because the loop passed $value ByRef
        unset($value);

        // Return the associative array
        return $values;
    }
    
    /**
     * updateModel
     *
     * @param Organisation $model
     * @param array $values
     * @return void
     */
    private function updateModel(Organisation $model, array &$values): void
    {
        if(isset($model->id)) {
            foreach ($values as $key => $value) {
                $model->$key = $value;
            }
        } else {
            $this->created ++;
        }
        $model->save();
        if ($model->wasChanged()) {
            $this->updated ++;
        }
    }
    
    /**
     * getUrl
     *
     * @param Role $role
     * @return string
     */
    private function getUrl(Role $role): string
    {
        $url  = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations';
        $url .= '?PrimaryRoleId=' . $role->_id;
        $url .= '&Limit=' . $this->limit;
        $url .= '&Offset=' . $this->offset;
        return $url;
    }
}
