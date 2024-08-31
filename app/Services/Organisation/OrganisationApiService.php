<?php

namespace App\Services\Organisation;

// Illuminate
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Builder;

// Models
use App\Models\Role;
use App\Models\Organisation;
use App\Models\Postcode;

class OrganisationApiService
{
    /** @var array $keyCols Columns used to uniquely identify a record */
    private array $keyCols = [
        'org_id' => 'OrgId',
    ];

    /** @var int $limit Specify limit for API call. Max is 1,000. */
    private int $limit = 1000;

    /** @var Role|null $role Do not touch*/
    private Role|null $role = null;

    /** @var int $totalRows Do not touch. */
    private int $totalRows = 0;

    /** @var int $offset Do not touch. */
    private int $offset = 0;

    /** @var int $created Do not touch. */
    private int $created = 0;

    /** @var int $updated Do not touch. */
    private int $updated = 0;

    /**
     * setRole
     * 
     * @param string|null $roleId
     * @return self
     */
    public function setRole(string|null $roleId): self
    {
        if ($roleId) {
            $this->role = Role::where('_id', $roleId)->firstOrFail();
        } else {
            $this->role = null;
        }
        return $this;
    }

    /**
     * updateOrgLastUpdated
     *
     * @param bool $start
     * @return self
     */
    public function setOrgLastUpdated(bool $start): self
    {
        if ($this->role) {
            $lowDate = new Carbon('1970-01-01 00:00:01');
            $now = Carbon::now()->timezone('Europe/London');
            $this->role->org_last_updated = ($start ? $lowDate : $now);
            $this->role->save();
        }
        return $this;
    }

    /**
     * getOrgLastUpdated
     *
     * @return ?Carbon
     */
    public function getOrgLastUpdated(): ?Carbon
    {
        return $this->role && $this->role->org_last_updated ? Carbon::parse($this->role->org_last_updated) : null;
    }

    /**
     * storeFromApi
     * 
     * @return self
     */
    public function storeFromApi(): self
    {
        do {
            $rows = $this->storeData();
            $this->totalRows += $rows;
        } while ($rows === $this->limit);
        return $this;
    }

    /**
     * updatePostcodeId
     * 
     * The upsert() function uses "ON DUPLICATE KEY UPDATE". From the MySql docs, it states:
     *     With ON DUPLICATE KEY UPDATE, the affected-rows value per row is 1 if the 
     *     row is inserted as a new row, 2 if an existing row is updated, and 0 if 
     *     an existing row is set to its current values.
     * @return self
     */
    public function updatePostcodeId(): self {
        $data = $this->getQueryForUpsert()->get()->toArray();
        $chunkedData = array_chunk($data, 1000);
        $uniqueFields = ['org_id'];
        $updateFields = ['postcode_id'];
        foreach ($chunkedData as $data) {
            Organisation::upsert($data, $uniqueFields, $updateFields);
        }
        return $this;
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
            'organisations.inactive',
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
        $values['inactive'] = $organisation['Status'] === 'Inactive' ? 1 : 0;
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
        $unsetColumns = array_merge($unsetColumns, array_keys($this->keyCols));

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
                $value = $value === '' ? null : $value;
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
     * @param string|null $search
     * @return int|null
     */
    private function getPostcodeId(string|null $search): int | null
    {
        if ($search) {
            $postcode = Postcode::where('postcode', $search)->first();
            return $postcode ? $postcode->id : null;
        } else {
            return null;
        }
    }
}
