// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { ToastController } from '@ionic/angular';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-attendies',
//   templateUrl: './attendies.page.html',
//   styleUrls: ['./attendies.page.scss'],
// })
// export class AttendiesPage implements OnInit, OnDestroy {
//   students: any[] = [];
//   showTable: boolean = false;
//   requestedInvites: any[] = [];
//   showRequestsTable: boolean = false;
//   attendanceSubscription!: Subscription;
//   requestedInvitesSubscription!: Subscription;
//   moduleName:string="Dev Soft 1";
//   moduleCode:string="DS100";

//   constructor(private firestore: AngularFirestore, private toastController: ToastController) {}

//   ngOnInit() {
//     this.fetchAllStudents(this.moduleCode, this.moduleName); // Fetch all students from a specific module
//     this.fetchPendingRequests(this.moduleCode, this.moduleName);// Fetch requested invites
//   }

//   async fetchAllStudents(moduleCode: string, moduleName: string) {
//     try {
//       const studentsSnapshot = await this.firestore.collection('allModules')
//         .doc(moduleCode)
//         .collection(moduleName)
//         .get()
//         .toPromise();

//       if (studentsSnapshot && !studentsSnapshot.empty) {
//         this.students = studentsSnapshot.docs.map(doc => doc.data());
//         console.log('All students data:', this.students);
//       } else {
//         console.log('No student data found.');
//         this.students = [];
//       }
//     } catch (error) {
//       console.error('Error fetching students data:', error);
//       this.students = [];
//     }
//   }

//   async fetchPendingRequests(moduleCode: string, moduleName: string) {
//     try {
//       const requestsSnapshot = await this.firestore.collection('allModules')
//         .doc(moduleCode)
//         .collection(moduleName)
//         .doc('2211')
//         .collection('students', ref => ref.where('status', '==', 'pending'))
//         .get()
//         .toPromise();

//       if (requestsSnapshot && !requestsSnapshot.empty) {
//         this.requestedInvites = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         console.log('Pending requests data:', this.requestedInvites);
//       } else {
//         console.log('No pending requests data found.');
//         this.requestedInvites = [];
//       }
//     } catch (error) {
//       console.error('Error fetching pending requests data:', error);
//       this.requestedInvites = [];
//     }
//   }

//   toggleTable() {
//     this.showTable = !this.showTable;
//   }

//   toggleRequestsTable() {
//     this.showRequestsTable = !this.showRequestsTable;
//   }

//   async updateStudentStatus(request: any, status: string) {
//     const updatedStudent = { status };

//     try {
//       await this.firestore.collection("allModules").doc(request.moduleCode).collection(this.moduleName).doc(request.studentNumber).update(updatedStudent);
//       const requestIndex = this.requestedInvites.findIndex(req => req.id === request.id);
//       this.requestedInvites.splice(requestIndex, 1);
//       this.presentToast(`${status.charAt(0).toUpperCase() + status.slice(1)} student successfully.`, 'success');
//     } catch (error) {
//       console.error(`Error updating student status to ${status}:`, error);
//       this.presentToast(`Error updating student status. Please try again.`, 'danger');
//     }
//   }

//   approveStudent(request: any) {
//     this.updateStudentStatus(request, 'active');
//   }

//   declineStudent(request: any) {
//     this.updateStudentStatus(request, 'declined');
//   }

//   ngOnDestroy() {
//     if (this.attendanceSubscription) {
//       this.attendanceSubscription.unsubscribe();
//     }
//     if (this.requestedInvitesSubscription) {
//       this.requestedInvitesSubscription.unsubscribe();
//     }
//   }

//   async presentToast(message: string, color: string) {
//     const toast = await this.toastController.create({
//       message,
//       color,
//       duration: 2000
//     });
//     toast.present();
//   }
// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-attendies',
  templateUrl: './attendies.page.html',
  styleUrls: ['./attendies.page.scss'],
})
export class AttendiesPage implements OnInit, OnDestroy {
  students: any[] = [];
  showTable: boolean = false;
  requestedInvites: any[] = [];
  showRequestsTable: boolean = false;
  moduleName: string = "Dev Soft 1";
  moduleCode: string = "DS100";
  attendanceSubscription!: Subscription;
  requestedInvitesSubscription!: Subscription;

  constructor(private firestore: AngularFirestore, private toastController: ToastController) {}

  ngOnInit() {
    this.fetchAllStudents(this.moduleCode, this.moduleName); // Fetch all students from a specific module
    // this.fetchPendingRequests(this.moduleCode, this.moduleName); // Fetch requested invites
  }

  async fetchAllStudents(moduleCode: string, moduleName: string) {
    try {
      const studentsSnapshot = await this.firestore.collection('allModules')
        .doc(moduleCode)
        .collection(moduleName)
        .get()
        .toPromise();

      if (studentsSnapshot && !studentsSnapshot.empty) {
        this.students = studentsSnapshot.docs.map(doc => doc.data());
        console.log('All students data:', this.students);
      } else {
        console.log('No student data found.');
        this.students = [];
      }
    } catch (error) {
      console.error('Error fetching students data:', error);
      this.students = [];
    }
  }

  async fetchPendingRequests(moduleCode: string, moduleName: string) {
    try {
      const requestsSnapshot = await this.firestore.collection('allModules')
        .doc(moduleCode)
        .collection(moduleName)
        .doc('2211')
        .collection('students', ref => ref.where('status', '==', 'pending'))
        .get()
        .toPromise();

      if (requestsSnapshot && !requestsSnapshot.empty) {
        this.requestedInvites = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Pending requests data:', this.requestedInvites);
      } else {
        console.log('No pending requests data found.');
        this.requestedInvites = [];
      }
    } catch (error) {
      console.error('Error fetching pending requests data:', error);
      this.requestedInvites = [];
    }
  }

  toggleTable() {
    this.showTable = !this.showTable;
  }

  toggleRequestsTable() {
    this.showRequestsTable = !this.showRequestsTable;
  }

  async updateStudentStatus(request: any, status: string) {
    const updatedStudent = { status };

    try {
      await this.firestore.collection("allModules")
        .doc(request.moduleCode)
        .collection(this.moduleName)
        .doc(request.studentNumber)
        .update(updatedStudent);

      const requestIndex = this.requestedInvites.findIndex(req => req.id === request.id);
      this.requestedInvites.splice(requestIndex, 1);
      this.presentToast(`${status.charAt(0).toUpperCase() + status.slice(1)} student successfully.`, 'success');
    } catch (error) {
      console.error(`Error updating student status to ${status}:`, error);
      this.presentToast(`Error updating student status. Please try again.`, 'danger');
    }
  }

  approveStudent(request: any) {
    this.updateStudentStatus(request, 'active');
  }

  declineStudent(request: any) {
    this.updateStudentStatus(request, 'declined');
  }

  ngOnDestroy() {
    if (this.attendanceSubscription) {
      this.attendanceSubscription.unsubscribe();
    }
    if (this.requestedInvitesSubscription) {
      this.requestedInvitesSubscription.unsubscribe();
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000
    });
    toast.present();
  }
}
