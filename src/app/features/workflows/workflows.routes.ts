import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role-guard';

export const WORKFLOWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/workflow-list/workflow-list').then((m) => m.WorkflowListPage),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/workflow-create/workflow-create').then((m) => m.WorkflowCreate),
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'MANAGER'] },
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/workflow-edit/workflow-edit').then((m) => m.WorkflowEdit),
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'MANAGER'] },
  },
];
