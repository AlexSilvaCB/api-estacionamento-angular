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
import { Chart } from 'chart.js/auto';
import { InterDateReports } from '../interfacesCliAdmin/interDateReports';
import { DialogMsgComponent } from '../../shared/dialog-msg/dialog-msg.component';
import { MatDialog } from '@angular/material/dialog';

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

  #date = new Date();
  #date_mounth = this.#date.getMonth();
  #date_year = this.#date.getFullYear();
  #arrayMonth:string [] = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
  "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  chartBarra:any = [];
  chartPizza:any = [];
  chartBarra2:any = [];
  chartPizza2:any = [];

  contParkingVacancy = this.#apiService.getContParkingVacancy;

  constructor( public dialog: MatDialog){
    this.handlePageEventClients()
  }

  ngOnInit(): void {
    this.parkingChart()
    this.#apiService.contParkingVacancy().subscribe();
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

  parkingChart(){
    let month01: string = '';
    let month02: string = '';

    if(this.#date_mounth == 0){
       month01 = this.#arrayMonth[12 - 1]
       month02 = this.#arrayMonth[12 - 2]
    } else if(this.#date_mounth == 1){
      month01 = this.#arrayMonth[this.#date_mounth - 1]
      month02 = this.#arrayMonth[12 - 1]
    } else{
      month01 = this.#arrayMonth[this.#date_mounth - 2]
      month02 = this.#arrayMonth[this.#date_mounth - 1]
    }

    this.#apiService.parkingChart(this.FormDate()).subscribe({

        next: (resultService) =>{
          this.#relatorioGrafico1(resultService.dateGraphCount1, resultService.dateGraphCount2, month01, month02)
          this.#relatorioGrafico2(resultService.dateGraphSum1, resultService.dateGraphSum2, month01, month02)
    },
    error: (error) =>
      this.openDialog(error.error.message)})
  }

  FormDate(){
    let objDate: InterDateReports;

    if(this.#date_mounth == 0){
      this.#date_mounth = 12

      objDate = {
        data_inicio1: this.#date_year + "-" + this.#date_mounth +"-" + "01",
        data_inicio2: this.#date_year + "-" + this.#date_mounth + "-" + "31",
        data_inicio3: this.#date_year + "-" + `${this.#date_mounth - 1}` + "-" + "01",
        data_inicio4: this.#date_year + "-" + `${this.#date_mounth - 1}` + "-" + "31",
      }
      return objDate

    }else if (this.#date_mounth == 1){
      objDate = {
        data_inicio1: this.#date_year + "-" + "0" + this.#date_mounth +"-" + "01",
        data_inicio2: this.#date_year + "-" + "0" + this.#date_mounth + "-" + "31",
        data_inicio3: this.#date_year + "-" + 12 + "-" + "01",
        data_inicio4: this.#date_year + "-" + 12 + "-" + "31",
      }
      return objDate

    } else{
      objDate = {
        data_inicio1: this.#date_year + "-" + `${this.#date_mounth > 0 ? "0" + this.#date_mounth : this.#date_mounth}` +"-" + "01",
        data_inicio2: this.#date_year + "-" + `${this.#date_mounth > 0 ? "0" + this.#date_mounth : this.#date_mounth}` + "-" + "31",
        data_inicio3: this.#date_year + "-" + `${this.#date_mounth > 0 ? "0" + `${this.#date_mounth - 1}` : `${this.#date_mounth - 1}`}` + "-" + "01",
        data_inicio4: this.#date_year + "-" + `${this.#date_mounth > 0 ? "0" + `${this.#date_mounth - 1}` : `${this.#date_mounth - 1}`}` + "-" + "31",
      }
      return objDate
    }
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

 //MSG DE ERROR
 private openDialog(e:any) {
  this.dialog.open(DialogMsgComponent, {
    data: e
  });
}

  #relatorioGrafico1(cont1: number, cont2: number, month01: string, month02: string ){
    this.chartBarra =  new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['Estacionamentos Nº'],
        datasets: [{
          label: month01,
          data: [cont1],
          backgroundColor: '#0362fc',
          borderWidth: 1
        },
        {
          label: month02,
          data: [cont2],
          backgroundColor: '#fc035e',
          borderWidth: 1
      }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
  });

  this.chartPizza =  new Chart('canvasPz', {
    type: 'pie',
    data: {
      labels: [month01, month02],
      datasets: [{
        label: 'Estacionamentos Nº',
        data: [cont1, cont2],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

#relatorioGrafico2(value1: number, value2:number, month01: string, month02: string){

  this.chartBarra2 =  new Chart('canvas2', {
    type: 'bar',
    data: {
      labels: ['Estacionamento R$'],
      datasets: [{
        label:month01,
        data: [value1],
        backgroundColor: '#0362fc',
        borderWidth: 1
      },
      {
        label: month02,
        data: [value2],
        backgroundColor: '#fc035e',
        borderWidth: 1
      }
    ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  this.chartPizza2 =  new Chart('canvasPz2', {
    type: 'pie',
    data: {
      labels: [month01,  month02],
      datasets: [{
        label: 'Estacionamentos R$',
        data: [value1, value2],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}

}
