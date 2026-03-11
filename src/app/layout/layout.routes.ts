import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'workflows',
        loadChildren: () =>
          import('../features/workflows/workflows.routes').then((m) => m.WORKFLOWS_ROUTES),
      },
    ],
  },
];
