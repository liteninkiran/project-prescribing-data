<?php

namespace App\Services\Organisation;

// Illuminate
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Builder;

// Models
use App\Models\Role;
use App\Models\Organisation;
use App\Models\Postcode;

// Carbon
use Carbon\Carbon;

class OrganisationApiService
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

        // Update org_last_updated field
        $this->updateOrgLastUpdated();

        // Return summary
        return [
            'created' => $this->created,
            'updated' => $this->updated,
        ];
    }

    /**
     * updatePostcodeId
     *
     * @param string|null $roleId
     * @return array
     */
    public function updatePostcodeId(string|null $roleId = null): array
    {
        $this->setRole($roleId);
        $this->updated = $this->upsertData();

        return [
            'updated' =>  $this->updated,
        ];
    }

    /**
     * upsertData
     * 
     * The upsert() function uses "ON DUPLICATE KEY UPDATE". From the MySql docs, it states:
     *     With ON DUPLICATE KEY UPDATE, the affected-rows value per row is 1 if the 
     *     row is inserted as a new row, 2 if an existing row is updated, and 0 if 
     *     an existing row is set to its current values.
     *
     * @return int
     */
    private function upsertData(): int {
        $data = $this->getQueryForUpsert()->get()->toArray();
        $chunkedData = array_chunk($data, 1000);
        $uniqueFields = ['org_id'];
        $updateFields = ['postcode_id'];
        $result = 0;
        foreach ($chunkedData as $data) {
            $result += Organisation::upsert($data, $uniqueFields, $updateFields);
        }
        return $result / 2;
    }

    /**
     * getColumnNameArrayForUpsert
     *
     * @return array
     */
    private function getColumnNameArrayForUpsert(): array
    {
        return [
            'organisations.name',
            'organisations.org_id',
            'organisations.status',
            'organisations.org_record_class',
            'organisations.post_code',
            'postcodes.id AS postcode_id',
            'organisations.last_change_date',
            'organisations.primary_role_id',
            'organisations.org_link',
        ];
    }
    
    /**
     * getQueryForUpsert
     *
     * @return Builder
     */
    private function getQueryForUpsert(): Builder
    {
        $selectColumns = $this->getColumnNameArrayForUpsert();

        $query = Organisation::query()
            ->select($selectColumns)
            ->join('postcodes', 'postcodes.postcode', '=', 'organisations.post_code')
            ->whereNull('postcode_id');

        if ($this->role) {
            $query->where('primary_role_id', $this->role->id);
        }

        return $query;
    }

    /**
     * looper
     * 
     * @return void
     */
    private function looper(): void
    {
        do {
            $rows = $this->storeData();
            $this->totalRows += $rows;
        } while ($rows === $this->limit);
    }

    /**
     * setRole
     * 
     * @param string|null $roleId
     * @return void
     */
    private function setRole(string|null $roleId): void
    {
        if ($roleId) {
            $this->role = Role::where('_id', $roleId)->firstOrFail();
        }
    }

    /**
     * setTimeout
     * 
     * @param int $timeout
     * @return void
     */
    private function setTimeout(int $timeout = 0): void
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
        $values['postcode_id'] = $this->getPostcodeId($values['post_code']);
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
            if (array_key_exists($arrayKey, $organisation)) {
                $value = $organisation[$arrayKey];
            }
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
    
    /**
     * getPostcodeId
     *
     * @param string $search
     * @return int|null
     */
    private function getPostcodeId(string $search): int | null
    {
        $postcode = Postcode::where('postcode', $search)->first();
        return $postcode ? $postcode->id : null;
    }
    
    /**
     * updateOrgLastUpdated
     *
     * @return void
     */
    private function updateOrgLastUpdated(): void
    {
        if ($this->role) {
            $this->role->org_last_updated = Carbon::now()->timezone('Europe/London');
            $this->role->save();
        }
    }
}
