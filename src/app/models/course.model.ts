export interface CourseTask {
    title: string;
    dueDate?: string;
    notes?: string;
    completed: boolean;
  }
  
  export interface Course {
    id?: string;
    title: string;
    tasks: CourseTask[];
    targetDate?: string;
    notes?: string;
    pointsEarned: number;
    completed: boolean;
  }
  