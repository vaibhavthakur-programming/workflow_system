import { Component, output, signal, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MockApiService } from '../../../../core/services/mock-api';

export interface WorkflowFilters {
  status: string;
  search: string;
  dateFrom?: string;
  dateTo?: string;
  assignedUser?: string;
}

@Component({
  selector: 'app-workflow-filters',
  imports: [CommonModule],
  templateUrl: './workflow-filters.html',
  styleUrl: './workflow-filters.css',
})
export class WorkflowFiltersComponent implements OnInit {
  filtersChange = output<WorkflowFilters>();

  status = signal('');
  search = signal('');
  dateFrom = signal<string | undefined>(undefined);
  dateTo = signal<string | undefined>(undefined);
  assignedUser = signal<string | undefined>(undefined);

  private readonly mockApi = inject(MockApiService);
  private readonly destroyRef = inject(DestroyRef);
  readonly availableUsers = this.mockApi.getMockUsers();

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.search.set(value);
        this.emitFilters();
      });

    this.emitFilters();
  }

  onStatusChange(value: string): void {
    this.status.set(value);
    this.emitFilters();
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  onDateFromChange(value: string): void {
    this.dateFrom.set(value || undefined);
    this.emitFilters();
  }

  onDateToChange(value: string): void {
    this.dateTo.set(value || undefined);
    this.emitFilters();
  }

  onAssignedUserChange(value: string): void {
    this.assignedUser.set(value || undefined);
    this.emitFilters();
  }

  private emitFilters(): void {
    this.filtersChange.emit({
      status: this.status(),
      search: this.search(),
      dateFrom: this.dateFrom(),
      dateTo: this.dateTo(),
      assignedUser: this.assignedUser(),
    });
  }
}
