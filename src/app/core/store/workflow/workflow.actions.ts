import { createActionGroup, props } from '@ngrx/store';
import { Workflow } from '../../models/workflow.model';
import { WorkflowPage, WorkflowQuery } from '../../services/workflow';

export const WorkflowActions = createActionGroup({
  source: 'Workflow',
  events: {
    'Load Workflows': props<{ query?: WorkflowQuery }>(),
    'Load Workflows Success': props<{ page: WorkflowPage }>(),
    'Load Workflows Failure': props<{ error: string }>(),
    'Load Workflow': props<{ id: string }>(),
    'Load Workflow Success': props<{ workflow: Workflow }>(),
    'Load Workflow Failure': props<{ error: string }>(),
    'Create Workflow': props<{ workflow: Omit<Workflow, 'id'> }>(),
    'Create Workflow Success': props<{ workflow: Workflow }>(),
    'Create Workflow Failure': props<{ error: string }>(),
    'Update Workflow': props<{ workflow: Workflow }>(),
    'Update Workflow Success': props<{ workflow: Workflow }>(),
    'Update Workflow Failure': props<{ error: string }>(),
    'Delete Workflow': props<{ id: string }>(),
    'Delete Workflow Success': props<{ id: string }>(),
    'Delete Workflow Failure': props<{ error: string }>(),
  },
});
