import { Component, OnInit, ViewChild } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';

import { PacienteService } from '../services/paciente.service';
import { NgForm } from '@angular/forms';
import { Paciente } from '../models/paciente';
import {MatDialog, MatSort, MatPaginator, MatTableDataSource} from '@angular/material';
// import {Issue} from './models/issue';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import {DataService} from '../services/data.service';

import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {AddDialogComponent} from '../dialogs/add/add.dialog.component';
import {EditDialogComponent} from '../dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from '../dialogs/delete/delete.dialog.component';
declare var M: any;

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css'],
  providers: [ PacienteService ]
})
export class PacienteComponent implements OnInit {
  myData: any;
  exampleDatabase: DataService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: number;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource = new MatTableDataSource<PeriodicElement>();
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private pacienteService: PacienteService, public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: DataService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {

    console.log("PACIENTE PAGE");
    this.pacienteService.getPacientes().subscribe(
    resp => {
      console.log("RESP " + resp);
      this.myData = resp as Paciente[];
      this.dataSource  = new MatTableDataSource<PeriodicElement>(this.myData);

    }, err => {
      console.log(err);
    });

   }

  getPacientes() {
    this.pacienteService.getPacientes()
      .subscribe(res => {
        this.pacienteService.pacientes = res as Paciente[];
      });
  }

  ngOnInit() {
    // CARAGAR MONDODB EN TABLA
    this.dataSource.sort = this.sort;
    // this.getPacientes();
    this.dataSource.paginator = this.paginator;

    this.loadData();
  }

  refresh() {
  this.loadData();
}

addNew(issue: Paciente) {
  const dialogRef = this.dialog.open(AddDialogComponent, {
    data: {issue: issue }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 1) {
      // After dialog is closed we're doing frontend updates
      // For add we're just pushing a new row inside DataService
      this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
      this.refreshTable();
    }
  });
}

startEdit(i: number, position: number, name: string, weight: string, symbol: string) {
  // this.id = id;
  // index row is used just for debugging proposes and can be removed
  this.index = i;
  console.log(this.index);
  const dialogRef = this.dialog.open(EditDialogComponent, {
    data: { position: position, name: name, weight: weight, symbol: symbol}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 1) {
      // When using an edit things are little different, firstly we find record inside DataService by id
      const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
      // Then you update that record using data from dialogData (values you enetered)
      this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
      // And lastly refresh table
      this.refreshTable();
    }
  });
}

deleteItem(i: number, position: number, name: string, weight: string, symbol: string) {
  this.index = i;
  // this.id = id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, {
    data: {name: name}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 1) {
      const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
      // for delete we use splice in order to remove single object from DataService
      this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
      this.refreshTable();
    }
  });
}


// If you don't need a filter or a pagination this can be simplified, you just use code from else block
private refreshTable() {
  // if there's a paginator active we're using it for refresh
  if (this.dataSource._paginator.hasNextPage()) {
    this.dataSource._paginator.nextPage();
    this.dataSource._paginator.previousPage();
    // in case we're on last page this if will tick
  } else if (this.dataSource._paginator.hasPreviousPage()) {
    this.dataSource._paginator.previousPage();
    this.dataSource._paginator.nextPage();
    // in all other cases including active filter we do it like this
  } else {
    this.dataSource.filter = '';
    this.dataSource.filter = this.filter.nativeElement.value;
  }
}

public loadData() {
  this.exampleDatabase = new DataService(this.httpClient);
  this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
  Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
}






  addPaciente(form?: NgForm) {
    console.log(form.value);
    if(form.value._id) {
      this.pacienteService.putPaciente(form.value)
        .subscribe(res => {
          this.resetForm(form);
          this.getPacientes();
          M.toast({html: 'Updated Successfully'});
        });
    } else {
      console.log("hago post")
      this.pacienteService.postPaciente(form.value)
      .subscribe(res => {
        console.log(res)
        this.getPacientes();
        this.resetForm(form);
        M.toast({html: 'Save successfully'});
      });
    }

  }



  editPaciente(paciente: Paciente) {
    this.pacienteService.selectedPaciente = paciente;
  }

  deletePaciente(_id: string, form: NgForm) {
    if(confirm('Are you sure you want to delete it?')) {
      this.pacienteService.deletePaciente(_id)
        .subscribe(res => {
          this.getPacientes();
          this.resetForm(form);
          M.toast({html: 'Deleted Succesfully'});
        });
    }
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.pacienteService.selectedPaciente = new Paciente();
    }
  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];


export class ExampleDataSource extends DataSource<Paciente> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Paciente[] = [];
  renderedData: Paciente[] = [];

  constructor(public _exampleDatabase: DataService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Paciente[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllIssues();

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((issue: Paciente) => {
        const searchStr = (issue.id + issue.title + issue.url + issue.created_at).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });
  }
  disconnect() {
  }
}
