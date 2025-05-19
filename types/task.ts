export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  tag?: string;
  notes?: string;
  completionCount: number; // Track how many times a task has been completed
}

export type TaskFilter = 'all' | 'active' | 'completed';