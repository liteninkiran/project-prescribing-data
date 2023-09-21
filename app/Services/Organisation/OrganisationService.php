<?php

namespace App\Services\Organisation;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use App\Models\Role;
use App\Models\Organisation;

class OrganisationService
{
    /** @var array $keyCols Columns used to uniquely identify a record */
    private array $keyCols = [
        'org_id' => 'OrgId',
    ];

    /** @var int $limit Specify limit for API call. Max is 1,000. */
    private int $limit = 1000;

    /** @var Role $role Do not touch*/
    private Role $role;

    /** @var int $totalRows Do not touch. */
    private int $totalRows = 0;

    /** @var int $offset Do not touch. */
    private int $offset = 0;

    /** @var int $created Do not touch. */
    private int $created = 0;

    /** @var int $updated Do not touch. */
    private int $updated = 0;

    /**
     * storeFromApi
     * 
     * @param string $roleId
     * @return array
     */
    public function storeFromApi(string $roleId): array
    {
        // Set $role using model from DB
        $this->setRole($roleId);

        // Set timeout (not using queue yet)
        $this->setTimeout(300);

        // Loop through the URLs (max row limit is 1,000)
        $this->looper();

        // Return summary
        return [
            'created' => $this->created,
            'updated' => $this->updated,
        ];
    }

    /**
     * looper
     * 
     * @return void
     */
    public function looper(): void
    {
        do {
            $rows = $this->storeData();
            $this->totalRows += $rows;
            info($this->totalRows);
        } while ($rows === $this->limit);
    }

    /**
     * setRole
     * 
     * @param string $roleId
     * @return void
     */
    public function setRole(string $roleId): void
    {
        $this->role = Role::where('_id', $roleId)->firstOrFail();
    }

    /**
     * setTimeout
     * 
     * @param int $timeout
     * @return void
     */
    public function setTimeout(int $timeout = 0): void
    {
        set_time_limit($timeout);
    }

    /**
     * storeData
     *
     * @return int
     */
    private function storeData(): int
    {
        $url = $this->getUrl();
        $response = Http::accept('application/json')->get($url);
        $jsonResponse = $response->json();
        $organisations = $jsonResponse['Organisations'];
        $this->createOrUpdateOrganisations($organisations);
        $this->offset += $this->limit;
        return count($organisations);
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
        $values['primary_role_id'] = $this->role->id;
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
     * @return string
     */
    private function getUrl(): string
    {
        $roleKey = $this->role->primary_role ? 'PrimaryRoleId' : 'NonPrimaryRoleId';
        $url  = 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations';
        $url .= '?' . $roleKey . '=' . $this->role->_id;
        $url .= '&Limit=' . $this->limit;
        $url .= $this->offset > 0 ? '&Offset=' . $this->offset : '';
        return $url;
    }
}
