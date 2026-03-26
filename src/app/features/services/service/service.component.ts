import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../api/auth.service';
@Component({
  selector: 'app-service',
  imports: [RouterModule, MaterialModule, HttpClientModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent {
  isMenuOpen = false;
  role: string | null = null;
  constructor(public router: Router, public authService: AuthService) {}
  
    ngOnInit() {
      this.role = this.authService.role;
      console.log('User Role:', this.role);
    }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
