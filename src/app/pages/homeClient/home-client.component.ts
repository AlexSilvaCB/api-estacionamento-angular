import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

import { InterParkingCustomer } from './../interfacesCliAdmin/interParkingCustomer';
import { NavCarComponent } from '../../../shared/nav-carClient/nav-car.component';
import { HeaderCarComponent } from '../../shared/header-car/header-car.component';
import { ParkingService } from '../../services/parking.service';

@Component({
  selector: 'app-home-client',
  standalone: true,
  imports: [HeaderCarComponent,
    NavCarComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCardModule],
  templateUrl: './home-client.component.html',
  styleUrl: './home-client.component.scss'
})
export class HomeClientComponent implements OnInit{
  displayedColumns: string[] = ['vacancyCode', 'brand', 'model', 'plate', 'color', 'value', 'discount',
  'entryData', 'departureData', 'receipt', "star"];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<InterParkingCustomer>();
  length:number = 0
  pageSize:number = 5
  pageIndex = 0;
  #apiService = inject(ParkingService);
  getDetails = this.#apiService.getClientDetails;
  getAllParkingCustomer = this.#apiService.getAllParkingCustomer;
  getParkingCustomer = this.#apiService.getParkingCustomer;

  constructor(){
    this.handlePageEvent()
  }

  ngOnInit(): void {
    this.#apiService.userDetails$().subscribe()
  }

  handlePageEvent(event: PageEvent = {length:0, pageIndex:0, pageSize:5}) {
    this.#apiService.listParkingClient(event.pageIndex, event.pageSize).subscribe({
      next: (resultService) =>{
        this.dataSource.data = resultService.content
        this.length = resultService.totalElements
        this.pageSize = event.pageSize
        this.pageIndex = event.pageIndex
    }})
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  formatCnpjCpf(value:string){
    const cnpjCpf = value.replace(/\D/g, '');

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
  }

  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
}

formatCurrency(value: number){

  if(value == undefined){
    return null
  }
  return new Intl.NumberFormat('pt-BR',{style: 'currency', currency: 'BRL'}).format(value)
 }

 formatData(value: string){
  const data = new Date(value)
  if(data.toString() == 'Invalid Date'){
  return null
  }
  return data.toLocaleDateString('pt-BR', {hour: "2-digit", minute: "2-digit"})
  }

}
