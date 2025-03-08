import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


interface Task {
  id?: string;
  title: string;
  dueDate: string;
  category: string;
  priority: string;
  completed: boolean;
}

@Component({
  selector: 'app-tasks',
  standalone:true,
  imports:[FormsModule,CommonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { title: '', dueDate: '', category: 'Personal', priority: 'Medium', completed: false };
  categories: string[] = ['Personal', 'Work', 'Shopping', 'Others'];
  priorities: string[] = ['High', 'Medium', 'Low'];

  filterCategory: string = 'All';
  filterPriority: string = 'All';
  filterCompleted: string = 'All';

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.getTasks().subscribe(data => {
      this.tasks = data;
      console.log('tasks', this.tasks);
    });
  }

  addTask() {
    if (this.newTask.title.trim()) {
      this.firebaseService.addTask(this.newTask).then(() => {
        this.newTask = { title: '', dueDate: '', category: 'Personal', priority: 'Medium', completed: false };
      });
    }
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
    this.firebaseService.updateTask(task);
  }

  deleteTask(task: Task) {
    if (task.id) {
      this.firebaseService.deleteTask(task.id);
    }
  }

  filterTasks(): Task[] {
    return this.tasks.filter(task => {
      const categoryMatch = this.filterCategory === 'All' || task.category === this.filterCategory;
      const priorityMatch = this.filterPriority === 'All' || task.priority === this.filterPriority;
      const completedMatch = 
        this.filterCompleted === 'All' ||
        (this.filterCompleted === 'Completed' && task.completed) ||
        (this.filterCompleted === 'Pending' && !task.completed);

      return categoryMatch && priorityMatch && completedMatch;
    });
  }
}
