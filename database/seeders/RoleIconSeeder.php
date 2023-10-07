<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleIconSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = Role::all();
        foreach($roles as $role) {
            $role->icon = $this->getIcon($role->_id);
            $role->save();
        }
    }

    private function getIcon(string $roleId): string|null
    {
        $path = 'assets/svg/';
        switch ($roleId) {
            // Doctor
            case 'RO315': // NI GP
            case 'RO227': // Scottish GP
            case 'RO177': // Prescribing Cost Centre
                return $path . 'doctor/doctor-a.svg';
            case 'RO96' : // Branch Surgery
                return $path . 'doctor/doctor-b.svg';
        
            // Pharmacy
            case 'RO181': // Pharmacy HQ
                return $path . 'pharmacy/pharmacy-a.svg';
            case 'RO182': // Pharmacy
                return $path . 'pharmacy/pharmacy-b.svg';
            case 'RO280': // Pharmacy Site
                return $path . 'pharmacy/pharmacy-c.svg';

            // Cancer
            case 'RO103': // Cancer Network
            case 'RO105': // Cancer Registry
                return $path . 'cancer/cancer-b.svg';
            
            // Education
            case 'RO117': // Education
            case 'RO221': // School
                return $path . 'education/education-a.svg';

            // Police
            case 'RO233': // CONSTABULARY
                return $path . 'police/police-a.svg';
            case 'RO234': // POLICE CUSTODY SUITE
                return $path . 'police/police-b.svg';

            // Court
            case 'RO235': // COURT
                return $path . 'court/court-a.svg';

            // Prison
            case 'RO175': // PRISON
                return $path . 'prison/prison-d.svg';

            // Sexual Assault
            case 'RO236': // SEXUAL ASSAULT REFERRAL CENTRE
                return $path . 'sexual-assault/sexual-assault-e.svg';

            // Partnership
            case 'RO261': // STRATEGIC PARTNERSHIP
                return $path . 'partnership/partnership-a.svg';

            // Care
            case 'RO101': // SOCIAL CARE SITE
            case 'RO104': // SOCIAL CARE PROVIDER
            case 'RO272': // PRIMARY CARE NETWORK
            case 'RO171': // PRIMARY CARE GROUP
            case 'RO179': // PRIMARY CARE TRUST
            case 'RO180': // PRIMARY CARE TRUST SITE
            case 'RO153': // NORTHERN IRELAND HEALTH & SOCIAL CARE BOARD
            case 'RO154': // NORTHERN IRELAND HEALTH AND SOCIAL CARE TRUST
            case 'RO180': // PRIMARY CARE TRUST SITE
            case 'RO107': // CARE TRUST
            case 'RO108': // CARE TRUST SITE
                return $path . 'care/care-b.svg';

            // Children
            case 'RO231': // SECURE CHILDREN'S HOME
            case 'RO228': // YOUNG OFFENDER INSTITUTION
            case 'RO231': // SECURE CHILDREN'S HOME
                return $path . 'children/children-e.svg';

            // Immigration
            case 'RO232': // IMMIGRATION REMOVAL CENTRE
                return $path . 'immigration/immigration-a.svg';

            // Dentist
            case 'RO110': // GENERAL DENTAL PRACTICE
                return $path . 'dentist/dentist-l.svg';

            // Optician
            case 'RO166': // OPTICAL HEADQUARTERS
                return $path . 'optician/optician-b.svg';
            case 'RO167': // OPTICAL SITE
                return $path . 'optician/optician-e.svg';
    
            // Pathology
            case 'RO173': // PATHOLOGY LAB
                return $path . 'pathology/pathology-e.svg';

            // Observatory
            case 'RO134': // HEALTH OBSERVATORY
                return $path . 'observatory/observatory-c.svg';

            // NHS
            case 'RO198': // NHS TRUST SITE
            case 'RO197': // NHS TRUST
            case 'RO158': // NON STATUTORY NHS ORGANISATION
            case 'RO210': // NHS ENGLAND (REGION, LOCAL OFFICE)
            case 'RO212': // NHS ENGLAND (REGION, LOCAL OFFICE) SITE
            case 'RO161': // NHS SUPPORT AGENCY
            case 'RO209': // NHS ENGLAND (REGION)
            case 'RO169': // OTHER UNIT (IN SUPPORT OF NHS BUSINESS)
                return $path . 'nhs/nhs-a.svg';

            // Non-NHS
            case 'RO157': // NON-NHS ORGANISATION
                return $path . 'non-nhs/non-nhs-c.svg';

            // Everything else
            default:
                return null;
        }
    }
}
