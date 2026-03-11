import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WorkflowState } from './workflow.reducer';

export const selectWorkflowState = createFeatureSelector<WorkflowState>('workflow');

export const selectAllWorkflows = createSelector(selectWorkflowState, (state) => state.workflows);

export const selectSelectedWorkflow = createSelector(selectWorkflowState, (state) => state.selectedWorkflow);

export const selectWorkflowLoading = createSelector(selectWorkflowState, (state) => state.loading);

export const selectWorkflowError = createSelector(selectWorkflowState, (state) => state.error);

export const selectWorkflowPage = createSelector(selectWorkflowState, (state) => state.page);

export const selectWorkflowPageSize = createSelector(selectWorkflowState, (state) => state.pageSize);

export const selectWorkflowTotal = createSelector(selectWorkflowState, (state) => state.total);

export const selectWorkflowById = (id: string) =>
  createSelector(selectAllWorkflows, (workflows) => workflows.find((w) => w.id === id));
