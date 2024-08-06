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
//   students: any[] = [];// Array to store all student data
//   showTable: boolean = false;// Flag to toggle attendance table visibility
//   requestedInvites: any[] = [];// Array to store requested invites
//   showRequestsTable: boolean = false;// Flag to toggle requested invites table visibility
//   moduleName: string = "Dev Soft 1";// Default module name
//   moduleCode: string = "DS100";// Default module code
//   attendanceSubscription!: Subscription;// Subscription for attendance data
//   requestedInvitesSubscription!: Subscription;// Subscription for requested invites data

//   constructor(private firestore: AngularFirestore, private toastController: ToastController) {}

//   // Fetch all students and pending requests on component initialization
//   ngOnInit() {
//     this.fetchAllStudents(this.moduleCode, this.moduleName); // Fetch all students from a specific module
//     this.fetchPendingRequests(this.moduleCode, this.moduleName); // Fetch requested invites
//   }

//     // Fetch all students from a specific module
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

//    // Fetch pending requests from a specific module
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

//     // Toggle visibility of the attendance table
//   toggleTable() {
//     this.showTable = !this.showTable;
//   }

//   // Toggle visibility of the requested invites table
//   toggleRequestsTable() {
//     this.showRequestsTable = !this.showRequestsTable;
//   }

//  // Update student status to either 'active' or 'declined'
//   async updateStudentStatus(request: any, status: string) {
//     const updatedStudent = { status };

//     try {
//       await this.firestore.collection("allModules")
//         .doc(request.moduleCode)
//         .collection(this.moduleName)
//         .doc(request.studentNumber)
//         .update(updatedStudent);

//       const requestIndex = this.requestedInvites.findIndex(req => req.id === request.id);
//       this.requestedInvites.splice(requestIndex, 1);
//       this.presentToast(`${status.charAt(0).toUpperCase() + status.slice(1)} student successfully.`, 'success');
//     } catch (error) {
//       console.error(`Error updating student status to ${status}:`, error);
//       this.presentToast(`Error updating student status. Please try again.`, 'danger');
//     }
//   }

//    // Approve a student request
//   approveStudent(request: any) {
//     this.updateStudentStatus(request, 'active');
//   }

//   // Decline a student request
//   declineStudent(request: any) {
//     this.updateStudentStatus(request, 'declined');
//   }

//   // Unsubscribe from observables when the component is destroyed
//   ngOnDestroy() {
//     if (this.attendanceSubscription) {
//       this.attendanceSubscription.unsubscribe();
//     }
//     if (this.requestedInvitesSubscription) {
//       this.requestedInvitesSubscription.unsubscribe();
//     }
//   }

