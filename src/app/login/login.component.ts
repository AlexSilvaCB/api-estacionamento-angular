import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HeaderCarComponent } from '../shared/header-car/header-car.component';
import { LoginService } from '../services/login.service';
import { MsgSuccessComponent } from '../shared/msg-success/msg-success.component';
import { DialogMsgComponent } from '../shared/dialog-msg/dialog-msg.component';
import { InterloginRegister } from './interfaces/interLoginRegister';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            FormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatIconModule,
            MatButtonModule,
            HeaderCarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  #apiService = inject(LoginService);
  #router = inject(Router);
  #snackBar = inject(MatSnackBar);
  #fb = inject(NonNullableFormBuilder);

  durationInSeconds = 5;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  spinnerR: boolean = false
  spinnerL:boolean = false;
  cardLogReg:string = ""
  cardRegLog:string = ""

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
  }

  registerFormAndLogin = this.#fb.group({
    username:['', [
      Validators.pattern('^[a-z0-9.+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'),
      Validators.required]],
    password:['', [
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.required]]
  })


 validateFields():boolean{
   return this.registerFormAndLogin.valid ? false : true
}

userRegisterAndLogin(number: number){

  if(number == 1){
    this.spinnerR = true;
  }else{
    this.spinnerL = true;
  }

  this.#apiService.userLogin$(this.treatmentLoginRegistration(), number).subscribe({
  next: (resultService) =>
    this.onSuccess(resultService),
  error: (error: HttpErrorResponse) =>
    this.onError(error)});
}

treatmentLoginRegistration ():InterloginRegister{
    let formLoginRegister: InterloginRegister;
    return formLoginRegister = {
    username: this.registerFormAndLogin.value.username,
    password: this.registerFormAndLogin.value.password
  }
}

private onSuccess(res:any){
  if(res.role == "CLIENT"){
    this.spinnerR = false
    this.openSnackBar()
    this.resetInput()
    this.transitionRegLog()
  }
  this.#router.navigate(['/home'])
  this.spinnerL = false
}

private onError(msgError: HttpErrorResponse ){
  this.spinnerR = false
  this.spinnerL = false

  if(msgError.ok == false){
    const msgerror: string = "Falha de conexão com servidor ou falha de rede."
    this.openDialog(msgerror)
  }else{
    this.openDialog(msgError.error.message)
  }
}

private resetInput(){
    this.registerFormAndLogin.reset()
}

private openDialog(e:any) {
  this.dialog.open(DialogMsgComponent, {
    data: e
  });
}

 private openSnackBar() {
    this.#snackBar.openFromComponent(MsgSuccessComponent, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data:"Conta criada com sucesso!!!"
    });
  }

 transitionRegLog():void{
  this.cardRegLog = this.cardRegLog == "" ? "sign-up-mode" : "";
}

transitionRegLog2():void{
  this.cardLogReg = this.cardLogReg == "" ? "sign-up-mode2" : "";
}

}
