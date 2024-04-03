import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle} from '@angular/material/dialog';
import { InterResVagaRecibo } from '../../carParkingModule/pages/interfacesCliAdmin/interResVagaRecibo';
import { InterAdmVacancy } from '../../carParkingModule/pages/interfacesCliAdmin/interAdmVacancy';
@Component({
  selector: 'app-dialog-msg',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './dialog-msg.component.html',
  styleUrl: './dialog-msg.component.scss'
})
export class DialogMsgComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: InterResVagaRecibo,
  @Inject(MAT_DIALOG_DATA) public _data: InterAdmVacancy
  ) {}

formatCnpjCpf(value:string){
const cnpjCpf = value.replace(/\D/g, '');

if (cnpjCpf.length === 11) {
return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
}

return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
}

formatData(value: string){
const data = new Date(value)
return data.toLocaleDateString('pt-BR', {hour: "2-digit", minute: "2-digit"})
}
}
