import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services';

import { LoginComponent } from './login.component';

class AuthServiceStub {
  loginEmailPassword(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let emailField: AbstractControl;
  let passwordField: AbstractControl;
  let rememberField: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    emailField = component.loginForm.controls['email'];
    passwordField = component.loginForm.controls['password'];
    rememberField = component.loginForm.controls['remember'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with three fields, email, password and remember', () => {
    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
    expect(component.loginForm.contains('remember')).toBeTruthy();
  });

  it('should email field be required', () => {
    emailField?.setValue('');
    expect(emailField?.valid).toBeFalsy();
  });

  it('should email field be a valid email', () => {
    emailField?.setValue('test');
    expect(emailField?.valid).toBeFalsy();
  });

  it('should password field be required', () => {
    passwordField?.setValue('');
    expect(passwordField?.valid).toBeFalsy();
  });

  it('should password field have at least 6 characters', () => {
    passwordField?.setValue('123');
    expect(passwordField?.valid).toBeFalsy();
  });

  it('should form be invalid if fields arent valid', () => {
    emailField?.setValue('');
    passwordField?.setValue('');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should form be valid if fields are valid', () => {
    emailField?.setValue('iancarlosortegaleon@gmail.com');
    passwordField?.setValue('123456');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call loginEmailPassword method from AuthService if form is valid', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'loginEmailPassword').and.callThrough();

    emailField?.setValue('iancarlosortegaleon@gmail.com');
    passwordField?.setValue('123456');

    component.loginUser();

    expect(spy).toHaveBeenCalled();
  });

  it('should not call loginEmailPassword method from AuthService if form is invalid', () => {
    const authService = TestBed.inject(AuthService);
    const spy = spyOn(authService, 'loginEmailPassword').and.callThrough();

    emailField?.setValue('');
    passwordField?.setValue('');

    component.loginUser();

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
