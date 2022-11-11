import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/interfaces';
import { UserService, AlertService } from 'src/app/services';

import { LinkAccountComponent } from './link-account.component';

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

class AlertServiceStub {
  getAlertByUser(idUser: string) {
    return of({
      idUser: '1',
      idAlert: '1',
      isActive: true,
      notificationStatus: 'pending',
      emailToVinculate: 'iancarlosortegaleon@gmail.com',
      emailFrom: '',
    });
  }
}

class MatDialogStub {}

describe('LinkAccountComponent', () => {
  let component: LinkAccountComponent;
  let fixture: ComponentFixture<LinkAccountComponent>;
  let linkedEmailField: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkAccountComponent],
      imports: [ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: MatDialog, useClass: MatDialogStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    linkedEmailField = component.linkAccountForm.controls['linkedEmail'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with linkedEmail field', () => {
    linkedEmailField.enable();
    expect(component.linkAccountForm.contains('linkedEmail')).toBeTruthy();
  });

  it('should linkedEmail field be required', () => {
    linkedEmailField.enable();
    linkedEmailField.setValue('');
    expect(linkedEmailField.valid).toBeFalsy();
  });

  it('should linkedEmail field have to be a valid email', () => {
    linkedEmailField.enable();
    linkedEmailField.setValue('iancarlosortegaleon');
    expect(linkedEmailField.valid).toBeFalsy();

    linkedEmailField.setValue('iancarlosortegaleon@gmail.com');
    expect(linkedEmailField.valid).toBeTruthy();
  });

  it('should return false if input is invalid', () => {
    linkedEmailField.enable();
    linkedEmailField?.setValue('');
    linkedEmailField?.markAsTouched();
    expect(component.invalidInput('linkedEmail')).toBeTruthy();
  });

  it('should return true if input is valid', () => {
    linkedEmailField.enable();
    linkedEmailField?.setValue('iancarlosortegaleon@gmail.com');
    linkedEmailField?.markAsTouched();
    expect(component.invalidInput('linkedEmail')).toBeFalsy();
  });

  it('should linkedEmail field have to be disabled when notification status is pending', () => {
    expect(linkedEmailField.disabled).toBeTruthy();
  });

  it('should button have text "Invitación enviada" when notification status is pending', () => {
    const button = fixture.nativeElement.querySelector('.primary-button');
    expect(button.textContent).toContain('Invitación enviada');
  });

  it('should button be disabled when notification status is pending', () => {
    const button = fixture.nativeElement.querySelector('.primary-button');
    expect(button.disabled).toBeTruthy();
  });
});
