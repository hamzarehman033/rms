import { Component } from '@angular/core';

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  displayAddCustomerDialog = false;

  openAddCustomerDialog() {
    this.displayAddCustomerDialog = true;
  }

  onCustomerAdded(customerData: any) {
    console.log('Customer added:', customerData);
    this.displayAddCustomerDialog = false;
  }
}
