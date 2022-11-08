import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
