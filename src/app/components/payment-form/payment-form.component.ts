import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html'
})
export class PaymentFormComponent {
  paymentForm: FormGroup;
  @Output() paymentCreated = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.paymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      currency: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      recipient: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.apiService.createPayment(this.paymentForm.value).subscribe(
        (response) => {
          console.log('Payment created', response);
          this.paymentForm.reset();
          this.paymentCreated.emit();
        },
        (error) => {
          console.error('Payment creation failed', error);
        }
      );
    }
  }
}