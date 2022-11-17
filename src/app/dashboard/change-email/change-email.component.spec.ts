import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import firebase from 'firebase/compat';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/interfaces';
import { AuthService, UserService } from 'src/app/services';

import { ChangeEmailComponent } from './change-email.component';

type UserCredential = firebase.auth.UserCredential;

class AuthServiceStub {
  updateEmail() {}

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

  setUser(user: User) {}

  updateUser(): Promise<void> {
    return new Promise((resolve) =>
      resolve(new Promise((resolve) => resolve()))
    );
  }
}

class ToastrServiceStub {
  success() {}
}

describe('ChangeEmailComponent', () => {
  let component: ChangeEmailComponent;
  let fixture: ComponentFixture<ChangeEmailComponent>;
  let oldEmailField: AbstractControl;
  let newEmailField: AbstractControl;
  let passwordField: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeEmailComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: ToastrService, useClass: ToastrServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    oldEmailField = component.newEmailForm.controls['oldEmail'];
    newEmailField = component.newEmailForm.controls['newEmail'];
    passwordField = component.newEmailForm.controls['password'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with 3 fields', () => {
    oldEmailField.enable();
    expect(component.newEmailForm.contains('oldEmail')).toBeTruthy();
    expect(component.newEmailForm.contains('newEmail')).toBeTruthy();
    expect(component.newEmailForm.contains('password')).toBeTruthy();
  });

  it('should oldEmail field be required', () => {
    oldEmailField?.setValue('');
    expect(oldEmailField?.valid).toBeFalsy();
  });

  it('should oldEmailField be a valid email', () => {
    oldEmailField?.setValue('');
    expect(oldEmailField?.valid).toBeFalsy();
    oldEmailField.enable();
    oldEmailField?.setValue('iancarlosortegaleon@gmail.com');
    expect(oldEmailField?.valid).toBeTruthy();
  });

  it('should newEmail field be required', () => {
    newEmailField?.setValue('');
    expect(newEmailField?.valid).toBeFalsy();
  });

  it('should newEmailField be a valid email', () => {
    newEmailField?.setValue('');
    expect(newEmailField?.valid).toBeFalsy();
    newEmailField?.setValue('iancarlosortegaleon@gmail.com');
    expect(newEmailField?.valid).toBeTruthy();
  });

  it('should password field be required', () => {
    passwordField?.setValue('');
    expect(passwordField?.valid).toBeFalsy();
  });

  it('should passwordField have at least 6 characters to be valid', () => {
    passwordField?.setValue('');
    expect(passwordField?.valid).toBeFalsy();
    passwordField?.setValue('123456');
    expect(passwordField?.valid).toBeTruthy();
  });

  it('should form be invalid if any field is invalid', () => {
    oldEmailField?.setValue('');
    newEmailField?.setValue('');
    passwordField?.setValue('');
    expect(component.newEmailForm.valid).toBeFalsy();

    oldEmailField?.setValue('iancarlos@gmail.com');
    newEmailField?.setValue('iancarlosortega@gmail.com');
    passwordField?.setValue('123456');
    expect(component.newEmailForm.valid).toBeTruthy();
  });

  it('should return false if input is invalid', () => {
    oldEmailField.enable();
    oldEmailField?.setValue('');
    oldEmailField?.markAsTouched();
    expect(component.invalidInput('oldEmail')).toBeTruthy();
  });

  it('should return true if input is valid', () => {
    oldEmailField?.setValue('iancarlosortegaleon@gmail.com');
    oldEmailField?.markAsTouched();
    expect(component.invalidInput('oldEmail')).toBeFalsy();
  });

  it('should newEmailForm be initialized with the current user email', () => {
    expect(oldEmailField?.value).toBe('iancarlosortegaleon@gmail.com');
  });

  it('should newEmailForm be disabled if user provider is different from email and password', () => {
    expect(component.newEmailForm.enabled).toBeTruthy();
    expect(component.isDisabled).toBeFalsy();
  });

  it('should call loginEmailPassword method from AuthService when form is valid', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'loginEmailPassword').and.callThrough();

    oldEmailField?.setValue('iancarlosortegaleon@gmail.com');
    newEmailField?.setValue('iancarlos@gmail.com');
    passwordField?.setValue('123456');

    component.updateEmail();

    expect(spy).toHaveBeenCalled();
  });

  it('should not call loginEmailPassword method from AuthService when form is invalid', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'loginEmailPassword').and.callThrough();

    oldEmailField?.setValue('');
    newEmailField?.setValue('');
    passwordField?.setValue('');

    component.updateEmail();

    expect(spy).not.toHaveBeenCalled();
  });
});
