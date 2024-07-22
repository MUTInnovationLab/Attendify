import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {
  constructor(private barcodeScanner: BarcodeScanner, private db: AngularFireDatabase) {}

  scanQrCode() {
    return this.barcodeScanner.scan();
  }

  storeScannedData(data: any) {
    const filteredData = this.filterData(data);
    return this.db.list('scanned-data').push(filteredData);
  }

  private filterData(data: any) {
    // Perform any data filtering or transformation here
    // For example, parse JSON data from the QR code
    try {
      return JSON.parse(data.text);
    } catch (e) {
      console.error('Error parsing QR code data', e);
      return null;
    }
  }
}
