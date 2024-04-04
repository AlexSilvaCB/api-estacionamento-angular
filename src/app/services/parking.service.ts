import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, shareReplay, tap, throwError } from 'rxjs';
import { InterCustomerRegistration } from '../pages/interfacesCliAdmin/interCustomerRegistration';
import { InterAllParkingCustomer } from '../pages/interfacesCliAdmin/interAllParkingCustomer';
import { InterParkingCustomer } from '../pages/interfacesCliAdmin/interParkingCustomer';
import { InterResVagaRecibo } from '../pages/interfacesCliAdmin/interResVagaRecibo';
import { InterAdmClients } from '../pages/interfacesCliAdmin/interAdmClients';
import { InterAdmAllClients } from '../pages/interfacesCliAdmin/interAdmAllClients';
import { InterResParkingCheckin } from '../pages/interfacesCliAdmin/interResParkingCheckin';
import { InterResParkingCheckOut } from '../pages/interfacesCliAdmin/interResParkingCheckOut';
import { InterAdmVacancy } from '../pages/interfacesCliAdmin/interAdmVacancy';
import { InterClientDetails } from '../login/interfaces/interUserDetails';


@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  #http = inject(HttpClient)
  #url:string = "http://localhost:8080/api/v1"

  constructor() { }

  #setClientDetails = signal<InterClientDetails | null>(null)
  get getClientDetails(){
    return this.#setClientDetails.asReadonly();
  }
  #setErrorClientDetails = signal< HttpErrorResponse | null>(null)
  get getErrorClientDetails() {
    return this.#setErrorClientDetails.asReadonly();
  }
  public userDetails$(): Observable<InterClientDetails>{
    this.#setClientDetails.set(null);
    this.#setErrorClientDetails.set(null)
    return this.#http.get<InterClientDetails>(`${this.#url}/clients/details`).pipe(
      shareReplay(),
      tap((res)=> this.#setClientDetails.set(res)),
      catchError((error) =>{
        this.#setErrorClientDetails.set(error);
        console.log(error.status)
        return throwError(()=>error);
      })
    )};

  #setErrorUpdatePassword = signal< HttpErrorResponse | null>(null)
    get getErrorUpdatePassword() {
      return this.#setErrorUpdatePassword.asReadonly();
    }
    public updatePassword(id:number | null, record:Partial<{}>): Observable<void>{
      this.#setErrorUpdatePassword.set(null)
        return this.#http.patch<void>(`${this.#url}/users/${id}`, record).pipe(
          shareReplay(),
          tap((res)=> res),
          catchError((error) =>{
            this.#setErrorUpdatePassword.set(error)
            return throwError(()=>error);
          })
    )}

  #setInterCustomerRegistration = signal<InterCustomerRegistration | null>(null)
  get getInterCustomerRegistration(){
    return this.#setInterCustomerRegistration.asReadonly();
  }
  public createClient(record: Partial<{}>):Observable<InterCustomerRegistration> {
    this.#setInterCustomerRegistration.set(null);
    return this.#http.post<InterCustomerRegistration>(`${this.#url}/clients`, record).pipe(
      shareReplay(),
      tap((res)=> this.#setInterCustomerRegistration.set(res)),
      catchError((error) =>{
        return throwError(()=>error);
      })
  )}

  #setParkingCustomer = signal<InterParkingCustomer[]| null>(null)
  get getParkingCustomer(){
    return this.#setParkingCustomer.asReadonly();
  }
 #setAllParkingCustomer = signal<InterAllParkingCustomer| null>(null)
  get getAllParkingCustomer(){
    return this.#setAllParkingCustomer.asReadonly();
  }
  public listParkingClient(page = 0, size = 5):Observable<InterAllParkingCustomer> {
    this.#setParkingCustomer.set(null);
    return this.#http.get<InterAllParkingCustomer>(`${this.#url}/parking`,
    {params: {page, size}}).pipe(
      shareReplay(),
      tap((res)=> res),
      tap((res)=>{this.#setParkingCustomer.set(res.content)}),
      catchError((error) =>{
        return throwError(()=>error);
      })
  )}

  #setVagaReciboParking = signal<InterResVagaRecibo | null>(null)
  get getVagaReciboParking(){
    return this.#setVagaReciboParking.asReadonly();
  }
  getVagaRecibo(value: string | null) {
    this.#setVagaReciboParking.set(null)
    return this.#http.get<InterResVagaRecibo>(`${this.#url}/parking/check-in/${value}`).pipe(
      shareReplay(),
      tap((res)=> res),
      tap((res)=>{
        this.#setVagaReciboParking.set(res)
      }),
      catchError((error) =>{
        return throwError(()=>error);
      })
  )
  }

  //logica Cliente

  #setAdmCustomer = signal<InterAdmClients[]| null>(null)
  get getAdmCustomer(){
    return this.#setAdmCustomer.asReadonly();
  }
 #setAdmAllCustomer = signal<InterAdmAllClients| null>(null)
  get getAdmAllCustomer(){
    return this.#setAdmAllCustomer.asReadonly();
  }
  public listAdmClients(page = 0, size = 5):Observable<InterAdmAllClients> {
    this.#setAdmCustomer.set(null);
    return this.#http.get<InterAdmAllClients>(`${this.#url}/clients`,
    {params: {page, size}}).pipe(
      shareReplay(),
      tap((res)=> res),
      tap((res)=>{this.#setAdmCustomer.set(res.content)}),
      catchError((error) =>{
        return throwError(()=>error);
      })
  )}

  #setAdmCustomerCPF = signal<InterAdmClients[]| null>(null)
  get getAdmCustomerCPF(){
    return this.#setAdmCustomerCPF.asReadonly();
  }
 #setAdmAllCustomerCPF = signal<InterAdmAllClients| null>(null)
  get getAdmAllCustomerCPF(){
    return this.#setAdmAllCustomerCPF.asReadonly();
  }
  public listAdmClientsCPF(record:string | null, page = 0, size = 5):Observable<InterAdmAllClients> {
    this.#setAdmCustomerCPF.set(null);
    console.log(record)
    return this.#http.get<InterAdmAllClients>(`${this.#url}/parking/cpf/${record}`, {params: {page, size}}).pipe(
      shareReplay(),
      tap((res)=> res),
      tap((res)=>{this.#setAdmCustomerCPF.set(res.content)}),
      catchError((error) =>{
        return throwError(()=>error);
      })
  )}

  #setAdmCheckin = signal<InterResParkingCheckin | null>(null)
  get getAdmCheckin(){
    return this.#setAdmCheckin.asReadonly();
  }
  public CheckInAdm(record:Partial<{}>): Observable<InterResParkingCheckin>{
    this.#setAdmCheckin.set(null)
      return this.#http.post<InterResParkingCheckin>(`${this.#url}/parking/check-in`, record).pipe(
        shareReplay(),
        tap((res)=> res),
        catchError((error) =>{
          return throwError(()=>error);
        })
  )}

  #setAdmCheckOut = signal< InterResParkingCheckOut | null>(null)
  get getAdmCheckOut(){
    return this.#setAdmCheckOut.asReadonly();
  }
  public CheckOutAdm(record:string | null): Observable<InterResParkingCheckOut>{
      this.#setAdmCheckOut.set(null)
      return this.#http.put<InterResParkingCheckOut>(`${this.#url}/parking/check-out/${record}`, {}).pipe(
        shareReplay(),
        tap((res)=> res),
        tap((res)=> this.#setAdmCheckOut.set(res)),
        catchError((error) =>{
          return throwError(()=>error);
        })
  )}


  public createVacancy(record:{}): Observable<any>{
      return this.#http.post<any>(`${this.#url}/vacancy`, record).pipe(
        shareReplay(),
        tap((res)=> res),
        catchError((error) =>{
          return throwError(()=>error);
        })
  )}

  #setAdmByVagancy = signal<InterAdmVacancy | null>(null)
  get getAdmByVagancy(){
    return this.#setAdmByVagancy.asReadonly();
  }
  public byVacancy(record:string | null): Observable<InterAdmVacancy>{
      this.#setAdmByVagancy.set(null)
      return this.#http.get<InterAdmVacancy>(`${this.#url}/vacancy/${record}`).pipe(
        shareReplay(),
        tap((res)=> res),
        tap((res)=> this.#setAdmByVagancy.set(res)),
        catchError((error) =>{
          return throwError(()=>error);
        })
  )}
}
