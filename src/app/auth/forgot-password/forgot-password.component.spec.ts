import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services';

import { ForgotPasswordComponent } from './forgot-password.component';

class AuthServiceStub {
  forgotPassword(email: string) {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let emailField: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceStub,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    emailField = component.forgotPasswordForm.controls['email'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with email field', () => {
    expect(component.forgotPasswordForm.contains('email')).toBeTruthy();
  });

  it('should email field be required', () => {
    emailField?.setValue('');
    expect(emailField?.valid).toBeFalsy();
  });

  it('should email field be a valid email', () => {
    emailField?.setValue('test');
    expect(emailField?.valid).toBeFalsy();
  });

  it('should call forgotPassword method from AuthService if form is valid', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'forgotPassword').and.callThrough();

    emailField?.setValue('iancarlosortegaleon@gmail.com');
    component.sendEmail();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call forgotPassword method from AuthService if form is invalid', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'forgotPassword').and.callThrough();

    emailField?.setValue('');
    component.sendEmail();
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
