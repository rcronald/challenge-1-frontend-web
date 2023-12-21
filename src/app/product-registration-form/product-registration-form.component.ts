import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup
} from '@angular/forms';

declare type ProductRegistrationForm = {
  serialNumber: FormControl<string | null>
}

@Component({
  selector: 'app-product-registration-form',
  templateUrl: './product-registration-form.component.html',
  styleUrls: ['./product-registration-form.component.scss']
})
export class ProductRegistrationFormComponent {
  productRegistrationForm!: FormGroup<ProductRegistrationForm>;

  constructor() {
    this.productRegistrationForm = new FormGroup({
      serialNumber: new FormControl<string | null>('')
    });
  }

  get serialNumberField(): FormControl<string> {
    return this.productRegistrationForm.get('serialNumber') as FormControl;
  }
}
