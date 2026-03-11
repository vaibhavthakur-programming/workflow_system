import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { WorkflowActions } from '../../../../core/store/workflow/workflow.actions';
import { WorkflowFormComponent } from '../../components/workflow-form/workflow-form';

@Component({
  selector: 'app-workflow-create',
  imports: [WorkflowFormComponent],
  templateUrl: './workflow-create.html',
  styleUrl: './workflow-create.css',
})
export class WorkflowCreate {
  private store = inject(Store);
  private router = inject(Router);

  onSave(workflow: Partial<{ name: string; priority: string; status: string; assignedUsers: string[]; dueDate: Date }>): void {
    this.store.dispatch(
      WorkflowActions.createWorkflow({
        workflow: {
          name: workflow.name!,
          priority: workflow.priority as 'Low' | 'Medium' | 'High',
          status: workflow.status as 'Draft' | 'In Review' | 'Approved' | 'Rejected',
          assignedUsers: workflow.assignedUsers ?? [],
          dueDate: workflow.dueDate!,
        },
      })
    );
    this.router.navigate(['/app/workflows']);
  }

  onCancel(): void {
    this.router.navigate(['/app/workflows']);
  }
}
