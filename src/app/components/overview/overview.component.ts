import { Component, OnInit, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { FirebaseService } from '../../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, AfterViewInit {
  tasks: any[] = [];
  dailyTotal = 0;
  dailyCompleted = 0;
  monthlyTotal = 0;
  monthlyCompleted = 0;
  monthlyGoal = 60; // Fixed at 60
  progressDashArray = 283;
  streakCount = 0;
  productivityScore = 0;
  categoryData: any = {};
  weeklyData: number[] = [0, 0, 0, 0, 0, 0, 0];
  motivationalTip: any;
  unfinishedTasks:any;
  unfinishedProgressDashArray = 283; // Unfinished goal circle progress
pendingtasks:any;
weeklyLabels: string[] = []; // Store dates like 'Mon (2025-03-04)'
mostProductiveDay :any;
leastProductiveDay :any;
bestMonthlyDay :any;
  // Filter options
  filterOptions = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // Default to current month
    week: 'Week 1',
    selectedDate: ''
  };
  years: number[] = [0, 2024, 2025, 2026]; // 0 = "All Years"
  months = [
    { name: "All Months", value: 0 },
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 }
  ];
  
  weeks: string[] = ["All Weeks", "Week 1", "Week 2", "Week 3", "Week 4"];
  
  filteredTasks: any[] = [];
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.getTasks().subscribe((data) => {
      this.tasks = data;
      this.applyFilters();
      this.setMotivationalTip();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderCategoryChart();
      this.renderWeeklyChart();
    }, 300);
  }

  applyFilters() {
    console.log("🔄 Applying Filters...");
    if (!this.tasks || this.tasks.length === 0) {
      console.warn("⚠️ No tasks available to filter!");
      return;
    }

    this.filteredTasks = [...this.tasks];
    console.log("📝 All Tasks Before Filtering:", this.filteredTasks);

    this.filteredTasks = this.filteredTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      if (isNaN(taskDate.getTime())) {
        console.error("❌ Invalid Date Found:", task.dueDate, "Task:", task);
        return false;
      }

      const taskYear = taskDate.getFullYear();
      const taskMonth = taskDate.getMonth() + 1;
      const taskWeek = Math.ceil((taskDate.getDate()) / 7);

      const matchesYear = this.filterOptions.year === 0 || this.filterOptions.year === taskYear;
      const matchesMonth = this.filterOptions.month === 0 || this.filterOptions.month === taskMonth;
      const matchesWeek = this.filterOptions.week === 'All Weeks' || `Week ${taskWeek}` === this.filterOptions.week;
      const matchesDate = this.filterOptions.selectedDate ? task.dueDate === this.filterOptions.selectedDate : true;

      return matchesYear && matchesMonth && matchesWeek && matchesDate;
    });

    console.log("📅 Selected Year:", this.filterOptions.year);
    console.log("📆 Selected Month:", this.filterOptions.month);
    console.log("🗓 Selected Week:", this.filterOptions.week);
    console.log("✅ Filtered Tasks:", this.filteredTasks);
    
    this.calculateOverview();
  }

  
  
  
  calculateOverview() {
    const today = new Date().toISOString().split('T')[0];
  
    // ✅ Daily Stats
    this.dailyTotal = this.filteredTasks.filter(task => task.dueDate === today).length;
    this.dailyCompleted = this.filteredTasks.filter(task => task.dueDate === today && task.completed).length;
  
    // ✅ Monthly Stats (Based on Filtered Tasks)
    this.monthlyTotal = this.filteredTasks.length;
    this.monthlyCompleted = this.filteredTasks.filter(task => task.completed).length;
  
    // ✅ Adjust Goal Calculation to Match Filters
    this.unfinishedTasks = this.monthlyTotal - this.monthlyCompleted;
    this.pendingtasks = Math.max(this.monthlyGoal - this.monthlyCompleted, 0); // Avoid negative values
  
    this.calculateStreak();
    this.calculateProductivityScore();
    this.calculateCategoryData();
    this.calculateWeeklyData();
    this.updateProgressCircle();
    this.calculateBestProductivityDays();
  }
  
  calculateStreak() {
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {  // Check last 30 days
      const dateStr = currentDate.toISOString().split('T')[0];
      const completedTasks = this.tasks.filter(task => task.dueDate === dateStr && task.completed).length;
  
      if (completedTasks > 0) {
        streak++;  // Increase streak
      } else {
        break;  // Streak ends if no tasks are completed
      }
  
      currentDate.setDate(currentDate.getDate() - 1);  // Go to previous day
    }
  
    this.streakCount = streak;
  }
  calculateProductivityScore() {
    this.productivityScore = Math.min((this.monthlyCompleted / this.monthlyGoal) * 100, 100);
  }

  calculateCategoryData() {
    this.categoryData = {};
    this.filteredTasks.forEach(task => {
      if (!this.categoryData[task.category]) {
        this.categoryData[task.category] = 0;
      }
      if (task.completed) {
        this.categoryData[task.category] += 1;
      }
    });
  }

  calculateWeeklyData() {
    this.weeklyData = [0, 0, 0, 0, 0, 0, 0]; // Reset
    this.weeklyLabels = [];
  
    let currentDate = new Date();
    for (let i = 6; i >= 0; i--) {
      let dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      let dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' }); // 'Mon'
      
      this.weeklyLabels.push(`${dayName} (${dateStr})`); // Format: 'Mon (2025-03-04)'
      this.weeklyData[i] = this.tasks.filter(task => task.dueDate === dateStr && task.completed).length;
      currentDate.setDate(currentDate.getDate() - 1); // Move back a day
    }
  }

  updateProgressCircle() {
    const progress = Math.min((this.monthlyCompleted / this.monthlyGoal) * 283, 283);
    this.progressDashArray = 283 - progress;
 // Unfinished progress
 const unfinishedProgress = Math.min((this.unfinishedTasks / this.monthlyGoal) * 283, 283);
 this.unfinishedProgressDashArray = 283 - unfinishedProgress;
 
  }

  renderCategoryChart() {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(this.categoryData),
          datasets: [{
            data: Object.values(this.categoryData),
            backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#e91e63']
          }]
        }
      });
    }
  }
  renderWeeklyChart() {
    const ctx = document.getElementById('weeklyChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.weeklyLabels, // ✅ Show 'Mon (2025-03-04)' format
          datasets: [{
            label: 'Completed Tasks',
            data: this.weeklyData,
            backgroundColor: '#4caf50'
          }]
        },
        options: {
          scales: {
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 30,
                autoSkip: false // Ensure all labels are visible
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  
  calculateBestProductivityDays() {
    let weeklyCount: number[] = [0, 0, 0, 0, 0, 0, 0]; // Sun - Sat
    let monthlyCount: { [date: string]: number } = {}; // Store day-wise completion
    let weeklyDates: { [key: number]: string } = {}; // Store dates for best days
  
    this.tasks.forEach(task => {
      if (task.completed) {
        const taskDate = new Date(task.dueDate);
        const weekday = taskDate.getDay(); // 0 (Sun) - 6 (Sat)
        const dayOfMonth = taskDate.getDate();
        const dateStr = taskDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
        weeklyCount[weekday] += 1;
        if (!weeklyDates[weekday]) weeklyDates[weekday] = dateStr;
  
        monthlyCount[dateStr] = (monthlyCount[dateStr] || 0) + 1;
      }
    });
  
    // Find most & least productive weekdays
    const maxWeekTasks = Math.max(...weeklyCount);
    const minWeekTasks = Math.min(...weeklyCount);
    const maxWeekIndex = weeklyCount.indexOf(maxWeekTasks);
    const minWeekIndex = weeklyCount.indexOf(minWeekTasks);
  
    this.mostProductiveDay = `${this.getDayName(maxWeekIndex)} (${weeklyDates[maxWeekIndex] || 'N/A'})`;
    this.leastProductiveDay = `${this.getDayName(minWeekIndex)} (${weeklyDates[minWeekIndex] || 'N/A'})`;
  
    // Find best day of the month
    const bestMonthDate = Object.keys(monthlyCount).reduce((a, b) =>
      monthlyCount[a] > monthlyCount[b] ? a : b
    );
  
    this.bestMonthlyDay = bestMonthDate || 'N/A';
  
    this.setMotivationalTip();
  }
 
  getDayName(dayIndex: number): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIndex];
  }
  
  

  setMotivationalTip() {
    const tips = [
      "🚀 Small steps lead to big success!",
      "🔥 Stay focused, stay productive!",
      "💪 Consistency is the key to progress!",
      "📈 Track your tasks, boost your growth!"
    ];
    this.motivationalTip = tips[Math.floor(Math.random() * tips.length)];
  }
}
