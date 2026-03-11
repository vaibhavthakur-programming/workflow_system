import {
  Component,
  input,
  output,
  inject,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Workflow } from '../../../../core/models/workflow.model';
import { WorkflowService } from '../../../../core/services/workflow';
import { map, debounceTime } from 'rxjs';

@Component({
  selector: 'app-workflow-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workflow-form.html',
  styleUrl: './workflow-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowFormComponent {
  private fb = inject(FormBuilder);
  private workflowService = inject(WorkflowService);

  workflow = input<Workflow | null>(null);
  saveClick = output<Partial<Workflow>>();
  cancelClick = output<void>();

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)], [this.uniqueNameValidator()]],
    priority: ['Medium' as Workflow['priority'], Validators.required],
    status: ['Draft' as Workflow['status'], Validators.required],
    assignedUsers: [''],
    dueDate: [new Date().toISOString().split('T')[0], Validators.required],
  });

  private excludeId: string | undefined;

  constructor() {
    effect(() => {
      const w = this.workflow();
      if (w) {
        this.excludeId = w.id;
        this.form.patchValue({
          name: w.name,
          priority: w.priority,
          status: w.status,
          assignedUsers: w.assignedUsers.join(', '),
          dueDate: new Date(w.dueDate).toISOString().split('T')[0],
        });
      }
    });
  }

  private uniqueNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.workflowService
        .checkWorkflowNameExists(control.value, this.excludeId)
        .pipe(
          debounceTime(500),
          map((exists) => (exists ? { uniqueName: true } : null))
        );
    };
  }

  onSubmit(): void {
    if (this.form.valid) {
      const v = this.form.getRawValue();
      const assignedUsers = v.assignedUsers
        ? v.assignedUsers.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      this.saveClick.emit({
        name: v.name,
        priority: v.priority,
        status: v.status,
        assignedUsers,
        dueDate: new Date(v.dueDate),
      });
    }
  }

  onCancel(): void {
    this.cancelClick.emit();
  }
}
