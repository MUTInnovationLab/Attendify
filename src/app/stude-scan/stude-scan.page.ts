import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import {   ToastController , AlertController} from '@ionic/angular';

@Component({
  selector: 'app-stude-scan',
  templateUrl: './stude-scan.page.html',
  styleUrls: ['./stude-scan.page.scss'],
})
export class StudeScanPage implements OnInit {
  navController: NavController;
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {this.navController = navCtrl;}

  ngOnInit() {}

  async scanBarcode() {
    try {
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

        const moduleName = qrCodeData.moduleName;

        const attendanceDetails = {
          email: user.email || '',
          name: qrCodeData.name || '',
          surname: qrCodeData.surname || '',
          studentNumber: qrCodeData.studentNumber || '',
          password: qrCodeData.password || '',
          scanDate: new Date(),
          module: moduleName
        };

        await this.firestore.collection('registerAttendies').doc(userId).set(attendanceDetails);
        console.log('Attendance stored successfully.');
      } else {
        console.error('No barcode data found.');
      }
    } catch (error) {
      console.error('Barcode scanning error:', error);
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
        }, {
          text: 'Confirm',
          handler: () => {
           
            
            this.auth.signOut().then(() => {
              this.navController.navigateForward("/login");
              this.presentToast()
        
        
            }).catch((error) => {
            
            });
  
  
  
          }
        }
      ]
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
}
