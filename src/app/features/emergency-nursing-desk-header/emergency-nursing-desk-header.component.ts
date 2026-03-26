import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-emergency-nursing-desk-header',
    imports: [CommonModule, MatSidenavModule, MatListModule, RouterModule],
  templateUrl: './emergency-nursing-desk-header.component.html',
  styleUrl: './emergency-nursing-desk-header.component.css'
})
export class EmergencyNursingDeskHeaderComponent {

}
