import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

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
        canActivate: [authGuard],
        data: { roles: ['admin', 'user'] },
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./pages/user-page/user-page').then((m) => m.UserPage),
        canActivate: [authGuard],
        data: { roles: ['admin', 'user'] },
      },
      {
        path: 'write',
        loadComponent: () =>
          import('./pages/write-post/write-post').then((m) => m.WritePost),
        canActivate: [authGuard],
        data: { roles: ['admin', 'user'] },
      },
      {
        path: 'posts/edit/:id',
        loadComponent: () =>
          import('./pages/write-post/write-post').then((m) => m.WritePost),
      },
      {
        path: 'saved',
        loadComponent: () => import('./pages/saved/saved').then((m) => m.Saved),
        canActivate: [authGuard],
        data: { roles: ['admin', 'user'] },
      },
      {
        path: 'top-authors',
        loadComponent: () =>
          import('./pages/top-authors/top-authors').then((m) => m.TopAuthors),
      },
      {
        path: 'popular',
        loadComponent: () =>
          import('./pages/popular/popular').then((m) => m.Popular),
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
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./pages/signup/signup').then((m) => m.Signup),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
