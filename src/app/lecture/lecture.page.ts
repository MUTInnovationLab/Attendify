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

  constructor(private router: Router,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
    this.getData();
  }

  async addModule() {
    const loader = await this.loadingController.create({
      message: 'submitting...',
      cssClass: 'custom-loader-class',
    });
    await loader.present();

    try {
      // Get the currently logged-in user
      const user = firebase.auth().currentUser;

      if (user) {
        // If user is logged in, add the module to a new collection named 'modules'
        // and include the user's email in the module document
        await this.db.collection('modules').add({
          moduleName: this.moduleName,
          moduleCode: this.moduleCode,
          moduleLevel: this.moduleLevel,
          userEmail: user.email,
        });

        // Clear the input fields
        this.moduleName = '';
        this.moduleCode = '';
        this.moduleLevel = '';

        loader.dismiss();
        alert('Module successfully saved');
      } else {
        // Handle case where user is not logged in
        loader.dismiss();
        alert('User not logged in.');
      }
    } catch (error) {
      loader.dismiss();
      console.error('Error saving module:', error);
      alert('An error occurred while saving the module.');
    }
  }

  gotoQRscan(moduleCode: string) {
    this.router.navigate(['qr-scan'], { queryParams: { moduleCode } });
  }

  gotoProfile(moduleCode: string) {
    this.router.navigate(['profile']);
  }

  gotoAttendies(moduleCode: string) {
    this.router.navigate(['attendies']);
  }

  getData() {
    // Fetch modules associated with the logged-in user's email
    const user = firebase.auth().currentUser;

    if (user) {
      this.db
        .collection('modules', ref => ref.where('userEmail', '==', user.email))
        .snapshotChanges()
        .subscribe((data) => {
          this.userData = data.map((d) => {
            const id = d.payload.doc.id;
            const docData = d.payload.doc.data() as any; // Cast docData as any type
            return { id, ...docData };
          });
          console.log(this.userData);
          this.tableData = this.userData;
        });
    } else {
      console.log('User not logged in.');
    }
  }

}
