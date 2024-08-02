import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface StudentData {
  email: string;
  name: string;
  studentNumber: string;
  surname: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentUser: any = {};
  moduleCount: number = 0;
  studentCount: number = 0;
  totalAttendance: number = 0;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User signed in:', user.email);
        this.firestore
          .collection('registered staff', (ref) =>
            ref.where('email', '==', user.email)
          )
          .get()
          .subscribe(
            (querySnapshot) => {
              if (querySnapshot.empty) {
                console.log('No user found with this email');
              } else {
                querySnapshot.forEach((doc) => {
                  this.currentUser = doc.data();
                  console.log('Current User:', this.currentUser);
                  this.getModulesForLecturer(this.currentUser.email); // Fetch modules using userEmail
                });
              }
            },
            (error) => {
              console.error('Error fetching user data:', error);
            }
          );
      } else {
        console.log('No user is signed in');
      }
    });
  }

  getModulesForLecturer(userEmail: string) {
    this.firestore
      .collection('modules', (ref) => ref.where('userEmail', '==', userEmail))
      .get()
      .subscribe(
        (querySnapshot) => {
          this.moduleCount = querySnapshot.size;
          console.log('Module Count:', this.moduleCount);
          this.getStudentsInModules(querySnapshot.docs);
        },
        (error) => {
          console.error('Error fetching module count:', error);
        }
      );
  }

  getStudentsInModules(modules: any[]) {
    const studentNumbers = new Set<string>(); // Use a Set to store unique student numbers

    const studentPromises = modules.map((moduleDoc) => {
      const moduleData = moduleDoc.data();
      console.log('Fetching students for module:', moduleData.moduleCode);
      return this.firestore
        .collection('registeredStudents') // Ensure this is the correct collection
        .get()
        .toPromise();
    });

    Promise.all(studentPromises).then((studentSnapshots) => {
      studentSnapshots.forEach((studentSnapshot) => {
        if (studentSnapshot) {
          studentSnapshot.forEach((doc) => {
            const studentData = doc.data() as StudentData;
            studentNumbers.add(studentData.studentNumber); // Add studentNumber to the Set
          });
        }
      });

      this.studentCount = studentNumbers.size; // The size of the Set is the number of unique students
      console.log('Total Unique Students:', this.studentCount);
      // Calculate attendance percentage if relevant data is available
      this.calculateTotalAttendance(this.studentCount);
    }).catch((error) => {
      console.error('Error fetching students:', error);
    });
  }

  calculateTotalAttendance(totalStudents: number) {
    // Modify or remove this calculation if attendance data is not available
    if (totalStudents > 0) {
      this.totalAttendance = (totalStudents / totalStudents) * 100; // Adjust calculation if needed
    } else {
      this.totalAttendance = 0;
    }
    console.log('Total Attendance:', this.totalAttendance);
  }
}
