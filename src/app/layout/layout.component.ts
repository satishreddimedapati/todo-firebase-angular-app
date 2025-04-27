import { Component,Input } from '@angular/core';
import { TasksComponent } from '../tasks/tasks.component';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { OverviewComponent } from '../components/overview/overview.component';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from '../components/courses/courses.component';
import { EntertainmentComponent } from '../components/entertainment/entertainment.component';

@Component({
  selector: 'app-layout',
  standalone :true,
  imports:[EntertainmentComponent,OverviewComponent,TasksComponent,FormsModule,CommonModule,CoursesComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isSidebarOpen = false;
  darkMode = false;
  showCompletedTasksModal = false;
  isOverviewVisible = false;
  iscoursevisible =false;
  isEntertainmentVisible=false;
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
    this.iscoursevisible=false;
    this.isEntertainmentVisible = false;


  }

  closeCompletedTasksModal() {
    this.showCompletedTasksModal = false;
  }
  showOverview() {
    this.showCompletedTasksModal = false;
    this.iscoursevisible=false;
    this.isEntertainmentVisible = false;

    this.isOverviewVisible = true;
  }
  showcourses() {
    this.showCompletedTasksModal = false;
    this.isEntertainmentVisible = false;

    this.isOverviewVisible = false;
    this.iscoursevisible=true;

  }
  showEntertainment() {
    this.isEntertainmentVisible = true;
    // Hide other sections if needed
    this.isOverviewVisible = false;
    this.iscoursevisible = false;
    this.showCompletedTasksModal=false;
  }
}
