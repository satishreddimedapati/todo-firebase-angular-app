import { Injectable } from '@angular/core';
import { Firestore, deleteDoc,collection, collectionData, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private firestore: Firestore) {}

  getCourses(): Observable<Course[]> {
    const coursesRef = collection(this.firestore, 'courses');
    return collectionData(coursesRef, { idField: 'id' }) as Observable<Course[]>;
  }

  addCourse(course: Course) {
    const coursesRef = collection(this.firestore, 'courses');
    return addDoc(coursesRef, course);
  }

  updateCourse(course: Course) {
    if (course.id) {
      const courseRef = doc(this.firestore, `courses/${course.id}`);
      return updateDoc(courseRef, { tasks: course.tasks, completed: course.completed, pointsEarned: course.pointsEarned });
    }
    return Promise.resolve();
  }
  deleteCourse(courseId: string) {
    const courseRef = doc(this.firestore, `courses/${courseId}`);
    return deleteDoc(courseRef);
  }
}
