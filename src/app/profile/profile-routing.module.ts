import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';
import { AttendiesPage } from '../attendies/attendies.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage},
    {path: 'attendees', component: AttendiesPage },
    { path: '', redirectTo: '/profile', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
