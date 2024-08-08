import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Lecturer {
  id: number;
  fullName: string;
  email: string;
  position: string;
  staffNumber: string;
  department: string;
}

@Injectable({
  providedIn: 'root',
})
export class LecturerService {
  private lecturersSubject = new BehaviorSubject<Lecturer[]>([]);
  lecturers$ = this.lecturersSubject.asObservable();

  constructor() {
    this.loadLecturers();
  }

  private loadLecturers() {
    // Load lecturers from a service or local storage.
    // This is just a mock example.
    const lecturers = [
      {
        id: 1,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Professor',
        staffNumber: '12345',
        department: 'Computer Science',
      },
      {
        id: 2,
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        position: 'Lecturer',
        staffNumber: '67890',
        department: 'Mathematics',
      },
    ];
    this.lecturersSubject.next(lecturers);
  }

  addLecturer(lecturer: Lecturer) {
    const currentLecturers = this.lecturersSubject.value;
    lecturer.id = currentLecturers.length + 1;
    this.lecturersSubject.next([...currentLecturers, lecturer]);
  }

  editLecturer(lecturer: Lecturer) {
    const currentLecturers = this.lecturersSubject.value;
    const index = currentLecturers.findIndex((l) => l.id === lecturer.id);
    if (index !== -1) {
      currentLecturers[index] = lecturer;
      this.lecturersSubject.next([...currentLecturers]);
    }
  }

  deleteLecturer(lecturerId: number) {
    const currentLecturers = this.lecturersSubject.value;
    this.lecturersSubject.next(currentLecturers.filter((lecturer) => lecturer.id !== lecturerId));
  }
}
