import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from 'src/app/interfaces';
import { AuthService, UserService, ValidatorService } from 'src/app/services';

import { RegisterComponent } from './register.component';

class AuthServiceStub {
  register(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}

class UserServiceStub {
  createUser(user: User) {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}

class ValidatorServiceStub {
  sameFields(field1: string, field2: string) {
    return (formGroup: FormGroup) => {
      const field1Control = formGroup.controls[field1];
      const field2Control = formGroup.controls[field2];

      if (field1Control.value === field2Control.value) {
        field2Control.setErrors(null);
      } else {
        field2Control.setErrors({ sameFields: true });
      }
    };
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let emailField: AbstractControl;
  let nameField: AbstractControl;
  let passwordField: AbstractControl;
  let password2Field: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceStub,
        },
        {
          provide: UserService,
          useClass: UserServiceStub,
        },
        {
          provide: ValidatorService,
          useClass: ValidatorServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    emailField = component.registerForm.controls['email'];
    nameField = component.registerForm.controls['name'];
    passwordField = component.registerForm.controls['password'];
    password2Field = component.registerForm.controls['password2'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with four fields, email, name, password and password2', () => {
    expect(component.registerForm.contains('email')).toBeTruthy();
    expect(component.registerForm.contains('name')).toBeTruthy();
    expect(component.registerForm.contains('password')).toBeTruthy();
    expect(component.registerForm.contains('password2')).toBeTruthy();
  });

  it('should email field be required', () => {
    emailField?.setValue('');
    expect(emailField?.valid).toBeFalsy();
  });

  it('should email field be a valid email', () => {
    emailField?.setValue('test');
    expect(emailField?.valid).toBeFalsy();
  });

  it('should name field be required', () => {
    nameField?.setValue('');
    expect(nameField?.valid).toBeFalsy();
  });

  it('should name field have at least 6 characters', () => {
    nameField?.setValue('Ian Carlos');
    expect(nameField?.valid).toBeTrue();
  });

  it('should password field be required', () => {
    passwordField?.setValue('');
    expect(passwordField?.valid).toBeFalsy();
  });

  it('should password field have at least 6 characters', () => {
    passwordField?.setValue('123456');
    expect(passwordField?.valid).toBeTruthy();
  });

  it('should password2 be the same as password', () => {
    passwordField?.setValue('123456');
    password2Field?.setValue('123456');
    expect(password2Field?.valid).toBeTruthy();
  });

  it('should call register method from AuthService if form is valid', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'register').and.callThrough();

    nameField?.setValue('Ian Carlos');
    emailField?.setValue('iancarlosortegaleon@gmail.com');
    passwordField?.setValue('123456');
    password2Field?.setValue('123456');

    component.registerUser();

    expect(spy).toHaveBeenCalled();
  });

  it('should not call register method from AuthService if form is invalid', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'register').and.callThrough();

    nameField?.setValue('');
    emailField?.setValue('');
    passwordField?.setValue('');
    password2Field?.setValue('123');

    component.registerUser();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should return false if input is invalid', () => {
    emailField?.setValue('');
    emailField?.markAsTouched();
    expect(component.invalidInput('email')).toBeTruthy();
  });

  it('should return true if input is valid', () => {
    emailField?.setValue('iancarlosortegaleon@gmail.com');
    emailField?.markAsTouched();
    expect(component.invalidInput('email')).toBeFalsy();
  });
});
