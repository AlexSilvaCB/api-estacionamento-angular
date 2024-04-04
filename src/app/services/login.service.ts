import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, shareReplay, tap, throwError } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InterloginRegister } from '../login/interfaces/interLoginRegister';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  #loggedUser?: string;
  #isAuthenticatedSubject = new BehaviorSubject<boolean>(false);


  #http = inject(HttpClient)
  #router = inject(Router);
  #url:string = "http://localhost:8080/api/v1"

  constructor() { }

  public userLogin$(record: InterloginRegister, rl: number): Observable<InterloginRegister>{
    console.log(record)
    if (rl == 1) {
      return this.#http.post<InterloginRegister>(`${this.#url}/users`, record).pipe(
        shareReplay(),
        tap((res)=>(res)),
      );
    } else {
      return this.#http.post<InterloginRegister>(`${this.#url}/auth`, record).pipe(
        shareReplay(),
        tap((res)=>(res)),
        tap((tokens:any)=>
        this.#doLoginUser(record.username, tokens.token)
      ))
    };
  }

  #doLoginUser(username: string, token: any){
    this.#loggedUser = username;
    this.#storeJwtToken(token);
    this.#isAuthenticatedSubject.next(true);
  }

  #storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.#isAuthenticatedSubject.next(false);
    this.#router.navigate(['']);
  }
}
