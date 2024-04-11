import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { InterAdmClients } from '../interfacesCliAdmin/interAdmClients';
import { HeaderCarComponent } from '../../shared/header-car/header-car.component';
import { ParkingService } from '../../services/parking.service';
import { UtilsService } from '../../services/utils.service';
import { NavCarAdminComponent } from '../../shared/nav-car-admin/nav-car-admin.component';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [HeaderCarComponent, NavCarAdminComponent, MatIconModule,MatFormFieldModule, MatInputModule,
    MatTableModule, MatSortModule, MatPaginatorModule, MatTabsModule, MatCardModule,  MatExpansionModule,
    MatButtonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss'
})
export class HomeAdminComponent implements OnInit{

  displayedColumns: string[] = ["id", "name", "cpf", "star"];
  _displayedColumns: string[] = ['vacancyCode', 'brand', 'model', 'plate', 'color', 'value', 'discount',
  'entryData', 'departureData', 'receipt', "star"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<InterAdmClients>();
  length:number = 0;
  pageSize:number = 5;
  pageIndex = 0;
  #apiService = inject(ParkingService);
  #utilsService = inject(UtilsService);

  _dataSource = new MatTableDataSource<InterAdmClients>();
  _length:number = 0
  _pageSize:number = 5
  _pageIndex = 0;

  step = 0;

  constructor(){
    this.handlePageEventClients()
  }

  ngOnInit(): void {
  }

  formClientCPF = new FormControl("",[
    Validators.required,
    Validators.minLength(11),
    Validators.maxLength(11),
  ])

  handlePageEventClients(event: PageEvent = {length:0, pageIndex:0, pageSize:5}) {
    this.#apiService.listAdmClients(event.pageIndex, event.pageSize).subscribe({
      next: (resultService) =>{
        this.dataSource.data = resultService.content
        this.length = resultService.totalElements
        this.pageSize = event.pageSize
        this.pageIndex = event.pageIndex
    }})
  }

  handlePageEventCPF(event: PageEvent = {length:0, pageIndex:0, pageSize:5}) {
    this.#apiService.listAdmClientsCPF(this.formClientCPF.value ,event.pageIndex, event.pageSize).subscribe({
      next: (resultService) =>{
        this._dataSource.data = resultService.content
        this._length = resultService.totalElements
        this._pageSize = event.pageSize
        this._pageIndex = event.pageIndex
    }})
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this._dataSource.filter = filterValue.trim().toLowerCase();
  }

  formatCnpjCpf(value:string){
  return this.#utilsService.formatCnpjCpf(value)
}

formatCurrency(value: number){
 return this.#utilsService.formatCurrency(value)
}

formatData(value: string){
return this.#utilsService.formatData(value)
}

setStep(index: number) {
  this.step = index;
}

nextStep() {
  this.step++;
}

prevStep() {
  this.step--;
}

}
