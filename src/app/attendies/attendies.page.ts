import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-attendies',
  templateUrl: './attendies.page.html',
  styleUrls: ['./attendies.page.scss'],
})
export class AttendiesPage implements OnInit {

  attendanceDetails: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.fetchAttendanceDetails();
  }

  fetchAttendanceDetails() {
    this.firestore.collection('registerAttendies').valueChanges().subscribe((data: any[]) => {
      this.attendanceDetails = data;
    });
  }

}
