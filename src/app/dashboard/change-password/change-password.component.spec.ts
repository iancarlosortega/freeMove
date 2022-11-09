import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/interfaces';
import { ValidatorService, AuthService, UserService } from 'src/app/services';

import { ChangePasswordComponent } from './change-password.component';

class ToastrServiceStub {}

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

class AuthServiceStub {
  loginEmailPassword() {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}

class UserServiceStub {
  get user$(): Observable<User> {
    return of({
      idUser: '1',
      email: 'iancarlosortegaleon@gmail.com',
      name: 'Ian Carlos',
      age: 20,
      phone: '+380501234567',
      role: 'ADMIN-ROLE',
      provider: 'email-password',
    });
  }
}

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let oldPasswordField: AbstractControl;
  let passwordField: AbstractControl;
  let passwordField2: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ToastrService, useClass: ToastrServiceStub },
        { provide: ValidatorService, useClass: ValidatorServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    oldPasswordField = component.newPasswordForm.controls['oldPassword'];
    passwordField = component.newPasswordForm.controls['password'];
    passwordField2 = component.newPasswordForm.controls['password2'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with 3 fields', () => {
    expect(component.newPasswordForm.contains('oldPassword')).toBeTruthy();
    expect(component.newPasswordForm.contains('password')).toBeTruthy();
    expect(component.newPasswordForm.contains('password2')).toBeTruthy();
  });

  it('should make the old password field required', () => {
    oldPasswordField.setValue('');
    expect(oldPasswordField.valid).toBeFalsy();
  });

  it('should password field have at least 6 characters to be valid', () => {
    passwordField.setValue('12345');
    expect(passwordField.valid).toBeFalsy();

    passwordField.setValue('123456');
    expect(passwordField.valid).toBeTruthy();
  });

  it('should password2 field have at least 6 characters and be the same as passwordField to be valid', () => {
    passwordField2.setValue('12345');
    expect(passwordField2.valid).toBeFalsy();

    passwordField.setValue('123456');
    passwordField2.setValue('123456');
    expect(passwordField2.valid).toBeTruthy();
  });

  it('should form be invalid when empty', () => {
    expect(component.newPasswordForm.valid).toBeFalsy();
  });

  it('should return false if input is invalid', () => {
    oldPasswordField?.setValue('');
    oldPasswordField?.markAsTouched();
    expect(component.invalidInput('oldPassword')).toBeTruthy();
  });

  it('should return true if input is valid', () => {
    oldPasswordField?.setValue('iancarlosortegaleon@gmail.com');
    oldPasswordField?.markAsTouched();
    expect(component.invalidInput('oldPassword')).toBeFalsy();
  });

  it('should call loginEmailPassword method from AuthService when form is valid', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'loginEmailPassword').and.callThrough();

    oldPasswordField?.setValue('123456');
    passwordField?.setValue('123456');
    passwordField2?.setValue('123456');

    component.updatePassword();

    expect(spy).toHaveBeenCalled();
  });

  it('should not call loginEmailPassword method from AuthService when form is invalid', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'loginEmailPassword').and.callThrough();

    oldPasswordField?.setValue('');
    passwordField?.setValue('');
    passwordField2?.setValue('123456');

    component.updatePassword();

    expect(spy).not.toHaveBeenCalled();
  });
});
