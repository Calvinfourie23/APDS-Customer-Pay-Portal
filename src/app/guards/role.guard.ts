import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard  {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    
    if (decodedToken.role === 'employee' || decodedToken.role === 'customer') {
      return true;
    }

    this.router.navigate(['/customer-dashboard']);
    return false;
  }
}
