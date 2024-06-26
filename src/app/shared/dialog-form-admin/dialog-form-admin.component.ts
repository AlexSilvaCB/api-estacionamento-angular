import { Component, Inject, inject, signal } from '@angular/core';
import { FormControl,
         FormsModule,
         NonNullableFormBuilder,
         ReactiveFormsModule,
         Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {  MatDialogTitle,
          MatDialogContent,
          MatDialogActions,
          MatDialogClose,
          MatDialogRef,
          MAT_DIALOG_DATA,
          MatDialog} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar,
         MatSnackBarHorizontalPosition,
         MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';


import { DialogMsgComponent } from '../dialog-msg/dialog-msg.component';
import { MsgSuccessComponent } from '../msg-success/msg-success.component';
import { ParkingService } from '../../services/parking.service';
import { InterParkingCheckin } from '../../pages/interfacesCliAdmin/interParkingCheckin';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-dialog-form-admin',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatExpansionModule,
    MatIconModule,
    MatDatepickerModule,],
  templateUrl: './dialog-form-admin.component.html',
  styleUrl: './dialog-form-admin.component.scss'
})
export class DialogFormAdminComponent {
  #apiService = inject(ParkingService);
  #utilsService = inject(UtilsService);
  #fb = inject(NonNullableFormBuilder);

  step = 0;

  durationInSeconds = 5 ;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  getRelAdmCheckOut = this.#apiService.getAdmCheckOut;

  constructor(
    public dialogRef: MatDialogRef<DialogFormAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InterParkingCheckin,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  formCheckin = this.#fb.group({
    plate:['',[
      Validators.minLength(8),
      Validators.maxLength(8),
      Validators.pattern(/^([A-Z]{3}-[0-9]{4})$/),
      Validators.required]],
    brand: ['',[
      Validators.required]],
    model: ['',[
      Validators.required]],
    color: ['',[
        Validators.required]],
    clientCpf:['',[
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern(/^([0-9]{11})$/),
        Validators.required]],
  })

  #treatmentFormCheckin():InterParkingCheckin{
    let checkIn: InterParkingCheckin;

    checkIn = {
    plate: this.formCheckin.value.plate,
    brand:  this.formCheckin.value.brand,
    model: this.formCheckin.value.model,
    color: this.formCheckin.value.color,
    clientCpf: this.formCheckin.value.clientCpf,
    }
    return checkIn;
  }

  checkInAdm(){
    this.#apiService.CheckInAdm(this.#treatmentFormCheckin()).subscribe({
      next: (resultService) =>{
       this.openSnackBar("Check-in Realizado com sucesso")
       this.resetForms(1)
       this.#apiService.contParkingVacancy().subscribe()
       },
      error: (error) =>
      this.openDialog(error.error.message)
    })
  }

  formCheckOut = new FormControl("",[
    Validators.required,
    Validators.minLength(15),
    Validators.maxLength(15),
  ])

  checkOutAdm(){
  this.#apiService.CheckOutAdm(this.formCheckOut.value).subscribe({
      next: (resultService) =>{
       this.resetForms(2)
       this.#apiService.contParkingVacancy().subscribe()
       },
      error: (error) =>
      this.openDialog(error.error.message)
    })
  }

 calcTotalCheckOut(value1: number, value2: number):number{
    return value1 - value2
  }

 validateFieldsFormCheckin():boolean{
    return this.formCheckin.valid ? false : true
 }

 validateFieldsFormCheckOut():boolean{
  return this.formCheckOut.valid ? false : true
}

 resetForms(number: number){
  if(number == 1){
    this.formCheckin.reset()
  }

 if(number == 2){
    this.formCheckOut.reset()
  }
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


  onNoClick(): void {
    this.dialogRef.close();
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

  formatCurrency(value: number){
    return this.#utilsService.formatCurrency(value)
   }

   formatData(value: string){
    return this.#utilsService.formatData(value)
    }
}
