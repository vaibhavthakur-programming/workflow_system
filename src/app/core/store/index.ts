import { workflowReducer } from './workflow/workflow.reducer';
import { authReducer } from './auth/auth.reducer';
import { loadWorkflows$, loadWorkflow$, createWorkflow$, updateWorkflow$, deleteWorkflow$ } from './workflow/workflow.effects';
import { login$, loginSuccess$, logout$ } from './auth/auth.effects';

export const appReducers = {
  workflow: workflowReducer,
  auth: authReducer,
};

// Functional effects must be provided as a record.
export const appEffects = {
  loadWorkflows$,
  loadWorkflow$,
  createWorkflow$,
  updateWorkflow$,
  deleteWorkflow$,
  login$,
  loginSuccess$,
  logout$,
};
