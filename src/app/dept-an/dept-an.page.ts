import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dept-an',
  templateUrl: './dept-an.page.html',
  styleUrls: ['./dept-an.page.scss'],
})
export class DeptAnPage implements OnInit {
  lecturers: any[] = [];
  students: any[] = [];
  searchStaffNumber: string = '';
  showStudentSearch: boolean = false;
  showStudentTable: boolean = false;
  editingLecturerStaffNumber: string | null = null;
  editingStudentNumber: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.fetchLecturers();
    this.fetchStudents();
  }

  async fetchLecturers() {
    this.firestore.collection('/registered staff/').valueChanges().subscribe((staff: any[]) => {
      this.lecturers = staff.filter(staffMember => staffMember.position === 'lecturer');
    });
  }

  // toggleStudentTable() {
  //   this.showStudentTable = !this.showStudentTable;
  //   this.showStudentSearch = !this.showStudentSearch;
  // }

  async searchLecturers() {
    if (this.searchStaffNumber.trim() === '') {
      this.fetchLecturers();
    } else {
      this.firestore.collection('/registered staff/', ref => ref.where('staffNumber', '==', this.searchStaffNumber))
        .valueChanges()
        .subscribe((staff: any[]) => {
          this.lecturers = staff.filter(staffMember => staffMember.position === 'lecturer');
        });
    }
  }

  async fetchStudents() {
    this.firestore.collection('/registeredStudents/').valueChanges().subscribe((students: any[]) => {
      this.students = students.map(student => ({
        ...student,
        fullName: `${student.name} ${student.surname}`
      }));
    });
  }

  editLecturer(lecturer: any) {
    this.editingLecturerStaffNumber = lecturer.staffNumber;
  }

  async updateLecturer(lecturer: any) {
    if (lecturer) {
      try {
        console.log(`Updating lecturer with staffNumber: ${lecturer.staffNumber}`); // Log the staffNumber
        const snapshot = await this.firestore.collection('/registered staff', ref => ref.where('staffNumber', '==', lecturer.staffNumber)).get().toPromise();
        console.log('Snapshot:', snapshot); // Log the snapshot
        if (snapshot && !snapshot.empty) {
          snapshot.forEach(async doc => {
            console.log('Updating doc id:', doc.id); // Log the doc id
            await this.firestore.collection('/registered staff').doc(doc.id).update(lecturer);
          });
          await this.presentToast('Lecturer successfully updated!');
          this.editingLecturerStaffNumber = null;
          this.fetchLecturers();
        } else {
          await this.presentToast('Lecturer not found!');
        }
      } catch (error) {
        console.error('Error updating lecturer: ', error);
        await this.presentToast('Error updating lecturer!');
      }
    }
  }

  cancelEdit() {
    this.editingLecturerStaffNumber = null;
    this.editingStudentNumber = null;
  }

  async deleteLecturer(staffNumber: string) {
    try {
      const snapshot = await this.firestore.collection('/registered staff', ref => ref.where('staffNumber', '==', staffNumber)).get().toPromise();
      if (snapshot && !snapshot.empty) {
        snapshot.forEach(async doc => {
          await this.firestore.collection('/registered staff').doc(doc.id).delete();
        });
        await this.presentToast('Lecturer successfully deleted!');
        this.fetchLecturers();
      } else {
        await this.presentToast('No lecturer found to delete.');
      }
    } catch (error) {
      console.error('Error deleting lecturer: ', error);
      await this.presentToast('Error deleting lecturer!');
    }
  }

  editStudent(student: any) {
    this.editingStudentNumber = student.studentNumber;
  }

  async updateStudent(student: any) {
    if (student) {
      try {
        const snapshot = await this.firestore.collection('/registeredStudents', ref => ref.where('studentNumber', '==', student.studentNumber)).get().toPromise();
        if (snapshot && !snapshot.empty) {
          snapshot.forEach(async doc => {
            await this.firestore.collection('/registeredStudents').doc(doc.id).update(student);
          });
          await this.presentToast('Student successfully updated!');
          this.editingStudentNumber = null;
          this.fetchStudents();
        } else {
          await this.presentToast('Student not found!');
        }
      } catch (error) {
        console.error('Error updating student: ', error);
        await this.presentToast('Error updating student!');
      }
    }
  }

  async deleteStudent(studentNumber: string) {
    try {
      const snapshot = await this.firestore.collection('/registeredStudents', ref => ref.where('studentNumber', '==', studentNumber)).get().toPromise();
      if (snapshot && !snapshot.empty) {
        snapshot.forEach(async doc => {
          await this.firestore.collection('/registeredStudents').doc(doc.id).delete();
        });
        await this.presentToast('Student successfully deleted!');
        this.fetchStudents();
      } else {
        await this.presentToast('No student found to delete.');
      }
    } catch (error) {
      console.error('Error deleting student: ', error);
      await this.presentToast('Error deleting student!');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }
}
//   async addLecturer() {
//     const alert = await this.alertController.create({
//       header: 'Add Lecturer',
//       inputs: [
//         { name: 'fullName', type: 'text', placeholder: 'Full Name' },
//         { name: 'email', type: 'text', placeholder: 'Email' },
//         { name: 'position', type: 'text', placeholder: 'Position' },
//         { name: 'staffNumber', type: 'text', placeholder: 'Staff Number' },
//         { name: 'department', type: 'text', placeholder: 'Department' }
//       ],
//       buttons: [
//         { text: 'Cancel', role: 'cancel' },
//         {
//           text: 'Add',
//           handler: (data) => {
//             return new Promise(async (resolve, reject) => {
//               // Check if any of the fields are empty
//               if (!data.fullName || !data.email || !data.position || !data.staffNumber || !data.department) {
//                 await this.presentToast('Please enter all fields');
//                 reject('Missing fields');
//                 return; // Stop further execution
//               }
//               try {
//                 // Add lecturer to Firestore
//                 await this.firestore.collection('/registered staff').add(data);
//                 await this.presentToast('Lecturer successfully added!');
//                 this.fetchLecturers();
//                 resolve(); // Indicate success
//               } catch (error) {
//                 console.error('Error adding lecturer: ', error);
//                 await this.presentToast('Error adding lecturer!');
//                 reject(error); // Indicate failure
//               }
//             });
//           }
//         }
//       ]
//     });
//     await alert.present();
//   }
  

