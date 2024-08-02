import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface Lecturer {
  id: number;
  fullName: string;
  email: string;
  position: string;
  staffNumber: string;
  department: string;
}

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.page.html',
  styleUrls: ['./super-admin.page.scss'],
})
export class SuperAdminPage implements OnInit {
  lecturers: Lecturer[] = [];
  lecturerFullName = '';
  lecturerEmail = '';
  lecturerPosition = '';
  lecturerStaffNumber = '';
  lecturerDepartment = '';
  selectedLecturerId: number | null = null;
  showAddCard = false;
  showEditCard = false;

  departments: string[] = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Medicine',
    'Law',
    'Business',
    'Economics',
    'Education',
    'Arts',
    'History',
    'Geography',
    'Philosophy',
    'Sociology',
    'Psychology',
    'Political Science',
    'Anthropology',
    'Linguistics',
    'Environmental Science',
  ];

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.loadLecturers();
  }

  loadLecturers() {
    // Load lecturers from a service or local storage.
    // This is just a mock example.
    this.lecturers = [
      {
        id: 1,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Professor',
        staffNumber: '12345',
        department: 'Computer Science',
      },
      {
        id: 2,
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        position: 'Lecturer',
        staffNumber: '67890',
        department: 'Mathematics',
      },
    ];
  }

  addLecturer() {
    const newLecturer: Lecturer = {
      id: this.lecturers.length + 1,
      fullName: this.lecturerFullName,
      email: this.lecturerEmail,
      position: this.lecturerPosition,
      staffNumber: this.lecturerStaffNumber,
      department: this.lecturerDepartment,
    };
    this.lecturers.push(newLecturer);
    this.resetForm();
    this.showAddCard = false;
  }

  editLecturer(lecturer: Lecturer) {
    this.selectedLecturerId = lecturer.id;
    this.lecturerFullName = lecturer.fullName;
    this.lecturerEmail = lecturer.email;
    this.lecturerPosition = lecturer.position;
    this.lecturerStaffNumber = lecturer.staffNumber;
    this.lecturerDepartment = lecturer.department;
    this.showEditCard = true;
    this.showAddCard = false;
  }

  updateLecturer() {
    const index = this.lecturers.findIndex(lecturer => lecturer.id === this.selectedLecturerId);
    if (index !== -1) {
      this.lecturers[index] = {
        id: this.selectedLecturerId!,
        fullName: this.lecturerFullName,
        email: this.lecturerEmail,
        position: this.lecturerPosition,
        staffNumber: this.lecturerStaffNumber,
        department: this.lecturerDepartment,
      };
      this.resetForm();
      this.showEditCard = false;
    }
  }

  deleteLecturer(lecturerId: number) {
    this.lecturers = this.lecturers.filter(lecturer => lecturer.id !== lecturerId);
  }

  resetForm() {
    this.lecturerFullName = '';
    this.lecturerEmail = '';
    this.lecturerPosition = '';
    this.lecturerStaffNumber = '';
    this.lecturerDepartment = '';
    this.selectedLecturerId = null;
  }

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          handler: () => {
            // Handle logout
          },
        },
      ],
    });
    await alert.present();
  }
}
