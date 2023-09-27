<?php

namespace App\Services\Postcode;

// Illuminate
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// Models
use App\Models\Role;
use App\Models\Organisation;
use App\Models\Postcode;

class PostcodeService
{
    /** @var array $keyCols Columns used to uniquely identify a record */
    private array $keyCols = [
        'postcode' => 'postcode',
    ];

    /** @var int $limit Specify limit for API call. Max is 100. */
    private int $limit = 2;

    /** @var string $url Do not touch. */
    private string $url = 'api.postcodes.io/postcodes';

    /** @var array $postcodeChuncks Array of this input postcode arrays, chuncked by $limit. Do not touch*/
    private array $postcodeChuncks;

    /** @var array|null $postcodeData Response data from API call. Do not touch*/
    private array|null $postcodeData;

    /** @var array $tableColumns Field names from postcodes table. Do not touch*/
    private array $tableColumns;

    /** @var int $totalRows counter Do not touch. */
    private int $totalRows = 0;

    /** @var int $created counter Do not touch. */
    private int $created = 0;

    /** @var int $updated counter Do not touch. */
    private int $updated = 0;

    /**
     * storeFromApi
     * 
     * @param string[] $postcodes
     * @return array
     */
    public function storeFromApi(array $postcodes): array
    {
        // Store chuncked postcodes
        $this->postcodeChuncks = array_chunk($postcodes, $this->limit);

        // Store database columns
        $this->setColumns();

        // Loop through the chuncks
        $this->chunckLoop();

        // Return summary
        return [
            'created' => $this->created,
            'updated' => $this->updated,
        ];
    }
    
    /**
     * chunckLoop
     *
     * @return void
     */
    private function chunckLoop(): void
    {
        foreach ($this->postcodeChuncks as $postcodes) {
            // Make POST request
            $response = Http::acceptJson()->post($this->url, ['postcodes' => $postcodes]);

            // Store response
            $jsonResponse = $response->json();

            // Store result
            $results = $jsonResponse['result'];

            // Store in local DB
            $this->storeData($results);
        }
    }
    
    /**
     * storeData
     *
     * @param array $results
     * @return void
     */
    private function storeData(array $results): void
    {
        foreach ($results as $result) {

            // Store the individual postcode data for use later
            $this->postcodeData = $result['result'];

            // Check if any data has been found
            if ($this->postcodeData) {

                // Key / value pairs of field(s) that uniquely identify a record
                $attributes = $this->getAttributes();

                // Key / value pairs of other updatable field(s) in the model
                $values = $this->getAttributeValues();

                // Find existing model or instantiate a new (but unsaved) one
                $postcode = Postcode::firstOrNew($attributes, $values);

                // Save the model
                $this->updateModel($postcode, $values);
            }
        }
    }
    
    /**
     * getAttributes
     *
     * @return array
     */
    private function getAttributes(): array
    {
        foreach ($this->keyCols as $key => $value) {
            $attributes[$key] = $this->postcodeData[$value];
        }
        return $attributes;
    }
    
    /**
     * setColumns
     *
     * @return void
     */
    private function setColumns(): void
    {
        // Find all database fields
        $columns = Schema::getColumnListing((new Postcode())->getTable());

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

        $this->columns = $columns;
    }
    
    /**
     * getAttributeValues
     *
     * @return array
     */
    private function getAttributeValues(): array
    {
        // Create associative array with key/value pairs, initialising value to NULL
        $values = array_fill_keys($this->columns, null);

        // Populate array with values from postcode result array
        foreach ($values as $key => &$value) {
            $value = $this->getAttributeValue($key);
        }

        // This is needed because the loop passed $value ByRef
        unset($value);

        // Return the associative array
        return $values;
    }
    
    /**
     * getAttributeValue
     *
     * @param string $key
     * @return mixed
     */
    private function getAttributeValue(string $key): mixed
    {
        // Try and find value based on exact key name match
        $value = $this->getAttributeValueCheck($this->postcodeData, $key);

        // If that failed, check the codes array
        if (!$value) {
            // Remove the '_code' suffix from the key
            $key = substr($key, 0, strlen($key) - 5);

            // Check the codes array
            $value = $this->getAttributeValueCheck($this->postcodeData['codes'], $key);
        }

        return $value;
    }
    
    /**
     * getAttributeValueCheck
     *
     * @param array $array
     * @param string $key
     * @return mixed
     */
    private function getAttributeValueCheck(array $array, string $key): mixed
    {
        // Initialise return value
        $value = null;

        // Store value from array if the key exists
        if (array_key_exists($key, $array)) {
            $value = $array[$key];
        }

        return $value;
    }
    
    /**
     * updateModel
     *
     * @param array $model
     * @param array $values
     * @return void
     */
    private function updateModel(Postcode $model, array &$values): void
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
}
