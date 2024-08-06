import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SuperAdminPageRoutingModule } from './super-admin-routing.module';
import { SuperAdminPage } from './super-admin.page';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Ensure correct import

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperAdminPageRoutingModule,
    AngularFirestoreModule // Import Firestore module here
  ],
  declarations: [SuperAdminPage]
})
export class SuperAdminPageModule {}
