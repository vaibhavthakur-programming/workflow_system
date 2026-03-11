export type WorkflowStatus = 'Draft' | 'In Review' | 'Approved' | 'Rejected';
export type WorkflowPriority = 'Low' | 'Medium' | 'High';

export interface Workflow {
  id: string;
  name: string;
  priority: WorkflowPriority;
  status: WorkflowStatus;
  assignedUsers: string[];
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
