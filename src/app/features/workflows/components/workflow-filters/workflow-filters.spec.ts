import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowFilters } from './workflow-filters';

describe('WorkflowFilters', () => {
  let component: WorkflowFilters;
  let fixture: ComponentFixture<WorkflowFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
