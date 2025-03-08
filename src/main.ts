import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '../src/app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';
import { provideRouter, Routes } from '@angular/router';
import { TasksComponent } from './app/tasks/tasks.component';

const routes: Routes = [
  { path: 'completed-tasks', component: TasksComponent }, // Completed Tasks route
];

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideRouter(routes) // Provide router configuration
  ],
}).catch((err) => console.error(err));
