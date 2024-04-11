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
import { HeaderCarComponent } from '../../shared/header-car/header-car.component';
import { ParkingService } from '../../services/parking.service';
import { UtilsService } from '../../services/utils.service';
import { NavCarClientComponent } from '../../shared/nav-car-client/nav-car-client.component';

@Component({
  selector: 'app-home-client',
  standalone: true,
  imports: [HeaderCarComponent,
    NavCarClientComponent,
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
  #utilsService = inject(UtilsService)
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
    return this.#utilsService.formatCnpjCpf(value)
}

formatCurrency(value: number){
  return this.#utilsService.formatCurrency(value)
 }

 formatData(value: string){
  return this.#utilsService.formatData(value)
  }

}
