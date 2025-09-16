import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'posts',
  },
  {
    path: 'posts',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./pages/post-details/post-details').then((m) => m.PostDetails),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
