import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { WorkflowEdit } from './workflow-edit';
import { WorkflowActions } from '../../../../core/store/workflow/workflow.actions';
import { Workflow } from '../../../../core/models/workflow.model';

describe('WorkflowEdit', () => {
  let component: WorkflowEdit;
  let fixture: ComponentFixture<WorkflowEdit>;
  let storeSpy: jasmine.SpyObj<Store<unknown>>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj<Store<unknown>>('Store', ['dispatch', 'select']);
    // default select result for workflow$ / loading$
    storeSpy.select.and.returnValue(of(null));

    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (_: string) => '123',
        },
      },
    } as Partial<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [WorkflowEdit],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowEdit);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadWorkflow on init with route id', () => {
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      WorkflowActions.loadWorkflow({ id: '123' })
    );
  });

  it('should dispatch updateWorkflow and navigate on save when selected workflow exists', () => {
    const existing: Workflow = {
      id: '123',
      name: 'Old',
      priority: 'Low',
      status: 'Draft',
      assignedUsers: [],
      dueDate: new Date(),
    };

    storeSpy.select.and.returnValue(of(existing));

    const updated = {
      name: 'Updated',
      priority: 'High',
      status: 'Approved',
      assignedUsers: ['Bob'],
      dueDate: new Date(),
    };

    component.onSave(updated);

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      WorkflowActions.updateWorkflow({
        workflow: {
          ...existing,
          name: updated.name!,
          priority: updated.priority as Workflow['priority'],
          status: updated.status as Workflow['status'],
          assignedUsers: updated.assignedUsers ?? [],
          dueDate: updated.dueDate!,
        },
      })
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/app/workflows']);
  });

  it('should navigate back on cancel', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/app/workflows']);
  });
});

