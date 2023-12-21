import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  RouterModule,
  Routes
} from '@angular/router';

import { AppComponent } from './app.component';
import { ProductRegistrationFormComponent } from './product-registration-form/product-registration-form.component';
import { SuccessMessageComponent } from './success-message/success-message.component';

export const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    ProductRegistrationFormComponent,
    SuccessMessageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
