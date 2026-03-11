import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { Workflow } from '../../../../core/models/workflow.model';
import { WorkflowActions } from '../../../../core/store/workflow/workflow.actions';
import { selectSelectedWorkflow, selectWorkflowLoading } from '../../../../core/store/workflow/workflow.selectors';
import { WorkflowFormComponent } from '../../components/workflow-form/workflow-form';

@Component({
  selector: 'app-workflow-edit',
  imports: [CommonModule, WorkflowFormComponent],
  templateUrl: './workflow-edit.html',
  styleUrl: './workflow-edit.css',
})
export class WorkflowEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);

  workflow$ = this.store.select(selectSelectedWorkflow);
  loading$ = this.store.select(selectWorkflowLoading);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(WorkflowActions.loadWorkflow({ id }));
    }
  }

  onSave(workflow: Partial<{ name: string; priority: string; status: string; assignedUsers: string[]; dueDate: Date }>): void {
    this.store
      .select(selectSelectedWorkflow)
      .pipe(take(1))
      .subscribe((w) => {
        if (w) {
          this.store.dispatch(
            WorkflowActions.updateWorkflow({
              workflow: {
                ...w,
                name: workflow.name!,
                priority: workflow.priority as Workflow['priority'],
                status: workflow.status as Workflow['status'],
                assignedUsers: workflow.assignedUsers ?? [],
                dueDate: workflow.dueDate!,
              },
            })
          );
          this.router.navigate(['/app/workflows']);
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/app/workflows']);
  }
}
