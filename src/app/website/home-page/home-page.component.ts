import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule,MaterialModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  
  constructor(public router: Router) {}
  cards = [
    { title: 'Patient Management', icon: 'person', desc: 'Manage patient records efficiently' },
    { title: 'Appointments', icon: 'event', desc: 'Schedule and track appointments' },
    { title: 'Lab Reports', icon: 'science', desc: 'View and manage lab reports' },
    { title: 'Pharmacy', icon: 'local_pharmacy', desc: 'Medicine and stock management' },
    { title: 'Analytics', icon: 'bar_chart', desc: 'Visualize hospital data' },
    { title: 'Staff', icon: 'groups', desc: 'Manage staff and departments' },
  ];

  Login() {
    this.router.navigate(['/login']);
  }
    isMenuOpen = false;

  toggleMenu() {
    console.log('click')
    this.isMenuOpen = !this.isMenuOpen;
  }
}
