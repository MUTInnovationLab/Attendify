
import { Component } from '@angular/core';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.page.html',
  styleUrls: ['./student-profile.page.scss'],
})
export class StudentProfilePage {

  constructor() {}

  showSection(sectionId: string) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => {
      section.setAttribute('style', 'display: none;');
    });
    document.getElementById(sectionId + '-section')?.setAttribute('style', 'display: block;');
    const menuController = document.querySelector('ion-menu-controller');
    
  }
}
