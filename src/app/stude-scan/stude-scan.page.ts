import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController,  ModalController } from '@ionic/angular';
import { ToastController, AlertController } from '@ionic/angular';
import { ViewModalComponent } from '../view-modal/view-modal.component';

interface UserData {
  name: string;
  surname: string;
  studentNumber: string;
  password: string;
}

@Component({
  selector: 'app-stude-scan',
  templateUrl: './stude-scan.page.html',
  styleUrls: ['./stude-scan.page.scss'],
})



export class StudeScanPage implements OnInit {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}
  async presentViewModal() {
    const modal = await this.modalController.create({
      component: ViewModalComponent
    });
    return await modal.present();
  }
  
  
  async scanBarcode() {
    try {
      // Ensure the scanner uses the rear camera
      await BarcodeScanner.checkPermission({ force: true });

      // Start the scan
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        console.log('Scanned data:', result.content);

        const user = await this.auth.currentUser;

        if (!user) {
          console.error('User not logged in.');
          return;
        }

        const userId: string = user.email || '';

        const qrCodeData = JSON.parse(result.content);

        if (!qrCodeData || !qrCodeData.moduleName) {
          console.error('QR code data does not contain a valid module name.');
          return;
        }

        // Fetch user data from registeredStudents collection
        const userDoc: AngularFirestoreDocument<UserData> = this.firestore.collection('registeredStudents').doc(userId);
        const userDocSnapshot = await userDoc.get().toPromise();
        
        if (!userDocSnapshot || !userDocSnapshot.exists) {
          console.error('No user data found.');
          return;
        }

        const userData = userDocSnapshot.data();

        if (!userData) {
          console.error('User data is empty.');
          return;
        }

        const moduleName = qrCodeData.moduleName;

        const attendanceDetails = {
          email: user.email || '',
          name: userData.name || '',
          surname: userData.surname || '',
          studentNumber: userData.studentNumber || '',
          password: userData.password || '',
          scanDate: new Date(),
          module: moduleName
        };

        await this.firestore.collection('registerAttendies').doc(userId).set(attendanceDetails);
        console.log('Attendance stored successfully.');

        this.presentToast('Attendance recorded successfully.', 'success');
      } else {
        console.error('No barcode data found.');
      }
    } catch (error) {
      console.error('Barcode scanning error:', error);
      this.presentToast('Error during scanning. Please try again.', 'danger');
    }
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
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.auth.signOut().then(() => {
              this.navCtrl.navigateForward("/login");
              this.presentToast('SIGNED OUT!', 'success');
            }).catch((error) => {
              console.error('Sign out error:', error);
              this.presentToast('Error during sign out. Please try again.', 'danger');
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'top',
      color,
    });

    await toast.present();
  }
}
