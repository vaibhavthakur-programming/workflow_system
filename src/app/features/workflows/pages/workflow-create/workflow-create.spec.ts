import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { WorkflowCreate } from './workflow-create';
import { WorkflowActions } from '../../../../core/store/workflow/workflow.actions';

describe('WorkflowCreate', () => {
  let component: WorkflowCreate;
  let fixture: ComponentFixture<WorkflowCreate>;
  let storeSpy: jasmine.SpyObj<Store<unknown>>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj<Store<unknown>>('Store', ['dispatch']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [WorkflowCreate],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch createWorkflow and navigate on save', () => {
    const payload = {
      name: 'Test WF',
      priority: 'High',
      status: 'Draft',
      assignedUsers: ['Alice'],
      dueDate: new Date(),
    };

    component.onSave(payload);

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      WorkflowActions.createWorkflow({
        workflow: {
          name: payload.name,
          priority: 'High',
          status: 'Draft',
          assignedUsers: ['Alice'],
          dueDate: payload.dueDate,
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
