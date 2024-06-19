import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentUser: any = {};
  moduleCount: number = 0;
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
        // User is signed in.
        this.firestore
          .collection('registered staff', (ref) =>
            ref.where('email', '==', user.email)
          )
          .get()
          .subscribe(
            (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                this.currentUser = doc.data();
                this.getModuleCount(doc.id); // Call getModuleCount after assigning currentUser
              });
            },
            (error) => {
              console.error('Error fetching user data:', error);
            }
          );
      } else {
        // No user is signed in.
      }
    });
  }

  getModuleCount(userId: string) {
    this.firestore
      .collection('modules', (ref) => ref.where('lecturerId', '==', userId))
      .get()
      .subscribe(
        (querySnapshot) => {
          this.moduleCount = querySnapshot.size;
          this.getTotalAttendance(querySnapshot);
        },
        (error) => {
          console.error('Error fetching module count:', error);
        }
      );
  }

  getTotalAttendance(querySnapshot: any) {
    let totalStudents = 0;
    let attendedStudents = 0;

    querySnapshot.forEach((doc: any) => {
      totalStudents += doc.data().totalStudents;
      attendedStudents += doc.data().attendedStudents;
    });

    if (totalStudents > 0) {
      this.totalAttendance = (attendedStudents / totalStudents) * 100;
    }
  }
}