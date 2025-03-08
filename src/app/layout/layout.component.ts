import { Component,Input } from '@angular/core';
import { TasksComponent } from '../tasks/tasks.component';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { OverviewComponent } from '../components/overview/overview.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone :true,
  imports:[OverviewComponent,TasksComponent,FormsModule,CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isSidebarOpen = false;
  darkMode = false;
  showCompletedTasksModal = false;
  isOverviewVisible = false;
  @Input() tasks: any[] = [];
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
  }

  openCompletedTasksModal() {
    this.showCompletedTasksModal = true;
    this.isOverviewVisible =false;
  }

  closeCompletedTasksModal() {
    this.showCompletedTasksModal = false;
  }
  showOverview() {
    this.showCompletedTasksModal = false;

    this.isOverviewVisible = true;
  }
}
