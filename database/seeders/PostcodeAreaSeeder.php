<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PostcodeArea;

class PostcodeAreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = $this->getData();
        foreach ($rows as $row) {
            PostcodeArea::create($row);    
        }
    }

    private function getData(): array
    {
        return [
            [ 'code' => 'AB', 'name' => 'Aberdeen' ],
            [ 'code' => 'AL', 'name' => 'St Albans' ],
            [ 'code' => 'B' , 'name' => 'Birmingham' ],
            [ 'code' => 'BA', 'name' => 'Bath' ],
            [ 'code' => 'BB', 'name' => 'Blackburn' ],
            [ 'code' => 'BD', 'name' => 'Bradford' ],
            [ 'code' => 'BF', 'name' => 'British Forces' ],
            [ 'code' => 'BH', 'name' => 'Bournemouth' ],
            [ 'code' => 'BL', 'name' => 'Bolton' ],
            [ 'code' => 'BN', 'name' => 'Brighton' ],
            [ 'code' => 'BR', 'name' => 'Bromley' ],
            [ 'code' => 'BS', 'name' => 'Bristol' ],
            [ 'code' => 'BT', 'name' => 'Northern Ireland' ],
            [ 'code' => 'CA', 'name' => 'Carlisle' ],
            [ 'code' => 'CB', 'name' => 'Cambridge' ],
            [ 'code' => 'CF', 'name' => 'Cardiff' ],
            [ 'code' => 'CH', 'name' => 'Chester' ],
            [ 'code' => 'CM', 'name' => 'Chelmsford' ],
            [ 'code' => 'CO', 'name' => 'Colchester' ],
            [ 'code' => 'CR', 'name' => 'Croydon' ],
            [ 'code' => 'CT', 'name' => 'Canterbury' ],
            [ 'code' => 'CV', 'name' => 'Coventry' ],
            [ 'code' => 'CW', 'name' => 'Crewe' ],
            [ 'code' => 'DA', 'name' => 'Dartford' ],
            [ 'code' => 'DD', 'name' => 'Dundee' ],
            [ 'code' => 'DE', 'name' => 'Derby' ],
            [ 'code' => 'DG', 'name' => 'Dumfries and Galloway' ],
            [ 'code' => 'DH', 'name' => 'Durham' ],
            [ 'code' => 'DL', 'name' => 'Darlington' ],
            [ 'code' => 'DN', 'name' => 'Doncaster' ],
            [ 'code' => 'DT', 'name' => 'Dorchester' ],
            [ 'code' => 'DY', 'name' => 'Dudley' ],
            [ 'code' => 'E' , 'name' => 'East London' ],
            [ 'code' => 'EC', 'name' => 'Central London' ],
            [ 'code' => 'EH', 'name' => 'Edinburgh' ],
            [ 'code' => 'EN', 'name' => 'Enfield' ],
            [ 'code' => 'EX', 'name' => 'Exeter' ],
            [ 'code' => 'FK', 'name' => 'Falkirk and Stirling' ],
            [ 'code' => 'FY', 'name' => 'Blackpool' ],
            [ 'code' => 'G' , 'name' => 'Glasgow' ],
            [ 'code' => 'GL', 'name' => 'Gloucester' ],
            [ 'code' => 'GU', 'name' => 'Guildford' ],
            [ 'code' => 'HA', 'name' => 'Harrow' ],
            [ 'code' => 'HD', 'name' => 'Huddersfield' ],
            [ 'code' => 'HG', 'name' => 'Harrogate' ],
            [ 'code' => 'HP', 'name' => 'Hemel Hempstead' ],
            [ 'code' => 'HR', 'name' => 'Hereford' ],
            [ 'code' => 'HS', 'name' => 'Outer Hebrides' ],
            [ 'code' => 'HU', 'name' => 'Hull' ],
            [ 'code' => 'HX', 'name' => 'Halifax' ],
            [ 'code' => 'IG', 'name' => 'Ilford' ],
            [ 'code' => 'IP', 'name' => 'Ipswich' ],
            [ 'code' => 'IV', 'name' => 'Inverness' ],
            [ 'code' => 'KA', 'name' => 'Kilmarnock' ],
            [ 'code' => 'KT', 'name' => 'Kingston upon Thames' ],
            [ 'code' => 'KW', 'name' => 'Kirkwall' ],
            [ 'code' => 'KY', 'name' => 'Kirkcaldy' ],
            [ 'code' => 'L' , 'name' => 'Liverpool' ],
            [ 'code' => 'LA', 'name' => 'Lancaster' ],
            [ 'code' => 'LD', 'name' => 'Llandrindod Wells' ],
            [ 'code' => 'LE', 'name' => 'Leicester' ],
            [ 'code' => 'LL', 'name' => 'Llandudno' ],
            [ 'code' => 'LN', 'name' => 'Lincoln' ],
            [ 'code' => 'LS', 'name' => 'Leeds' ],
            [ 'code' => 'LU', 'name' => 'Luton' ],
            [ 'code' => 'M' , 'name' => 'Manchester' ],
            [ 'code' => 'ME', 'name' => 'Rochester' ],
            [ 'code' => 'MK', 'name' => 'Milton Keynes' ],
            [ 'code' => 'ML', 'name' => 'Motherwell' ],
            [ 'code' => 'N' , 'name' => 'North London' ],
            [ 'code' => 'NE', 'name' => 'Newcastle upon Tyne' ],
            [ 'code' => 'NG', 'name' => 'Nottingham' ],
            [ 'code' => 'NN', 'name' => 'Northampton' ],
            [ 'code' => 'NP', 'name' => 'Newport' ],
            [ 'code' => 'NR', 'name' => 'Norwich' ],
            [ 'code' => 'NW', 'name' => 'North West London' ],
            [ 'code' => 'OL', 'name' => 'Oldham' ],
            [ 'code' => 'OX', 'name' => 'Oxford' ],
            [ 'code' => 'PA', 'name' => 'Paisley' ],
            [ 'code' => 'PE', 'name' => 'Peterborough' ],
            [ 'code' => 'PH', 'name' => 'Perth' ],
            [ 'code' => 'PL', 'name' => 'Plymouth' ],
            [ 'code' => 'PO', 'name' => 'Portsmouth' ],
            [ 'code' => 'PR', 'name' => 'Preston' ],
            [ 'code' => 'RG', 'name' => 'Reading' ],
            [ 'code' => 'RH', 'name' => 'Redhill' ],
            [ 'code' => 'RM', 'name' => 'Romford' ],
            [ 'code' => 'S' , 'name' => 'Sheffield' ],
            [ 'code' => 'SA', 'name' => 'Swansea' ],
            [ 'code' => 'SE', 'name' => 'South East London' ],
            [ 'code' => 'SG', 'name' => 'Stevenage' ],
            [ 'code' => 'SK', 'name' => 'Stockport' ],
            [ 'code' => 'SL', 'name' => 'Slough' ],
            [ 'code' => 'SM', 'name' => 'Sutton' ],
            [ 'code' => 'SN', 'name' => 'Swindon' ],
            [ 'code' => 'SO', 'name' => 'Southampton' ],
            [ 'code' => 'SP', 'name' => 'Salisbury' ],
            [ 'code' => 'SR', 'name' => 'Sunderland' ],
            [ 'code' => 'SS', 'name' => 'Southend-on-Sea' ],
            [ 'code' => 'ST', 'name' => 'Stoke-on-Trent' ],
            [ 'code' => 'SW', 'name' => 'South West London' ],
            [ 'code' => 'SY', 'name' => 'Shrewsbury' ],
            [ 'code' => 'TA', 'name' => 'Taunton' ],
            [ 'code' => 'TD', 'name' => 'Galashiels' ],
            [ 'code' => 'TF', 'name' => 'Telford' ],
            [ 'code' => 'TN', 'name' => 'Tonbridge' ],
            [ 'code' => 'TQ', 'name' => 'Torquay' ],
            [ 'code' => 'TR', 'name' => 'Truro' ],
            [ 'code' => 'TS', 'name' => 'Cleveland' ],
            [ 'code' => 'TW', 'name' => 'Twickenham' ],
            [ 'code' => 'UB', 'name' => 'Southall' ],
            [ 'code' => 'W' , 'name' => 'West London' ],
            [ 'code' => 'WA', 'name' => 'Warrington' ],
            [ 'code' => 'WC', 'name' => 'Central London' ],
            [ 'code' => 'WD', 'name' => 'Watford' ],
            [ 'code' => 'WF', 'name' => 'Wakefield' ],
            [ 'code' => 'WN', 'name' => 'Wigan' ],
            [ 'code' => 'WR', 'name' => 'Worcester' ],
            [ 'code' => 'WS', 'name' => 'Walsall' ],
            [ 'code' => 'WV', 'name' => 'Wolverhampton' ],
            [ 'code' => 'YO', 'name' => 'York' ],
            [ 'code' => 'ZE', 'name' => 'Lerwick' ],
        ];
    }
}
