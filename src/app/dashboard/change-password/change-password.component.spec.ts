import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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

class AuthServiceStub {}

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
