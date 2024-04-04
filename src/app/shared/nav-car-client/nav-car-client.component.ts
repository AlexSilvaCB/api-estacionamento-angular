import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';

import { MsgSuccessComponent } from '../msg-success/msg-success.component';
import { DialogMsgComponent } from '../dialog-msg/dialog-msg.component';
import { ParkingService } from '../../services/parking.service';


@Component({
  selector: 'app-nav-car-client',
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
  templateUrl: './nav-car-client.component.html',
  styleUrl: './nav-car-client.component.scss'
})
export class NavCarClientComponent implements OnInit{
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  showFiller = false;
  #apiService = inject(ParkingService);
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

   formIdUpdate = new FormControl(null, [Validators.required, Validators.minLength(1)])

   formUpdatePassword = this.#fb.group({
    currentPassword: ['',[
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.required]],
    newPassword: ['',[
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.required]],
    confirmPassword: ['',[
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.required]],
  })

  passwordUpdate(){
   this.#apiService.updatePassword(this.formIdUpdate.value, this.formUpdatePassword.value).subscribe({
    next: (resultService) =>{
     this.openSnackBar("Senha Atualizada com sucesso!!!")
     this.resetForms(1)
     },
    error: (error) =>
    this.openDialog(error.error.message)
  })
  }

  formCreateClient = this.#fb.group({
    name:['', Validators.required],
    cpf:['', [Validators.required, Validators.pattern(/^([0-9]{11})$/)]]
  })

  customerRegistration(){
    this.#apiService.createClient(this.formCreateClient.value).subscribe({
      next: (resultService) =>{
        this.openSnackBar("Cadastro realizado com sucesso!!!")
        this.resetForms(2)
        this.#apiService.userDetails$().subscribe()
        this.closeForm()
        this.enableFormsCreateClient()
        },
       error: (error) =>
       this.openDialog(error.error.message)
     })
  }

  //Tratamento ERROR gerar arquivo
  allParkingClientPDF(){}

  formVagaRecibo = new FormControl('', [Validators.required,
                                        Validators.minLength(15),
                                        Validators.maxLength(15)])

getVagaRecibo(){
  this.#apiService.getVagaRecibo(this.formVagaRecibo.value).subscribe({
    next: (resultService) =>{console.log(resultService)
    this.openDialog(resultService)
    },
    error: (error) =>
    this.openDialog(error.error.message)
  })
}

  enableFormsCreateClient():boolean{
    return this.getErrorDetails()?.status == 401 && this.getErrorDetails()?.statusText =="OK" ? false : true
  }

  validateFieldsUpdatePass():boolean{
     return this.formUpdatePassword.valid && this.formIdUpdate.valid ? false : true
  }

  validateFieldsCreateClient():boolean{
    return this.formCreateClient.valid? false : true
  }

  validateFieldsVagaRecibo():boolean{
    return this.formVagaRecibo.valid ? false : true
  }

  //MSG DE ERROR
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

  resetForms(number: number){
    if(number == 1){
      this.formUpdatePassword.reset()
      this.formIdUpdate.reset()
    }

    if(number == 2){
      this.formCreateClient.reset()
    }
  }

  closeForm(){
   let close = document.getElementById('closePanel')
    close?.click()
  }

  logout(){
    this.#apiService.logout()
  }

}
