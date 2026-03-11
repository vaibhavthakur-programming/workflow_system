import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Workflow } from '../../../core/models/workflow.model';
import { WorkflowActions } from '../../../core/store/workflow/workflow.actions';
import {
  selectAllWorkflows,
  selectWorkflowLoading,
} from '../../../core/store/workflow/workflow.selectors';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private store = inject(Store);

  workflows$ = this.store.select(selectAllWorkflows);
  loading$ = this.store.select(selectWorkflowLoading);

  // ngx-charts configuration
  readonly view: [number, number] = [800, 320];
  readonly showXAxis = true;
  readonly showYAxis = true;
  readonly showLegend = false;
  readonly showXAxisLabel = true;
  readonly xAxisLabel = 'Status';
  readonly showYAxisLabel = true;
  readonly yAxisLabel = 'Workflows';
  readonly gradient = false;
  readonly colorScheme = 'vivid';

  getStats = getWorkflowStats;

  ngOnInit(): void {
    this.store.dispatch(
      WorkflowActions.loadWorkflows({
        query: { page: 1, pageSize: 1000 },
      })
    );
  }
}

function getWorkflowStats(workflows: Workflow[]) {
  const now = new Date();

  const draft = workflows.filter((w) => w.status === 'Draft').length;
  const inReview = workflows.filter((w) => w.status === 'In Review').length;
  const approved = workflows.filter((w) => w.status === 'Approved').length;
  const rejected = workflows.filter((w) => w.status === 'Rejected').length;

  const overdue = workflows.filter(
    (w) => w.dueDate instanceof Date && w.dueDate.getTime() < now.getTime()
  ).length;

  const completed = workflows.filter(
    (w) =>
      (w.status === 'Approved' || w.status === 'Rejected') &&
      w.createdAt instanceof Date &&
      w.updatedAt instanceof Date &&
      w.updatedAt.getTime() >= w.createdAt.getTime()
  );

  const avgCompletionDays =
    completed.length > 0
      ? completed.reduce((sum, w) => {
          const diffMs = w.updatedAt!.getTime() - w.createdAt!.getTime();
          return sum + diffMs / (1000 * 60 * 60 * 24);
        }, 0) / completed.length
      : 0;

  return {
    total: workflows.length,
    draft,
    inReview,
    approved,
    rejected,
    overdue,
    avgCompletionDays,
    chartData: [
      { name: 'Draft', value: draft },
      { name: 'In Review', value: inReview },
      { name: 'Approved', value: approved },
      { name: 'Rejected', value: rejected },
    ],
  };
}
