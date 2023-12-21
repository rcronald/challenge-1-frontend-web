import { Location } from '@angular/common';
import {
  DebugElement,
  Predicate
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import {
  BrowserModule,
  By
} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { faker } from '@faker-js/faker';

import { AppComponent } from './app.component';
import { routes } from './app.module';
import { ProductRegistrationFormComponent } from './product-registration-form/product-registration-form.component';
import { SuccessMessageComponent } from './success-message/success-message.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let location: Location;

  type ProductRegistrationForm = {
    serialNumber: FormControl<string | null>
  }

  const get$ = {
    productRegistrationForm: {
      get element(): DebugElement {
        const predicate: Predicate<DebugElement> = By.css('section[role="main"] > app-product-registration-form > form');

        return fixture.debugElement.query(predicate);
      },
      controls: {
        serialNumber: {
          get element(): DebugElement {
            const predicate: Predicate<DebugElement> = By.css('input[type="text"]#serial-number');

            return get$.productRegistrationForm.element.query(predicate);
          }
        }
      }
    },
    successMessage: {
      get element(): DebugElement {
        const predicate: Predicate<DebugElement> = By.css('section[role="main"] > app-success-message > ul');

        return fixture.debugElement.query(predicate);
      },
      serialNumber: {
        get value(): string {
          const predicate: Predicate<DebugElement> = By.css('li');

          return get$.successMessage.element.query(predicate).nativeElement.textContent.trim();
        }
      }
    }
  };

  const set$ = {
    router: {
      set path(value: string) {
        router.navigateByUrl(value);

        tick();
        fixture.detectChanges();
      }
    },
    productRegistrationForm: {
      element: {
        set value(value: [
          controls: { [control in Extract<keyof ProductRegistrationForm, string | null>]?: string } | null, options?: {
            emitEvent: boolean
          }
        ]) {
          const [controls, options]: [
            controls: { [control in Extract<keyof ProductRegistrationForm, string | null>]?: string } | null, options?: {
              emitEvent: boolean
            }
          ] = value;

          if (controls) {
            Object.entries(controls).forEach(([control, value]): void => {
              set$.productRegistrationForm.controls[control as keyof ProductRegistrationForm].element.value = value;
            });
          }

          if (options?.emitEvent === false) {
            return;
          }

          const element: DebugElement = get$.productRegistrationForm.element;
          const event: string = controls ? 'submit' : 'reset';

          {
            element.triggerEventHandler(event);
          }

          tick();
          fixture.detectChanges();
        }
      },
      controls: {
        serialNumber: {
          element: {
            set value(value: string) {
              const nativeElement: HTMLInputElement = get$.productRegistrationForm.controls.serialNumber.element.nativeElement;
              const event: Event = new Event('input');

              {
                nativeElement.value = value;
                nativeElement.dispatchEvent(event);
              }

              tick();
              fixture.detectChanges();
            }
          }
        }
      }
    }
  };

  const make$ = {
    productRegistration: {
      serialNumber: {
        any: {
          get value(): string {
            return faker.random.word();
          }
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ProductRegistrationFormComponent,
        SuccessMessageComponent
      ],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes)
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture.detectChanges();
  });

  describe('Initially', () => {
    it('should display the product registration form only', fakeAsync(() => {
      set$.router.path = '';

      `context: should display the product registration form`;
      {
        const actual: DebugElement = get$.productRegistrationForm.element;

        expect(actual).toBeTruthy();
      }

      `context: should not display the success message`;
      {
        const actual: DebugElement = get$.successMessage.element;

        expect(actual).toBeFalsy();
      }
    }));
  });

  describe('When the product registration form is submitted', () => {
    it('should not display the product registration form', fakeAsync(() => {
      set$.router.path = '';

      const reference: string = make$.productRegistration.serialNumber.any.value;

      set$.productRegistrationForm.element.value = [
        {
          serialNumber: reference
        }
      ];

      const actual: DebugElement = get$.productRegistrationForm.element;

      expect(actual).toBeFalsy();
    }));

    it('should display the success message at the `/success` path', fakeAsync(() => {
      set$.router.path = '';

      const reference: string = make$.productRegistration.serialNumber.any.value;

      set$.productRegistrationForm.element.value = [
        {
          serialNumber: reference
        }
      ];

      `context: should display the success message`;
      {
        const actual: string = get$.successMessage.serialNumber.value;
        const expected: string = `Serial number: ${reference}`;

        expect(actual).toBe(expected);
      }

      `context: at the "/success" path`;
      {
        const actual: string = location.path();
        const expected: string = '/success';

        expect(actual).toBe(expected);
      }
    }));
  });
});
