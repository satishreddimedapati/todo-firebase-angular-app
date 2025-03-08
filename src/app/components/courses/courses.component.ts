import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course, CourseTask } from '../../models/course.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';  // Import Chart.js

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit, AfterViewInit {
  courses: Course[] = [];
  currentStep = 1;
  newCourse: Partial<Course> = { tasks: [] };
  newTask: Partial<CourseTask> = {};
  isAddingCourse = false;
  isViewingCourses = false;
  isViewingOverview = false;
  isViewingRewards = false;
 
  completedTasks = 0;
  pendingTasks = 0;
  
  chart: any;  // Declare the chart
  motivationalMessages = [
    "Every expert was once a beginner! 🎯",
    "Small progress is still progress! 🚀",
    "Your future self will thank you! 😊",
    "Learning today, leading tomorrow! 🔥",
  ];
  randomMessage = "";

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
      this.updateOverviewData();  // Update the overview data on init
    });
    this.randomMessage = this.getRandomMessage();
  }

  ngAfterViewInit() {
    this.createChart();  // Create the chart after the view has initialized
  }

  nextStep() {
    if (this.currentStep < 4) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  addTaskToCourse() {
    if (this.newTask.title) {
      this.newCourse.tasks?.push({
        ...this.newTask,
        completed: false,
      } as CourseTask);
      this.newTask = {}; // Reset task input
    }
  }

  addCourse() {
    if (this.newCourse.title && this.newCourse.tasks?.length) {
      const newCourseData: Course = {
        ...this.newCourse,
        completed: false,
        pointsEarned: 0,
      } as Course;

      this.courseService.addCourse(newCourseData);
      this.newCourse = { tasks: [] };
      this.currentStep = 1;
      this.randomMessage = this.getRandomMessage();
    }
  }

  markTaskComplete(course: Course, task: CourseTask) {
    task.completed = true;
    course.pointsEarned = (course.pointsEarned || 0) + 10; // Award 10 points per task
    this.checkCourseCompletion(course);
    this.courseService.updateCourse(course);
  }

  checkCourseCompletion(course: Course) {
    course.completed = course.tasks.every(task => task.completed);
  }

  showAddCourse() {
    this.isAddingCourse = true;
    this.isViewingCourses = false;
    this.isViewingOverview = false;
    this.isViewingRewards = false;
  }

  showViewCourses() {
    this.isAddingCourse = false;
    this.isViewingCourses = true;
    this.isViewingOverview = false;
    this.isViewingRewards = false;
  }

  showOverview() {
    this.isAddingCourse = false;
    this.isViewingCourses = false;
    this.isViewingOverview = true;
    this.isViewingRewards = false;
    this.updateOverviewData();  // Update overview when switching to the Overview tab
  }

  showRewards() {
    this.isAddingCourse = false;
    this.isViewingCourses = false;
    this.isViewingOverview = false;
    this.isViewingRewards = true;
  }

  getRandomMessage() {
    return this.motivationalMessages[
      Math.floor(Math.random() * this.motivationalMessages.length)
    ];
  }

  updateOverviewData() {
    // Calculate overall progress and tasks status
    const totalTasks = this.courses.reduce((acc, course) => acc + course.tasks.length, 0);
    const completedTaskCount = this.courses.reduce(
      (acc, course) => acc + course.tasks.filter((task) => task.completed).length,
      0
    );

    this.completedTasks = completedTaskCount;
    this.pendingTasks = totalTasks - completedTaskCount;

    this.createChart();  // Recreate the chart whenever data changes
  }

  // Overview calculations
  get completedCoursesCount(): number {
    return this.courses.filter(course => course.completed).length;
  }

  get overallProgress(): number {
    if (!this.courses.length) return 0;
    const totalTasks = this.courses.reduce((sum, course) => sum + course.tasks.length, 0);
    const completedTasks = this.courses.reduce(
      (sum, course) => sum + course.tasks.filter(task => task.completed).length, 0
    );
    return totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }

  // Rewards calculations
  get totalPoints(): number {
    return this.courses.reduce((sum, course) => sum + (course.pointsEarned || 0), 0);
  }

  get earnedBadges(): string[] {
    const badges = [];
    if (this.totalPoints >= 50) badges.push("Bronze Achiever 🥉");
    if (this.totalPoints >= 100) badges.push("Silver Scholar 🥈");
    if (this.totalPoints >= 200) badges.push("Gold Guru 🥇");
    return badges;
  }

  deleteCourse(courseId: any) {
    const confirmDelete = confirm("Are you sure you want to delete this course?");
    if (confirmDelete) {
      this.courseService.deleteCourse(courseId)
        .then(() => {
          this.courses = this.courses.filter(course => course.id !== courseId);
        })
        .catch(error => console.error("Error deleting course: ", error));
    }
  }

  createChart() {
    // Remove any existing chart before creating a new one
    if (this.chart) {
      this.chart.destroy();
    }

    const chartData = {
      labels: ['Completed Tasks', 'Pending Tasks'],
      datasets: [
        {
          label: 'Tasks Progress',
          data: [this.completedTasks, this.pendingTasks],
          backgroundColor: ['#4CAF50', '#FF6347'],
          borderColor: ['#4CAF50', '#FF6347'],
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions,
      });
    }
  }
}
