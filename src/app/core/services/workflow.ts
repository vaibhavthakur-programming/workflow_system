import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workflow } from '../models/workflow.model';
import { MockApiService } from './mock-api';

export interface WorkflowQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  assignedUser?: string;
}

export interface WorkflowPage {
  items: Workflow[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  constructor(private mockApi: MockApiService) {}

  getWorkflows(query?: WorkflowQuery): Observable<WorkflowPage> {
    return this.mockApi.getWorkflows({
      page: query?.page,
      pageSize: query?.pageSize,
      status: query?.status,
      search: query?.search,
      dateFrom: query?.dateFrom?.toISOString(),
      dateTo: query?.dateTo?.toISOString(),
      assignedUser: query?.assignedUser,
    });
  }

  getWorkflowById(id: string): Observable<Workflow | undefined> {
    return this.mockApi.getWorkflowById(id);
  }

  createWorkflow(workflow: Omit<Workflow, 'id'>): Observable<Workflow> {
    return this.mockApi.createWorkflow(workflow);
  }

  updateWorkflow(workflow: Workflow): Observable<Workflow> {
    return this.mockApi.updateWorkflow(workflow);
  }

  deleteWorkflow(id: string): Observable<boolean> {
    return this.mockApi.deleteWorkflow(id);
  }

  checkWorkflowNameExists(name: string, excludeId?: string): Observable<boolean> {
    return this.mockApi.checkWorkflowNameExists(name, excludeId);
  }
}
