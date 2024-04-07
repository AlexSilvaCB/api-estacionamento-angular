import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'home',
    title: 'homeAdmin',
    loadComponent: ()=> import('./carParkingModule/pages/home-admin/home-admin.component').then((p) =>(p.HomeAdminComponent)),
    canMatch: [authGuardGuard],
  },
  {
    path:'home',
    title: 'homeClient',
    loadComponent: ()=> import('./carParkingModule/pages/home-client/home-client.component').then((p) =>(p.HomeClientComponent)),
    canMatch: [authGuardGuard_2],
  },
  {
    path:'',
    title: 'loginCarPaking',
    loadComponent: () => import('./login/login.component').then((p) => p.LoginComponent),
  },
];
