import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of, retry } from 'rxjs';
import { WorkflowService } from '../../services/workflow';
import { WorkflowActions } from './workflow.actions';

export const loadWorkflows$ = createEffect(
  (actions$ = inject(Actions), workflowService = inject(WorkflowService)) =>
    actions$.pipe(
      ofType(WorkflowActions.loadWorkflows),
      switchMap(({ query }) =>
        workflowService.getWorkflows(query).pipe(
          retry(1),
          map((page) => WorkflowActions.loadWorkflowsSuccess({ page })),
          catchError((error) => of(WorkflowActions.loadWorkflowsFailure({ error: error.message })))
        )
      )
    ),
  { functional: true }
);

export const loadWorkflow$ = createEffect(
  (actions$ = inject(Actions), workflowService = inject(WorkflowService)) =>
    actions$.pipe(
      ofType(WorkflowActions.loadWorkflow),
      switchMap(({ id }) =>
        workflowService.getWorkflowById(id).pipe(
          retry(1),
          map((workflow) => {
            if (workflow) {
              return WorkflowActions.loadWorkflowSuccess({ workflow });
            }
            return WorkflowActions.loadWorkflowFailure({ error: 'Workflow not found' });
          }),
          catchError((error) => of(WorkflowActions.loadWorkflowFailure({ error: error.message })))
        )
      )
    ),
  { functional: true }
);

export const createWorkflow$ = createEffect(
  (actions$ = inject(Actions), workflowService = inject(WorkflowService)) =>
    actions$.pipe(
      ofType(WorkflowActions.createWorkflow),
      switchMap(({ workflow }) =>
        workflowService.createWorkflow(workflow).pipe(
          retry(1),
          map((created) => WorkflowActions.createWorkflowSuccess({ workflow: created })),
          catchError((error) => of(WorkflowActions.createWorkflowFailure({ error: error.message })))
        )
      )
    ),
  { functional: true }
);

export const updateWorkflow$ = createEffect(
  (actions$ = inject(Actions), workflowService = inject(WorkflowService)) =>
    actions$.pipe(
      ofType(WorkflowActions.updateWorkflow),
      switchMap(({ workflow }) =>
        workflowService.updateWorkflow(workflow).pipe(
          retry(1),
          map((updated) => WorkflowActions.updateWorkflowSuccess({ workflow: updated })),
          catchError((error) => of(WorkflowActions.updateWorkflowFailure({ error: error.message })))
        )
      )
    ),
  { functional: true }
);

export const deleteWorkflow$ = createEffect(
  (actions$ = inject(Actions), workflowService = inject(WorkflowService)) =>
    actions$.pipe(
      ofType(WorkflowActions.deleteWorkflow),
      switchMap(({ id }) =>
        workflowService.deleteWorkflow(id).pipe(
          retry(1),
          map(() => WorkflowActions.deleteWorkflowSuccess({ id })),
          catchError((error) => of(WorkflowActions.deleteWorkflowFailure({ error: error.message })))
        )
      )
    ),
  { functional: true }
);
