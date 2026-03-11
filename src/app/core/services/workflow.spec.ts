import { TestBed } from '@angular/core/testing';
import { WorkflowService } from './workflow';

describe('WorkflowService', () => {
  let service: WorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowService],
    });
    service = TestBed.inject(WorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
