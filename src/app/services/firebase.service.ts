import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
interface Subtask {
  id?: string;
  title: string;
  completed: boolean;
}


export interface Task {
  id?: string;
  title: string;
  dueDate: string;
  category: string;
  priority: string;
  completed: boolean;
  subtasks?: Subtask[];
  comments?: string[];
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  postponed?: boolean;
  postponeReason?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  getTasks(): Observable<Task[]> {
    const tasksRef = collection(this.firestore, 'tasks');
    return collectionData(tasksRef, { idField: 'id' }) as Observable<Task[]>;
  }

  addTask(task: Task) {
    const tasksRef = collection(this.firestore, 'tasks');
    return addDoc(tasksRef, task);
  }

  updateTask(task: Task) {
    if (task.id) {
      const taskDoc = doc(this.firestore, `tasks/${task.id}`);
      return updateDoc(taskDoc, { completed: task.completed });
    }
    return Promise.resolve();
  }

  deleteTask(taskId: string) {
    const taskDoc = doc(this.firestore, `tasks/${taskId}`);
    return deleteDoc(taskDoc);
  }
  async toggleTaskCompletion(task: Task) {
    const taskRef = doc(this.firestore, `tasks/${task.id}`);
    await updateDoc(taskRef, { completed: !task.completed });
  }
}
