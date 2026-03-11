import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { WorkflowActions } from '../../../../core/store/workflow/workflow.actions';
import {
  selectAllWorkflows,
  selectWorkflowLoading,
  selectWorkflowPage,
  selectWorkflowPageSize,
  selectWorkflowTotal,
  selectWorkflowError,
} from '../../../../core/store/workflow/workflow.selectors';
import { WorkflowListComponent } from '../../components/workflow-list/workflow-list';
import { WorkflowFiltersComponent } from '../../components/workflow-filters/workflow-filters';
import { WorkflowFilters } from '../../components/workflow-filters/workflow-filters';
import { ErrorBannerComponent } from '../../../../shared/error-banner/error-banner';

@Component({
  selector: 'app-workflow-list-page',
  imports: [CommonModule, WorkflowListComponent, WorkflowFiltersComponent, RouterLink, ErrorBannerComponent],
  templateUrl: './workflow-list.html',
  styleUrl: './workflow-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowListPage implements OnInit {
  private store = inject(Store);
  authService = inject(AuthService);

  workflows$ = this.store.select(selectAllWorkflows);
  loading$ = this.store.select(selectWorkflowLoading);
  error$ = this.store.select(selectWorkflowError);
  page$ = this.store.select(selectWorkflowPage);
  pageSize$ = this.store.select(selectWorkflowPageSize);
  total$ = this.store.select(selectWorkflowTotal);

  private currentFilters: WorkflowFilters = {
    status: '',
    search: '',
    dateFrom: undefined,
    dateTo: undefined,
    assignedUser: undefined,
  };

  private currentPage = 1;
  private readonly pageSize = 10;

  ngOnInit(): void {
    this.loadPage(1);
  }

  onFiltersChange(filters: WorkflowFilters): void {
    this.currentFilters = filters;
    this.loadPage(1);
  }

  onPageChange(page: number): void {
    this.loadPage(page);
  }

  onDelete(id: string): void {
    this.store.dispatch(WorkflowActions.deleteWorkflow({ id }));
  }

  canEdit(): boolean {
    return this.authService.hasAnyRole(['ADMIN', 'MANAGER']);
  }

  totalPages(total: number, pageSize: number): number {
    return Math.max(1, Math.ceil(total / pageSize));
  }

  private loadPage(page: number): void {
    this.currentPage = page;
    this.store.dispatch(
      WorkflowActions.loadWorkflows({
        query: {
          page,
          pageSize: this.pageSize,
          status: this.currentFilters.status || undefined,
          search: this.currentFilters.search || undefined,
          dateFrom: this.currentFilters.dateFrom
            ? new Date(this.currentFilters.dateFrom)
            : undefined,
          dateTo: this.currentFilters.dateTo ? new Date(this.currentFilters.dateTo) : undefined,
          assignedUser: this.currentFilters.assignedUser || undefined,
        },
      })
    );
  }
}
