import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/interfaces';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { UserService } from 'src/app/services';
import firebase from '@firebase/app-compat';

import { UsersComponent } from './users.component';

class ToastrServiceStub {
  info(message: string) {}
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
      createdAt: firebase.firestore.Timestamp.now(),
    });
  }

  getUsers() {
    return of([
      {
        idUser: '2',
        email: 'iancarlosortegaleon@gmail.com',
        name: 'Ian Carlos',
        age: 20,
        phone: '+380501234567',
        role: 'ADMIN-ROLE',
        provider: 'email-password',
        createdAt: firebase.firestore.Timestamp.now(),
      },
      {
        idUser: '3',
        email: 'iancarlosortegaleon@gmail.com',
        name: 'Ian Carlos',
        age: 20,
        phone: '+380501234567',
        role: 'ADMIN-ROLE',
        provider: 'email-password',
        createdAt: firebase.firestore.Timestamp.now(),
      },
    ]);
  }

  toggleRole(user: User, role: string) {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [PrimeNgModule, MaterialModule],
      providers: [
        { provide: ToastrService, useClass: ToastrServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mat-checkbox on change toggle the user role', () => {
    const userService = TestBed.inject(UserService);
    const spy = spyOn(userService, 'toggleRole').and.callThrough();

    const checkboxElem = fixture.debugElement.query(By.css('mat-checkbox'));
    console.log(checkboxElem.nativeElement);
    checkboxElem.triggerEventHandler('change', {});

    expect(spy).toHaveBeenCalled();
  });
});
