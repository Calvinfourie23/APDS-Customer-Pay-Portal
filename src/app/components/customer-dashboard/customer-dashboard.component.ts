import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html'
})
export class CustomerDashboardComponent implements OnInit {
  payments: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.apiService.getPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
      },
      error: (error) => {
        console.error('Failed to load payments', error);
      }
    });
  }

  onPaymentCreated() {
    this.loadPayments();
  }
}
