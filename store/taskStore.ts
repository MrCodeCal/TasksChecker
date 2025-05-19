import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskFilter } from '@/types/task';

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  addTask: (title: string, tag?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (task: Task) => void;
  setFilter: (filter: TaskFilter) => void;
  getFilteredTasks: () => Task[];
  clearCompletedTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: 'all',
      
      addTask: (title, tag) => {
        if (!title.trim()) return;
        
        const newTask: Task = {
          id: Date.now().toString(),
          title: title.trim(),
          completed: false,
          createdAt: Date.now(),
          tag,
          completionCount: 0, // Initialize completion count to 0
        };
        
        set(state => ({
          tasks: [newTask, ...state.tasks]
        }));
      },
      
      toggleTask: (id) => {
        set(state => ({
          tasks: state.tasks.map(task => {
            if (task.id === id) {
              // If task is being marked as completed, increment the completion count
              const newCompletionCount = !task.completed 
                ? task.completionCount + 1 
                : task.completionCount;
              
              return { 
                ...task, 
                completed: !task.completed,
                completionCount: newCompletionCount
              };
            }
            return task;
          })
        }));
      },
      
      deleteTask: (id) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },
      
      updateTask: (updatedTask) => {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        }));
      },
      
      setFilter: (filter) => {
        set({ filter });
      },
      
      getFilteredTasks: () => {
        const { tasks, filter } = get();
        
        switch (filter) {
          case 'active':
            return tasks.filter(task => !task.completed);
          case 'completed':
            return tasks.filter(task => task.completed);
          default:
            return tasks;
        }
      },
      
      clearCompletedTasks: () => {
        set(state => ({
          tasks: state.tasks.filter(task => !task.completed)
        }));
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);