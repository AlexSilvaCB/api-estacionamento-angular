import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

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
}