//     // Show a toast message
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
  students: any[] = []; // Array to store all student data
  showTable: boolean = false; // Flag to toggle attendance table visibility
  requestedInvites: any[] = []; // Array to store requested invites
  showRequestsTable: boolean = false; // Flag to toggle requested invites table visibility
  moduleName: string = "Dev Soft 1"; // Default module name
  moduleCode: string = "CF100"; // Default module code
  scanDate: string = "Thu Aug 01 2024"; // Default scan date
  attendanceSubscription!: Subscription; // Subscription for attendance data
  requestedInvitesSubscription!: Subscription; // Subscription for requested invites data

  constructor(private firestore: AngularFirestore, private toastController: ToastController) {}

  // Fetch all students and pending requests on component initialization
  ngOnInit() {
    this.fetchAllStudents(this.moduleCode, this.scanDate); // Fetch all students from a specific module and date
  
    this.fetchPendingRequests();
  }

  // Fetch all attended students from a specific module and date
  async fetchAllStudents(moduleCode: string, scanDate: string) {
    try {
      const studentsSnapshot = await this.firestore.collection('AttendedStudents')
        .doc(moduleCode) // Module code document
        .collection(scanDate) // Date subcollection
        .get()
        .toPromise();

      if (studentsSnapshot && !studentsSnapshot.empty) {
        this.students = studentsSnapshot.docs.map(doc => doc.data());
        console.log('Attended students data:', this.students);
      } else {
        console.log('No attended students data found.');
        this.students = [];
      }
    } catch (error) {
      console.error('Error fetching attended students data:', error);
      this.students = [];
    }
  }

  // Fetch pending requests from a specific module
  // async fetchPendingRequests(moduleCode: string = 'DS100', moduleName: string = 'Dev Soft 1') {
  //   try {
  //     const requestsSnapshot = await this.firestore.collection('allModules')
  //       .doc(moduleCode)
  //       .collection(moduleName)
  //       .where('status', '==', 'pending')
  //       .get()
  //       .toPromise();
  
  //     if (requestsSnapshot && !requestsSnapshot.empty) {
  //       this.requestedInvites = requestsSnapshot.docs.map((doc: { id: any; data: () => any; }) => ({ id: doc.id, ...doc.data() }));
  //       console.log('Pending requests data:', this.requestedInvites);
  //     } else {
  //       console.log('No pending requests data found.');
  //       this.requestedInvites = [];
  //     }
  //   } catch (error) {
  //     console.error('Error fetching pending requests data:', error);
  //     this.requestedInvites = [];
  //   }
  // }
  async fetchPendingRequests(moduleCode: string = 'DS100', moduleName: string = 'Dev Soft 1') {
    try {
      const requestsSnapshot = await this.firestore.collection('allModules')
        .doc(moduleCode)
        .collection(moduleName, ref => ref.where('status', '==', 'pending'))
        .get()
        .toPromise();
      if (requestsSnapshot && !requestsSnapshot.empty) {
        this.requestedInvites = requestsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
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

  // Toggle visibility of the attendance table
  toggleTable() {
    this.showTable = !this.showTable;
  }

  // Toggle visibility of the requested invites table
  toggleRequestsTable() {
    this.showRequestsTable = !this.showRequestsTable;
  }

  // Update student status to either 'active' or 'declined'
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

  // Approve a student request
  approveStudent(request: any) {
    this.updateStudentStatus(request, 'active');
  }

  // Decline a student request
  declineStudent(request: any) {
    this.updateStudentStatus(request, 'declined');
  }

  // Unsubscribe from observables when the component is destroyed
  ngOnDestroy() {
    if (this.attendanceSubscription) {
      this.attendanceSubscription.unsubscribe();
    }
    if (this.requestedInvitesSubscription) {
      this.requestedInvitesSubscription.unsubscribe();
    }
  }

  // Show a toast message
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000
    });
    toast.present();
  }
}



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
//   students: any[] = [];// Array to store all student data
//   requestedInvites: any[] = [];// Array to store requested invites
//   showTable: boolean = false;// Flag to toggle attendance table visibility
//   showRequestsTable: boolean = false;// Flag to toggle requested invites table visibility
//   moduleName: string = "Dev Soft 1";// Default module name
//   moduleCode: string = "DS100";// Default module code
//   attendanceSubscription!: Subscription;// Subscription for attendance data
//   requestedInvitesSubscription!: Subscription;// Subscription for requested invites data

//   constructor(private firestore: AngularFirestore, private toastController: ToastController) {}

//   ngOnInit() {
//     this.fetchAllStudents(this.moduleCode, this.moduleName); // Fetch all students from a specific module
//     this.fetchPendingRequests(this.moduleCode, this.moduleName); // Fetch requested invites
//   }

//   // Fetch all students from a specific module
//   async fetchAllStudents(moduleCode: string, moduleName: string) {
//     try {
//       const studentsSnapshot = await this.firestore.collection('AttendedStudents')
//         .doc(moduleCode)
//         .collection(moduleName)
//         .doc('2211')
//         .collection('students')
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

//   // Fetch pending requests from a specific module
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

//   // Toggle visibility of the attendance table
//   toggleTable() {
//     this.showTable = !this.showTable;
//   }

//   // Toggle visibility of the requested invites table
//   toggleRequestsTable() {
//     this.showRequestsTable = !this.showRequestsTable;
//   }

//   // Update student status to either 'active' or 'declined'
//   async updateStudentStatus(request: any, status: string) {
//     const updatedStudent = { status };

//     try {
//       await this.firestore.collection("allModules")
//         .doc(request.moduleCode)
//         .collection(this.moduleName)
//         .doc(request.studentNumber)
//         .update(updatedStudent);

//       const requestIndex = this.requestedInvites.findIndex(req => req.id === request.id);
//       this.requestedInvites.splice(requestIndex, 1);
//       this.presentToast(`${status.charAt(0).toUpperCase() + status.slice(1)} student successfully.`, 'success');
//     } catch (error) {
//       console.error(`Error updating student status to ${status}:`, error);
//       this.presentToast(`Error updating student status. Please try again.`, 'danger');
//     }
//   }

//   // Approve a student request
//   approveStudent(request: any) {
//     this.updateStudentStatus(request, 'active');
//   }

//   // Decline a student request
//   declineStudent(request: any) {
//     this.updateStudentStatus(request, 'declined');
//   }

