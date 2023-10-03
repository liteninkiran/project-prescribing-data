Run this command to create the database tables:

    php artisan migrate:fresh

Then run this command to populate the Postcode Area table:

    php artisan db:seed --class=PostcodeAreaSeeder

Alternatively, the two commands above can be reduced into just one command:

    php artisan migrate:fresh --seeder=PostcodeAreaSeeder
