import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:3000/api';

  constructor(private http: HttpClient) {
    console.log('Testing API connection...');
    this.http.get(`${this.apiUrl}/health`).subscribe(
      res => console.log('API connection successful:', res),
      err => console.error('API connection failed:', err)
    );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private getHttpOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post(`${this.apiUrl}/auth/login`, credentials, {
      headers: headers,
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => error);
  }

  createPayment(payment: { amount: number, currency: string, recipient: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments`, payment, { headers: this.getHeaders() });
  }

  getPayments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  register(userData: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  getAllPayments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/employee`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getAllCustomers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/employee/customers`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  createEmployee(employeeData: { email: string, password: string, role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/create-employee`, employeeData, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }
}