//   // Unsubscribe from observables when the component is destroyed
//   ngOnDestroy() {
//     if (this.attendanceSubscription) {
//       this.attendanceSubscription.unsubscribe();
//     }
//     if (this.requestedInvitesSubscription) {
//       this.requestedInvitesSubscription.unsubscribe();
//     }
//   }

//   // Show a toast message
//   async presentToast(message: string, color: string) {
//     const toast = await this.toastController.create({
//       message,
//       color,
//       duration: 2000
//     });
//     toast.present();
//   }
// }
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
// import { ToastController } from '@ionic/angular';
// import { ChangeDetectorRef } from '@angular/core';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-attendies',
//   templateUrl: './attendies.page.html',
//   styleUrls: ['./attendies.page.scss'],
// })
// export class AttendiesPage implements OnInit, OnDestroy  {
//   students: any[] = [];
//   showTable: boolean = false;
//   requestedInvites: any[] = [];
//   showRequestsTable: boolean = false;
//   moduleName: string = "Dev Soft 1";
//   moduleCode: string = "CF100";
//   scanDate: string = "Thu Aug 01 2024";
//   attendanceSubscription!: Subscription;
//   requestedInvitesSubscription!: Subscription;

//   constructor(private firestore: AngularFirestore, private toastController: ToastController, private cdr: ChangeDetectorRef) {}

//   ngOnInit() {
//     this.fetchAllStudents(this.moduleCode, this.scanDate);
//     this.fetchPendingRequests(this.moduleCode, this.moduleName);
//     this.showRequestsTable = true; // Set this to true by default
//   } 

//   async fetchAllStudents(moduleCode: string, scanDate: string) {
//     try {
//       const studentsSnapshot = await this.firestore.collection('AttendedStudents')
//         .doc(moduleCode)
//         .collection(scanDate)
//         .get()
//         .toPromise();

//       if (studentsSnapshot && !studentsSnapshot.empty) {
//         this.students = studentsSnapshot.docs.map(doc => doc.data());
//         console.log('Attended students data:', this.students);
//       } else {
//         console.log('No attended students data found.');
//         this.students = [];
//       }
//       this.cdr.detectChanges();  // Trigger change detection after updating students
//     } catch (error) {
//       console.error('Error fetching attended students data:', error);
//       this.students = [];
//       this.cdr.detectChanges();  // Ensure change detection is triggered even if there’s an error
//     }
//   }

//   fetchPendingRequests(moduleCode: string, moduleName: string) {
//     console.log('Fetching pending requests for module:', moduleCode, moduleName);
//     const collection = this.firestore.collection('allModules')
//       .doc(moduleCode)
//       .collection(moduleName)
//       .doc('2211')
//       .collection('students', ref => ref.where('status', '==', 'pending'));
  
//     this.requestedInvitesSubscription = collection.snapshotChanges().subscribe(
//       (snapshot) => {
//         console.log('Received snapshot:', snapshot);
//         this.requestedInvites = snapshot.map(doc => {
//           const data = doc.payload.doc.data() as DocumentData;
//           const id = doc.payload.doc.id;
//           return { id, ...data };
//         });
//         console.log('Processed pending requests data:', this.requestedInvites);
//         this.cdr.detectChanges();
//       },
//       (error: any) => {
//         console.error('Error fetching pending requests data:', error);
//         this.requestedInvites = [];
//         this.cdr.detectChanges();
//       }
//     );
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
//       await this.firestore.collection("allModules")
//         .doc(request.moduleCode)
//         .collection(this.moduleName)
//         .doc(request.studentNumber)
//         .update(updatedStudent);
  
//       // Remove the updated student from the requestedInvites array
//       this.requestedInvites = this.requestedInvites.filter(req => req.id !== request.id);
//       this.cdr.detectChanges();
  
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
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
// import { ToastController } from '@ionic/angular';
// import { ChangeDetectorRef } from '@angular/core';
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
//   moduleName: string = "Dev Soft 1";
//   moduleCode: string = "DS100";
//   scanDate: string = "Mon Aug 05 2024"; // Updated to match the correct date format
//   attendanceSubscription!: Subscription;
//   requestedInvitesSubscription!: Subscription;

//   constructor(
//     private firestore: AngularFirestore,
//     private toastController: ToastController,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit() {
//     this.fetchAllStudents("CF100", this.scanDate);
//     this.fetchPendingRequests(this.moduleCode, this.moduleName);
//   }

