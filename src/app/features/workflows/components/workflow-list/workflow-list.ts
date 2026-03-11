import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Workflow } from '../../../../core/models/workflow.model';

@Component({
  selector: 'app-workflow-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './workflow-list.html',
  styleUrl: './workflow-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowListComponent {
  workflows = input.required<Workflow[]>();
  canEdit = input<boolean>(false);

  deleteWorkflow = output<string>();

  trackByWorkflow(_: number, w: Workflow): string {
    return w.id;
  }

  onDelete(id: string): void {
    this.deleteWorkflow.emit(id);
  }
}
