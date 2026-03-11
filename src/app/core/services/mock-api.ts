import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { faker } from '@faker-js/faker';
import { Workflow } from '../models/workflow.model';
import { User } from '../models/user.model';

const MOCK_USERS: User[] = [
  { id: '1', email: 'admin@test.com', name: 'Admin', role: 'ADMIN' },
  { id: '2', email: 'manager@test.com', name: 'Manager', role: 'MANAGER' },
  { id: '3', email: 'user@test.com', name: 'User', role: 'USER' },
];

const WORKFLOWS_KEY = 'workflow_mock_data';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  private workflows: Workflow[] = [];

  constructor() {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(WORKFLOWS_KEY) : null;

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as any[];
        this.workflows = parsed.map((w) => ({
          ...w,
          dueDate: new Date(w.dueDate),
          createdAt: w.createdAt ? new Date(w.createdAt) : undefined,
          updatedAt: w.updatedAt ? new Date(w.updatedAt) : undefined,
        }));
      } catch {
        this.initializeWithFakeData();
      }
    } else {
      this.initializeWithFakeData();
    }
  }

  private initializeWithFakeData(): void {
    faker.seed(123);
    this.generateFakeData();
    this.persist();
  }

  private generateFakeData(): void {
    for (let i = 0; i < 50; i++) {
      this.workflows.push({
        id: faker.string.uuid(),
        name: faker.company.name(),
        priority: faker.helpers.arrayElement(['Low', 'Medium', 'High']) as Workflow['priority'],
        status: faker.helpers.arrayElement(['Draft', 'In Review', 'Approved', 'Rejected']) as Workflow['status'],
        assignedUsers: [faker.person.firstName()],
        dueDate: faker.date.future(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }
  }

  private persist(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const serializable = this.workflows.map((w) => ({
      ...w,
      dueDate: w.dueDate.toISOString(),
      createdAt: w.createdAt ? w.createdAt.toISOString() : undefined,
      updatedAt: w.updatedAt ? w.updatedAt.toISOString() : undefined,
    }));
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(serializable));
  }

  getWorkflows(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    assignedUser?: string;
  }): Observable<{ items: Workflow[]; total: number; page: number; pageSize: number }> {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const status = params?.status?.trim();
    const search = params?.search?.trim().toLowerCase();
    const dateFrom = params?.dateFrom ? new Date(params.dateFrom) : undefined;
    const dateTo = params?.dateTo ? new Date(params.dateTo) : undefined;
    const assignedUser = params?.assignedUser?.trim().toLowerCase();

    let filtered = [...this.workflows];

    if (status) {
      filtered = filtered.filter((w) => w.status === status);
    }

    if (search) {
      filtered = filtered.filter((w) => w.name.toLowerCase().includes(search));
    }

    if (dateFrom) {
      filtered = filtered.filter((w) => w.dueDate >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter((w) => w.dueDate <= dateTo);
    }

    if (assignedUser) {
      filtered = filtered.filter((w) =>
        w.assignedUsers.some((u) => u.toLowerCase() === assignedUser)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = filtered.slice(start, end);

    return of({ items, total, page, pageSize }).pipe(delay(500));
  }

  getWorkflowById(id: string): Observable<Workflow | undefined> {
    const workflow = this.workflows.find((w) => w.id === id);
    return of(workflow ? { ...workflow } : undefined).pipe(delay(300));
  }

  createWorkflow(workflow: Omit<Workflow, 'id'>): Observable<Workflow> {
    const newWorkflow: Workflow = {
      ...workflow,
      id: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.workflows.push(newWorkflow);
    this.persist();
    return of(newWorkflow).pipe(delay(500));
  }

  updateWorkflow(workflow: Workflow): Observable<Workflow> {
    const index = this.workflows.findIndex((w) => w.id === workflow.id);
    if (index >= 0) {
      this.workflows[index] = {
        ...workflow,
        updatedAt: new Date(),
      };
      this.persist();
      return of(this.workflows[index]).pipe(delay(500));
    }
    return of(workflow).pipe(delay(500));
  }

  deleteWorkflow(id: string): Observable<boolean> {
    this.workflows = this.workflows.filter((w) => w.id !== id);
    this.persist();
    return of(true).pipe(delay(500));
  }

  checkWorkflowNameExists(name: string, excludeId?: string): Observable<boolean> {
    const exists = this.workflows.some(
      (w) => w.name.toLowerCase() === name.toLowerCase() && w.id !== excludeId
    );
    return of(exists).pipe(delay(500));
  }

  getMockUsers(): User[] {
    return MOCK_USERS;
  }

  login(email: string, password: string): Observable<User | null> {
    const user = MOCK_USERS.find((u) => u.email === email);
    if (user) {
      return of({ ...user, token: faker.string.uuid() }).pipe(delay(500));
    }
    return of(null).pipe(delay(500));
  }
}
