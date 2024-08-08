

import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';



interface DeptAdmin {
  id?: string;
  fullName: string;
  email: string;
  position: string;
  staffNumber: string;
  department: string;
}




@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage {

  
  

  @ViewChild('addAdminModal') addAdminModal!: IonModal;

  newAdmin = {
    fullName: '',
    email: '',
    staffNumber: '',
    department: ''
  };

  admins = [
    { name: 'Thandeka Nkosi', email: 'thandeka@gmail.com', department: 'ICT', id: '12342' },
    // ... other admins ...
  ];

  openAddAdminModal() {
    this.addAdminModal.present();
  }

  dismissModal() {
    this.addAdminModal.dismiss();
  }

  deptAdmins$: Observable<DeptAdmin[]>;
  deptAdminFullName = '';
  deptAdminEmail = '';
  deptAdminStaffNumber = '';
  deptAdminDepartment = '';
  selectedDeptAdminId: string | null = null;
  showAddCard = false;
  showEditCard = false;

  departments: string[] = [
  'Agriculture',
'Biomedical Sciences',
'Building and Construction',
'Chemistry',
'Civil Engineering',
'Civil Engineering and Survey',
'Community Extension',
'Electrical Engineering',
'Environmental Health',
'Human Resource Management',
'Marketing',
'Mechanical Engineering',
'Nature Conservation',
'Office Management and Technology',
'Public Administration and Economics'
  ];

  constructor(
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {
    this.deptAdmins$ = this.firestore
      .collection<DeptAdmin>('registered staff', ref => ref.where('position', '==', 'dept-admin'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as DeptAdmin;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  ngOnInit() {}

  async addDeptAdmin() {
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser) {
      this.presentToast('You must be logged in to add a Dept-Admin.');
      return;
    }

    if (this.deptAdminFullName && this.deptAdminEmail && this.deptAdminStaffNumber && this.deptAdminDepartment) {
      // Check if the email already exists
      const emailExists = await this.firestore
        .collection<DeptAdmin>('registered staff', ref => ref.where('email', '==', this.deptAdminEmail))
        .valueChanges()
        .pipe(take(1))
        .toPromise()
        .then(deptAdmins => (deptAdmins ?? []).length > 0);

      if (emailExists) {
        this.presentToast('A Dept-Admin with this email already exists.');
        return;
      }

      const newDeptAdmin: DeptAdmin = {
        fullName: this.deptAdminFullName,
        email: this.deptAdminEmail,
        position: 'dept-admin',
        staffNumber: this.deptAdminStaffNumber,
        department: this.deptAdminDepartment,
      };

      try {
        // Add Dept-Admin to Firestore
        await this.firestore.collection('registered staff').add(newDeptAdmin);

        // Create user in Firebase Authentication
        await this.afAuth.createUserWithEmailAndPassword(this.deptAdminEmail, 'temporaryPassword123');

        // Optionally, send a password reset email to let the admin set their password
        await this.afAuth.sendPasswordResetEmail(this.deptAdminEmail);

        this.resetForm();
        this.showAddCard = false;
        this.presentToast('Dept-Admin successfully added! A login email has been sent.');
      } catch (error) {
        console.error('Error adding Dept-Admin: ', error);
        this.presentToast('Error adding Dept-Admin.');
      }
    } else {
      this.presentToast('Please fill out all fields.');
    }
  }

  editDeptAdmin(deptAdmin: DeptAdmin) {
    this.selectedDeptAdminId = deptAdmin.id!;
    this.deptAdminFullName = deptAdmin.fullName;
    this.deptAdminEmail = deptAdmin.email;
    this.deptAdminStaffNumber = deptAdmin.staffNumber;
    this.deptAdminDepartment = deptAdmin.department;
    this.showEditCard = true;
    this.showAddCard = false;
  }

  async updateDeptAdmin() {
    if (this.selectedDeptAdminId) {
      const updatedDeptAdmin: DeptAdmin = {
        fullName: this.deptAdminFullName,
        email: this.deptAdminEmail,
        position: 'dept-admin',
        staffNumber: this.deptAdminStaffNumber,
        department: this.deptAdminDepartment,
      };
      await this.firestore.collection('registered staff').doc(this.selectedDeptAdminId).update(updatedDeptAdmin);
      this.resetForm();
      this.showEditCard = false;
      this.presentToast('Dept-Admin successfully updated!');
    }
  }

  async deleteDeptAdmin(deptAdminId: string) {
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser) {
      this.presentToast('You must be logged in to delete a Dept-Admin.');
      return;
    }

    await this.firestore.collection('registered staff').doc(deptAdminId).delete();
    this.presentToast('Dept-Admin successfully deleted!');
  }

  resetForm() {
    this.deptAdminFullName = '';
    this.deptAdminEmail = '';
    this.deptAdminStaffNumber = '';
    this.deptAdminDepartment = '';
    this.selectedDeptAdminId = null;
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
      await this.updateDeptAdmin();
    } else if (this.showAddCard) {
      await this.addDeptAdmin();
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
            this.authService.logout();
          },
        },
      ],
    });
    await alert.present();
  }
  onEditIconClick() {
    // Implement your edit logic here
    console.log('Edit icon clicked');
  }

  
}