//   async fetchAllStudents(moduleCode: string, scanDate: string) {
//     try {
//       const studentsSnapshot = await this.firestore.collection('AttendedStudents')
//         .doc(moduleCode)
//         .collection(scanDate)
//         .get()
//         .toPromise();

//       if (studentsSnapshot && !studentsSnapshot.empty) {
//         this.students = studentsSnapshot.docs.map(doc => doc.data());
//         console.log('Attended students data:', this.students);
//       } else {
//         console.log('No attended students data found.');
//         this.students = [];
//       }
//       this.cdr.detectChanges();
//     } catch (error) {
//       console.error('Error fetching attended students data:', error);
//       this.students = [];
//       this.cdr.detectChanges();
//     }
//   }

//   fetchPendingRequests(moduleCode: string, moduleName: string) {
//     console.log('Fetching pending requests for module:', moduleCode, moduleName);
//     const collection = this.firestore.collection('allModules')
//       .doc(moduleCode)
//       .collection(moduleName)
//       .doc('22116523')
//       .collection('students', ref => ref.where('status', '==', 'pending'));

//     this.requestedInvitesSubscription = collection.snapshotChanges().subscribe(
//       (snapshot) => {
//         console.log('Received snapshot:', snapshot);
//         this.requestedInvites = snapshot.map(doc => {
//           const data = doc.payload.doc.data() as DocumentData;
//           const id = doc.payload.doc.id;
//           console.log('Pending request data:', data); // Log the data
//           return { id, ...data };
//         });
//         console.log('Processed pending requests data:', this.requestedInvites);
//         this.cdr.detectChanges();
//       },
//       (error: any) => {
//         console.error('Error fetching pending requests data:', error);
//         this.requestedInvites = [];
//         this.cdr.detectChanges();
//       }
//     );
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
//       await this.firestore.collection("allModules")
//         .doc(request.moduleCode)
//         .collection(this.moduleName)
//         .doc('22116523')
//         .collection('students')
//         .doc(request.id)
//         .update(updatedStudent);

//       this.requestedInvites = this.requestedInvites.filter(req => req.id !== request.id);
//       this.cdr.detectChanges();

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
// import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { ToastController, ModalController } from '@ionic/angular';
// import { RequestsModalComponent } from './requests-modal.component';

// interface Student {
//   email: string;
//   name: string;
//   surname: string;
//   studentNumber: string;
//   moduleCode: string;
//   moduleName: string;
//   status: string;
// }

// @Component({
//   selector: 'app-attendies',
//   templateUrl: './attendies.page.html',
//   styleUrls: ['./attendies.page.scss'],
// })
// export class AttendiesPage implements OnInit {
//   showAttendanceTable: boolean = false;
//   students: Student[] = [];

//   constructor(
//     private firestore: AngularFirestore,
//     private afAuth: AngularFireAuth,
//     private toastController: ToastController,
//     private modalController: ModalController
//   ) {}

//   ngOnInit() {
//     this.fetchAttendanceData();
//   }

//   toggleTable() {
//     this.showAttendanceTable = !this.showAttendanceTable;
//   }

//   async openRequestsModal() {
//     const modal = await this.modalController.create({
//       component: RequestsModalComponent
//     });
//     return await modal.present();
//   }

//   async fetchAttendanceData() {
//     try {
//       const allModulesRef = this.firestore.collection('allModules');
//       const allModulesSnapshot = await allModulesRef.get().toPromise();

//       if (!allModulesSnapshot) {
//         console.log('No modules found');
//         this.presentToast('No modules found', 'warning');
//         return;
//       }

//       this.students = [];

//       for (const moduleDoc of allModulesSnapshot.docs) {
//         const moduleCode = moduleDoc.id;
//         const moduleRef = allModulesRef.doc(moduleCode);
//         const moduleCollectionsSnapshot = await moduleRef.collection('Dev Soft 1').get().toPromise();

//         if (moduleCollectionsSnapshot) {
//           for (const studentDoc of moduleCollectionsSnapshot.docs) {
//             const studentData = studentDoc.data() as Student;
//             if (studentData.status === 'approved') {
//               this.students.push({
//                 ...studentData,
//                 moduleCode: moduleCode,
//                 moduleName: 'Dev Soft 1',
//                 studentNumber: studentDoc.id
//               });
//             }
//           }
//         } else {
//           console.log(`No students found for module ${moduleCode}`);
//         }
//       }

//       console.log('Attendance data:', this.students);
//     } catch (error) {
//       console.error('Error fetching attendance data:', error);
//       this.presentToast('Failed to load attendance data.', 'danger');
//     }
//   }

