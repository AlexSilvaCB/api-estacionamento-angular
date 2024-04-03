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

import { CarParkingService } from '../../services/car-parking.service';
import { InterAdmClients } from '../interfacesCliAdmin/interAdmClients';
import { HeaderCarComponent } from '../../../shared/header-car/header-car.component';
import { NavCarAdminComponent } from '../../../shared/nav-carAdmin/nav-car-admin.component';

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
  length:number = 0
  pageSize:number = 5
  pageIndex = 0;
  #apiService = inject(CarParkingService);

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
    const cnpjCpf = value.replace(/\D/g, '');

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
  }

  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
}

formatCurrency(value: number){
 return new Intl.NumberFormat('pt-BR',{style: 'currency', currency: 'BRL'}).format(value)
}

formatData(value: string){
const data = new Date(value)
return data.toLocaleDateString('pt-BR', {hour: "2-digit", minute: "2-digit"})
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
