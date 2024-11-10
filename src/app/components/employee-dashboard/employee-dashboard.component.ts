import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html'
})
export class EmployeeDashboardComponent implements OnInit {
  allPayments: any[] = [];
  allCustomers: any[] = [];
  employeeForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8)
      ]]
    });
  }

  ngOnInit() {
    this.loadAllPayments();
    this.loadAllCustomers();
  }

  loadAllPayments() {
    this.apiService.getAllPayments().subscribe(
      (payments) => {
        this.allPayments = payments;
        this.updateCustomerTransactionCounts();
      },
      (error) => {
        console.error('Failed to load payments', error);
      }
    );
  }

  loadAllCustomers() {
    this.apiService.getAllCustomers().subscribe(
      (customers) => {
        this.allCustomers = customers;
      },
      (error) => {
        console.error('Failed to load customers', error);
      }
    );
  }

  updateCustomerTransactionCounts() {
    const counts = new Map();
    this.allPayments.forEach(payment => {
      const userId = payment.user._id;
      counts.set(userId, (counts.get(userId) || 0) + 1);
    });
    
    this.allCustomers = this.allCustomers.map(customer => ({
      ...customer,
      transactionCount: counts.get(customer._id) || 0
    }));
  }

  addEmployee() {
    if (this.employeeForm.valid) {
      const employeeData = {
        email: this.employeeForm.value.email,
        password: this.employeeForm.value.password,
        role: 'employee'
      };
      
      this.apiService.createEmployee(employeeData).subscribe(
        (response) => {
          console.log('Employee added successfully', response);
          this.employeeForm.reset();
        },
        (error) => {
          console.error('Failed to add employee', error);
          if (error.error && error.error.errors) {
            console.log('Validation errors:', error.error.errors);
          }
        }
      );
    }
  }
}
