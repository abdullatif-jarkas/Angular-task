import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layout/main-layout/main-layout').then(
        (m) => m.MainLayout
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'posts',
      },
      {
        path: 'posts',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/home/home').then((m) => m.Home),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/post-details/post-details').then(
                (m) => m.PostDetails
              ),
          },
        ],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'write',
        loadComponent: () =>
          import('./pages/write-post/write-post').then((m) => m.WritePost),
      },
      {
        path: 'saved',
        loadComponent: () =>
          import('./pages/saved/saved').then((m) => m.Saved),
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./shared/layout/auth-layout/auth-layout').then(
        (m) => m.AuthLayout
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login').then((m) => m.Login),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
