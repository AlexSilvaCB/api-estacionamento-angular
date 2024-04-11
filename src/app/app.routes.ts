import { Routes } from '@angular/router';
import { authGuardGuard, authGuardGuard_2 } from './guard/auth-guard.guard';

export const routes: Routes = [
  {
    path:'home',
    title: 'homeAdmin',
    loadComponent: ()=> import('./pages/homeAdmin/home-admin.component').then((p) =>(p.HomeAdminComponent)),
    canMatch: [authGuardGuard],
  },
  {
    path:'home',
    title: 'homeClient',
    loadComponent: ()=> import('./pages/homeClient/home-client.component').then((p) =>(p.HomeClientComponent)),
    canMatch: [authGuardGuard_2],
  },
  {
    path:'',
    title: 'loginCarPaking',
    loadComponent: () => import('./login/login.component').then((p) => p.LoginComponent),
  },
];
