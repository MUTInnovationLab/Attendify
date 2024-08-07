import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

interface DeptAdmin {
  id?: string;
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
    private authService: AuthService
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
      await this.firestore.collection('registered staff').add(newDeptAdmin);
      this.resetForm();
      this.showAddCard = false;
      this.presentToast('Dept-Admin successfully added!');
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
}
