import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Lecturer {
  id?: string; // Firestore document ID
  fullName: string;
  email: string;
  position: string;
  staffNumber: string;
  department: string;
}

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.page.html',
  styleUrls: ['./super-admin.page.scss'],
})
export class SuperAdminPage implements OnInit {
  lecturers$: Observable<Lecturer[]>;
  lecturerFullName = '';
  lecturerEmail = '';
  lecturerStaffNumber = '';
  lecturerDepartment = '';
  selectedLecturerId: string | null = null;
  showAddCard = false;
  showEditCard = false;

  departments: string[] = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Medicine',
    'Law',
    'Business',
    'Economics',
    'Education',
    'Arts',
    'History',
    'Geography',
    'Philosophy',
    'Sociology',
    'Psychology',
    'Political Science',
    'Anthropology',
    'Linguistics',
    'Environmental Science',
  ];

  constructor(
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) {
    this.lecturers$ = this.firestore
      .collection<Lecturer>('registered staff', ref => ref.where('position', '==', 'dept-admin'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Lecturer;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  ngOnInit() {}

  async addLecturer() {
    if (this.lecturerFullName && this.lecturerEmail && this.lecturerStaffNumber && this.lecturerDepartment) {
      const newLecturer: Lecturer = {
        fullName: this.lecturerFullName,
        email: this.lecturerEmail,
        position: 'dept-admin',
        staffNumber: this.lecturerStaffNumber,
        department: this.lecturerDepartment,
      };
      await this.firestore.collection('registered staff').add(newLecturer);
      this.resetForm();
      this.showAddCard = false;
      this.presentToast('Lecturer successfully added!');
    } else {
      this.presentToast('Please fill out all fields.');
    }
  }

  editLecturer(lecturer: Lecturer) {
    this.selectedLecturerId = lecturer.id!;
    this.lecturerFullName = lecturer.fullName;
    this.lecturerEmail = lecturer.email;
    this.lecturerStaffNumber = lecturer.staffNumber;
    this.lecturerDepartment = lecturer.department;
    this.showEditCard = true;
    this.showAddCard = false;
  }

  async updateLecturer() {
    if (this.selectedLecturerId) {
      const updatedLecturer: Lecturer = {
        fullName: this.lecturerFullName,
        email: this.lecturerEmail,
        position: 'dept-admin',
        staffNumber: this.lecturerStaffNumber,
        department: this.lecturerDepartment,
      };
      await this.firestore.collection('registered staff').doc(this.selectedLecturerId).update(updatedLecturer);
      this.resetForm();
      this.showEditCard = false;
      this.presentToast('Lecturer successfully updated!');
    }
  }

  async deleteLecturer(lecturerId: string) {
    await this.firestore.collection('registered staff').doc(lecturerId).delete();
    this.presentToast('Lecturer successfully deleted!');
  }

  resetForm() {
    this.lecturerFullName = '';
    this.lecturerEmail = '';
    this.lecturerStaffNumber = '';
    this.lecturerDepartment = '';
    this.selectedLecturerId = null;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  async onSubmit() {
    if (this.showEditCard) {
      await this.updateLecturer();
    } else if (this.showAddCard) {
      await this.addLecturer();
    }
    this.resetForm();
    this.showAddCard = false;
    this.showEditCard = false;
  }

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          handler: () => {
            // Handle logout
          },
        },
      ],
    });
    await alert.present();
  }
}
