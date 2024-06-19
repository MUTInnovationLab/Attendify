import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-stude-scan',
  templateUrl: './stude-scan.page.html',
  styleUrls: ['./stude-scan.page.scss'],
})
export class StudeScanPage implements OnInit {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

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
}
