import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
    id: string;
    name: string;
    progress: string;
    fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
    'blueberry',
    'lychee',
    'kiwi',
    'mango',
    'peach',
    'lime',
    'pomegranate',
    'pineapple',
];
const NAMES: string[] = [
    'Maia',
    'Asher',
    'Olivia',
    'Atticus',
    'Amelia',
    'Jack',
    'Charlotte',
    'Theodore',
    'Isla',
    'Oliver',
    'Isabella',
    'Jasper',
    'Cora',
    'Levi',
    'Violet',
    'Arthur',
    'Mia',
    'Thomas',
    'Elizabeth',
];

@Component({
    selector: 'app-table-sort',
    templateUrl: './table-sort.component.html',
    styleUrls: ['./table-sort.component.scss'],
})
export class TableSortComponent implements AfterViewInit {
    displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];
    dataSource: MatTableDataSource<UserData>;

    @ViewChild(MatSort) sort!: MatSort;

    constructor() {
        // Create 100 users
        const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(users);
    }

    public ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        console.log(this.sort);

    }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
                 NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
        id: id.toString(),
        name: name,
        progress: Math.round(Math.random() * 100).toString(),
        fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
    };
}
