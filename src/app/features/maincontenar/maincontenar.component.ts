import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SideHeaderComponent } from '../side-header/side-header.component';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { EmergencyNursingDeskHeaderComponent } from '../emergency-nursing-desk-header/emergency-nursing-desk-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maincontenar',
  imports: [HeaderComponent, SideHeaderComponent , RouterModule , EmergencyNursingDeskHeaderComponent , CommonModule],
  templateUrl: './maincontenar.component.html',
  styleUrl: './maincontenar.component.css'
})
export class MaincontenarComponent {
 
deskType!: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

 ngOnInit() {
   if (this.route) {
   this.route.paramMap.subscribe(params => {
    this.deskType = params.get('deskType') || '';
    console.log('Desk Type:', this.deskType);
  });
  }
}
}
