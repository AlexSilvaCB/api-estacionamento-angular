import { CanMatchFn } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { InterJWTRole } from '../login/interfaces/interJWTRole';

export const authGuardGuard: CanMatchFn = (route, segments) => {
  const token = localStorage.getItem('JWT_TOKEN');
  const decoded: InterJWTRole = jwtDecode(token!);
  const expire = new Date(decoded.exp * 1000)

  if(token && expire > new Date() && decoded.role.toString() == "ADMIN"){
    return true
  }
  return false;
};

export const authGuardGuard_2: CanMatchFn = (route, segments) => {
  const token = localStorage.getItem('JWT_TOKEN');
  const decoded: InterJWTRole = jwtDecode(token!);
  const expire = new Date(decoded.exp * 1000)

  if(token && expire > new Date() && decoded.role.toString() == "CLIENT"){
    return true
  }
  return false;
};
