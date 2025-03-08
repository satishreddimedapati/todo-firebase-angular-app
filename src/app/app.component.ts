import { Component ,Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone:true,
  imports:[LayoutComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  themes = ['bright', 'colorful', 'dark', 'minimalist'];
  selectedTheme = 'bright'; // Default theme
  constructor(private renderer: Renderer2) {}

  changeTheme(theme: string) {
    // Remove all existing theme classes from body
    document.body.classList.remove('bright', 'colorful', 'dark', 'minimalist');

    // Add the selected theme
    document.body.classList.add(theme);
  }

}
