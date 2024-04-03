import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    title: 'loginCarPaking',
    loadComponent: () => import('./login/login.component').then((p) => p.LoginComponent),
  },
];
