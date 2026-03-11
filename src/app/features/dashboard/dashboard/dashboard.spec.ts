import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Dashboard } from './dashboard';
import { WorkflowActions } from '../../../core/store/workflow/workflow.actions';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let storeSpy: jasmine.SpyObj<Store<unknown>>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj<Store<unknown>>('Store', ['dispatch', 'select']);
    // selectors for workflows$ and loading$
    storeSpy.select.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [{ provide: Store, useValue: storeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadWorkflows with large pageSize on init', () => {
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      WorkflowActions.loadWorkflows({ query: { page: 1, pageSize: 1000 } })
    );
  });
});
