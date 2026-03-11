import { createReducer, on } from '@ngrx/store';
import { Workflow } from '../../models/workflow.model';
import { WorkflowActions } from './workflow.actions';

export interface WorkflowState {
  workflows: Workflow[];
  selectedWorkflow: Workflow | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  lastCreatedTempId: string | null;
  lastUpdatedWorkflow: Workflow | null;
  lastRemovedWorkflow: Workflow | null;
  lastRemovedIndex: number | null;
}

export const initialState: WorkflowState = {
  workflows: [],
  selectedWorkflow: null,
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  total: 0,
  lastCreatedTempId: null,
  lastUpdatedWorkflow: null,
  lastRemovedWorkflow: null,
  lastRemovedIndex: null,
};

export const workflowReducer = createReducer(
  initialState,
  on(WorkflowActions.loadWorkflows, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WorkflowActions.loadWorkflowsSuccess, (state, { page }) => ({
    ...state,
    workflows: page.items,
    page: page.page,
    pageSize: page.pageSize,
    total: page.total,
    loading: false,
    error: null,
  })),
  on(WorkflowActions.loadWorkflowsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(WorkflowActions.loadWorkflow, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WorkflowActions.loadWorkflowSuccess, (state, { workflow }) => ({
    ...state,
    selectedWorkflow: workflow,
    loading: false,
    error: null,
  })),
  on(WorkflowActions.loadWorkflowFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(WorkflowActions.createWorkflow, (state, { workflow }) => {
    const tempId = `temp-${Date.now()}`;
    const tempWorkflow: Workflow = {
      ...workflow,
      id: tempId,
    };
    return {
      ...state,
      workflows: [...state.workflows, tempWorkflow],
      loading: true,
      error: null,
      lastCreatedTempId: tempId,
    };
  }),
  on(WorkflowActions.createWorkflowSuccess, (state, { workflow }) => ({
    ...state,
    workflows: state.lastCreatedTempId
      ? state.workflows.map((w) => (w.id === state.lastCreatedTempId ? workflow : w))
      : [...state.workflows, workflow],
    loading: false,
    error: null,
    lastCreatedTempId: null,
  })),
  on(WorkflowActions.createWorkflowFailure, (state, { error }) => ({
    ...state,
    workflows: state.lastCreatedTempId
      ? state.workflows.filter((w) => w.id !== state.lastCreatedTempId)
      : state.workflows,
    loading: false,
    error,
    lastCreatedTempId: null,
  })),
  on(WorkflowActions.updateWorkflow, (state, { workflow }) => {
    const existing = state.workflows.find((w) => w.id === workflow.id) ?? null;
    return {
      ...state,
      workflows: state.workflows.map((w) => (w.id === workflow.id ? workflow : w)),
      loading: true,
      error: null,
      lastUpdatedWorkflow: existing,
    };
  }),
  on(WorkflowActions.updateWorkflowSuccess, (state, { workflow }) => ({
    ...state,
    workflows: state.workflows.map((w) => (w.id === workflow.id ? workflow : w)),
    selectedWorkflow: state.selectedWorkflow?.id === workflow.id ? workflow : state.selectedWorkflow,
    loading: false,
    error: null,
    lastUpdatedWorkflow: null,
  })),
  on(WorkflowActions.updateWorkflowFailure, (state, { error }) => ({
    ...state,
    workflows:
      state.lastUpdatedWorkflow != null
        ? state.workflows.map((w) =>
            w.id === state.lastUpdatedWorkflow!.id ? state.lastUpdatedWorkflow! : w
          )
        : state.workflows,
    loading: false,
    error,
    lastUpdatedWorkflow: null,
  })),
  on(WorkflowActions.deleteWorkflow, (state, { id }) => {
    const index = state.workflows.findIndex((w) => w.id === id);
    const removed = index >= 0 ? state.workflows[index] : null;
    return {
      ...state,
      workflows: state.workflows.filter((w) => w.id !== id),
      loading: true,
      error: null,
      lastRemovedWorkflow: removed,
      lastRemovedIndex: index >= 0 ? index : null,
    };
  }),
  on(WorkflowActions.deleteWorkflowSuccess, (state, { id }) => ({
    ...state,
    workflows: state.workflows.filter((w) => w.id !== id),
    selectedWorkflow: state.selectedWorkflow?.id === id ? null : state.selectedWorkflow,
    loading: false,
    error: null,
    lastRemovedWorkflow: null,
    lastRemovedIndex: null,
  })),
  on(
    WorkflowActions.deleteWorkflowFailure,
    (state, { error }) => ({
      ...state,
      workflows:
        state.lastRemovedWorkflow && state.lastRemovedIndex != null
          ? [
              ...state.workflows.slice(0, state.lastRemovedIndex),
              state.lastRemovedWorkflow,
              ...state.workflows.slice(state.lastRemovedIndex),
            ]
          : state.workflows,
      loading: false,
      error,
      lastRemovedWorkflow: null,
      lastRemovedIndex: null,
    })
  )
);
