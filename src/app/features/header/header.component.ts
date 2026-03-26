import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../api/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isMenuOpen = false;
  role: string | null = null;

  constructor(public router: Router, public authService: AuthService) {}
   ngOnInit() {
    // 👇 service se role fetch karke set kar do
    this.role = this.authService.role;
    // console.log('User Role in Header:', this.role);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  navigateTo(path: string) {
    this.router?.navigate([path]);
  }
  logout() {
    localStorage.removeItem('authToken');
    console.log('User logged out');
    this.router.navigate(['']);
  }
}
