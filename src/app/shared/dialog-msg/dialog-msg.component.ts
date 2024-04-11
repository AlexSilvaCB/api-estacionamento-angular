import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle} from '@angular/material/dialog';
import { InterResVagaRecibo } from '../../pages/interfacesCliAdmin/interResVagaRecibo';
import { InterAdmVacancy } from '../../pages/interfacesCliAdmin/interAdmVacancy';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-dialog-msg',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './dialog-msg.component.html',
  styleUrl: './dialog-msg.component.scss'
})
export class DialogMsgComponent {
  #utilsService = inject(UtilsService)

  constructor(@Inject(MAT_DIALOG_DATA) public data: InterResVagaRecibo,
  @Inject(MAT_DIALOG_DATA) public _data: InterAdmVacancy
  ) {}

formatCnpjCpf(value:string){
  return this.#utilsService.formatCnpjCpf(value);
}

formatData(value: string){
return this.#utilsService.formatData(value);
}

}
