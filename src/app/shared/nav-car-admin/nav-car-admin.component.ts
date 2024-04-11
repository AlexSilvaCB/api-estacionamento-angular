import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';

import { DialogMsgComponent } from '../dialog-msg/dialog-msg.component';
import { MsgSuccessComponent } from '../msg-success/msg-success.component';
import { ParkingService } from '../../services/parking.service';
import { DialogFormAdminComponent } from '../dialog-form-admin/dialog-form-admin.component';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-nav-car-admin',
  standalone: true,
  imports: [MatSidenavModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatToolbarModule],
  templateUrl: './nav-car-admin.component.html',
  styleUrl: './nav-car-admin.component.scss'
})
export class NavCarAdminComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  showFiller = false;
  #apiService = inject(ParkingService);
  #logoutService = inject(LoginService);
  #fb = inject(NonNullableFormBuilder);

  getErrorDetails = this.#apiService.getErrorClientDetails

  durationInSeconds = 5 ;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {}

   formCreateVacancy = this.#fb.group({
    code: ['', [
      Validators.required,
      Validators.minLength(4)]],
    status: ['', [
        Validators.required,
      ]]
   })

   formByVacancy = new FormControl(null, [Validators.required, Validators.minLength(4)])

   createVacancy(){
   this.#apiService.createVacancy(this.formCreateVacancy.value).subscribe({
    next: (resultService) =>{
     this.openSnackBar("Vaga Criada com sucesso!!!")
     this.resetForms(2)
     },
    error: (error) =>
    this.openDialog(error.error.message)
  })
  }

  byVacancy(){
    this.#apiService.byVacancy(this.formByVacancy.value).subscribe({
     next: (resultService) =>{
      this.openDialog(resultService)
      this.resetForms(1)
      },
     error: (error) =>{
     this.openDialog(error.error.message)}
   })
   }

  formVagaRecibo = new FormControl('', [Validators.required,
                                        Validators.minLength(15),
                                        Validators.maxLength(15)])

getVagaRecibo(){
  this.#apiService.getVagaRecibo(this.formVagaRecibo.value).subscribe({
    next: (resultService) =>(
    this.openDialog(resultService)),
    error: (error) =>
    this.openDialog(error.error.message)
  })
}

  validateFieldsVagaRecibo():boolean{
    return this.formVagaRecibo.valid ? false : true
  }

  validateFieldsVagaCreate():boolean{
    return this.formCreateVacancy.valid ? false : true
  }

  validateFieldsByVaga():boolean{
    return this.formByVacancy.valid ? false : true
  }

  //MSG DE ERROR E sUCESSO
  private openDialog(e:any) {
    this.dialog.open(DialogMsgComponent, {
      data: e
    });
  }

  //MSG SUCESSO
  private openSnackBar(snack:string ) {
     this ._snackBar.openFromComponent(MsgSuccessComponent, {
      data: snack,
      horizontalPosition : this.horizontalPosition,
      verticalPosition : this.verticalPosition,
      duration: this.durationInSeconds * 1000
     })
  }

  openDialogNavAdm(): void {
    const dialogRef = this.dialog.open(DialogFormAdminComponent, {
    });
  }

  resetForms(number: number){
    if(number == 1){
      this.formByVacancy.reset()
    }else{
      this.formCreateVacancy.reset()
    }
  }

  logout(){
    this.#logoutService.logout();
  }

}