//   async addStudent() {
//     const alert = await this.alertController.create({
//       header: 'Add Student',
//       inputs: [
//         { name: 'name', type: 'text', placeholder: 'Name' },
//         { name: 'email', type: 'text', placeholder: 'Email' },
//         { name: 'studentNumber', type: 'text', placeholder: 'Student Number' },
//         { name: 'surname', type: 'text', placeholder: 'Surname' }
//       ],
//       buttons: [
//         { text: 'Cancel', role: 'cancel' },
//         {
//           text: 'Add',
//           handler: (data) => {
//             return new Promise(async (resolve, reject) => {
//               // Check if any of the fields are empty
//               if (!data.name || !data.email || !data.studentNumber || !data.surname) {
//                 await this.presentToast('Please enter all fields');
//                 reject('Missing fields');
//                 return; // Stop further execution
//               }
//               try {
//                 // Add student to Firestore
//                 await this.firestore.collection('/registeredStudents').add(data);
//                 await this.presentToast('Student successfully added!');
//                 this.fetchStudents();
//                 resolve(); // Indicate success
//               } catch (error) {
//                 console.error('Error adding student: ', error);
//                 await this.presentToast('Error adding student!');
//                 reject(error); // Indicate failure
//               }
//             });
//           }
//         }
//       ]
//     });
//     await alert.present();
//   }  
// }
