import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app'; // Import firebase app

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.page.html',
  styleUrls: ['./lecture.page.scss'],
})
export class LecturePage implements OnInit {
  showAddCard: boolean = false;

  contact_nom: string = '';
  contact_email: string = '';
  contact_sujet: string = '';
  contact_message: string = '';

  moduleName: any;
  moduleCode: any;
  moduleLevel: any;
  userData: any;
  tableData: any[] = [];
  selectedModuleId: string | null = null; // Store selected module ID
  navController: NavController;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.navController = navCtrl;
  }

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        this.getData(user.email);
      } else {
        console.log('User not logged in or email is null.');
      }
    });
  }

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to SIGN OUT?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'my-custom-alert',
          handler: () => {
            console.log('Confirmation canceled');
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            this.auth
              .signOut()
              .then(() => {
                this.navController.navigateForward('/login');
                this.presentToast();
              })
              .catch((error) => {
                console.error('Sign out error:', error);
              });
          },
        },
      ],
    });
    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'SIGNED OUT!',
      duration: 1500,
      position: 'top',
    });
    await toast.present();
  }

  async addModule() {
    const loader = await this.loadingController.create({
      message: 'Submitting...',
      cssClass: 'custom-loader-class',
    });
    await loader.present();

    try {
      const user = firebase.auth().currentUser;

      if (user && user.email) {
        await this.db.collection('modules').add({
          moduleName: this.moduleName,
          moduleCode: this.moduleCode,
          moduleLevel: this.moduleLevel,
          userEmail: user.email,
        });

        this.moduleName = '';
        this.moduleCode = '';
        this.moduleLevel = '';

        loader.dismiss();
        alert('Module successfully saved');
        this.getData(user.email); // Refresh the module list
      } else {
        loader.dismiss();
        alert('User not logged in or email is null.');
      }
    } catch (error) {
      loader.dismiss();
      console.error('Error saving module:', error);
      alert('An error occurred while saving the module.');
    }
  }

  async deleteModule() {
    if (!this.selectedModuleId) {
      alert('No module selected for deletion.');
      return;
    }

    const loader = await this.loadingController.create({
      message: 'Deleting...',
      cssClass: 'custom-loader-class',
    });
    await loader.present();

    try {
      await this.db.collection('modules').doc(this.selectedModuleId).delete();
      alert('Module successfully deleted');
      this.selectedModuleId = null; // Clear the selected module
      const user = firebase.auth().currentUser;
      if (user && user.email) {
        this.getData(user.email); // Refresh the module list
      }
      loader.dismiss();
    } catch (error) {
      loader.dismiss();
      console.error('Error deleting module:', error);
      alert('An error occurred while deleting the module.');
    }
  }

  selectModule(moduleId: string) {
    this.selectedModuleId = moduleId;
    // Update the table selection
    this.updateTableSelection();
  }

  updateTableSelection() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      const htmlRow = row as HTMLElement;
      if (htmlRow.dataset['id'] === this.selectedModuleId) {
        htmlRow.classList.add('selected');
      } else {
        htmlRow.classList.remove('selected');
      }
    });
  }

  gotoQRscan(moduleCode: string) {
    this.router.navigate(['qr-scan'], { queryParams: { moduleCode } });
  }

  gotoProfile() {
    this.router.navigate(['profile']);
  }

  gotoAttendies() {
    this.router.navigate(['attendies']);
  }

  getData(userEmail: string) {
    this.db
      .collection('modules', (ref) => ref.where('userEmail', '==', userEmail))
      .snapshotChanges()
      .subscribe((data) => {
        this.userData = data.map((d) => {
          const id = d.payload.doc.id;
          const docData = d.payload.doc.data() as any;
          return { id, ...docData };
        });
        console.log(this.userData);
        this.tableData = this.userData;
        // Update the table selection after data is loaded
        this.updateTableSelection();
      });
  }
}