//   async presentToast(message: string, color: string) {
//     const toast = await this.toastController.create({
//       message,
//       duration: 2000,
//       position: 'top',
//       color,
//     });
//     await toast.present();
//   }
// }



// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { ToastController } from '@ionic/angular';
// import { ChangeDetectorRef } from '@angular/core';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-attendies',
//   templateUrl: './attendies.page.html',
//   styleUrls: ['./attendies.page.scss'],
// })
// export class AttendiesPage implements OnInit, OnDestroy {
//   students: any[] = [];
//   showTable: boolean = false;
//   scanDate: string = "Mon Aug 05 2024"; // Update as needed
//   attendanceSubscription!: Subscription;

//   constructor(
//     private firestore: AngularFirestore,
//     private toastController: ToastController,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit() {
//     this.fetchAllStudents();
//   }

//   async fetchModules() {
//     try {
//       const modulesSnapshot = await this.firestore.collection('modules').get().toPromise();
  
//       if (modulesSnapshot && !modulesSnapshot.empty) {
//         // Process the snapshot
//         const modules = modulesSnapshot.docs.map(doc => doc.data());
//         console.log('Modules:', modules);
//       } else {
//         console.log('No modules found.');
//       }
//     } catch (error) {
//       console.error('Error fetching modules:', error);
//     }
//   }

//   async fetchScanDateData(moduleCode: string, scanDate: string) {
//     try {
//       const scanDateSnapshot = await this.firestore.collection('AttendedStudents')
//         .doc(moduleCode)
//         .collection(scanDate)
//         .get()
//         .toPromise();
  
//       if (scanDateSnapshot && !scanDateSnapshot.empty) {
//         // Process the snapshot
//         const students = scanDateSnapshot.docs.map(doc => doc.data());
//         console.log('Students:', students);
//       } else {
//         console.log('No data found for the scan date.');
//       }
//     } catch (error) {
//       console.error('Error fetching scan date data:', error);
//     }
//   }
  
//   async fetchAllModules() {
//     try {
//       const allModulesSnapshot = await this.firestore.collection('allModules').get().toPromise();
  
//       if (allModulesSnapshot && !allModulesSnapshot.empty) {
//         // Process the snapshot
//         const modules = allModulesSnapshot.docs.map(doc => doc.data());
//         console.log('All Modules:', modules);
//       } else {
//         console.log('No modules found.');
//       }
//     } catch (error) {
//       console.error('Error fetching all modules:', error);
//     }
//   }
  
  

//   async fetchAllStudents() {
//     try {
//       // Fetch all modules from the 'AttendedStudents' collection
//       const modulesSnapshot = await this.firestore.collection('AttendedStudents').get().toPromise();
      
//       // Initialize an array to hold student data
//       let studentData: any[] = [];
  
//       // Check if the modulesSnapshot is not undefined and not empty
//       if (modulesSnapshot) {
//         if (!modulesSnapshot.empty) {
//           // Iterate through each module document
//           for (const moduleDoc of modulesSnapshot.docs) {
//             const moduleCode = moduleDoc.id;
            
//             // Fetch students for the specific module and scan date
//             const scanDateSnapshot = await this.firestore.collection('AttendedStudents')
//               .doc(moduleCode)
//               .collection(this.scanDate)
//               .get()
//               .toPromise();
            
//             // Check if scanDateSnapshot is not undefined and not empty
//             if (scanDateSnapshot) {
//               if (!scanDateSnapshot.empty) {
//                 // Iterate through each student document
//                 for (const studentDoc of scanDateSnapshot.docs) {
//                   const student = studentDoc.data();
//                   studentData.push(student);
//                 }
//               } else {
//                 console.log(`No data found for module ${moduleCode} on date ${this.scanDate}.`);
//               }
//             } else {
//               console.log(`Scan date snapshot is undefined for module ${moduleCode}.`);
//             }
//           }
//         } else {
//           console.log('No modules found.');
//         }
//       } else {
//         console.log('Modules snapshot is undefined.');
//       }
  
//       // Update the component state and detect changes
//       this.students = studentData;
//       this.cdr.detectChanges();
//     } catch (error) {
//       console.error('Error fetching attended students data:', error);
//       this.students = [];
//       this.cdr.detectChanges();
//     }
//   }
  

//   toggleTable() {
//     this.showTable = !this.showTable;
//   }

//   ngOnDestroy() {
//     if (this.attendanceSubscription) {
//       this.attendanceSubscription.unsubscribe();
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
