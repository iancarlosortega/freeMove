import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService, UserService, CountryService } from 'src/app/services';
import { User } from 'src/app/interfaces';

import { NewUserComponent } from './new-user.component';

class AuthServiceStub {
  register(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}

class UserServiceStub {
  setUser(user: User) {}

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

  updateUser(user: User) {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}

class ToastrServiceStub {}
class CountryServiceStub {
  getCountries() {
    return of(['Ukraine', 'Spain', 'USA']);
  }

  getCitiesByCountry(country: string) {
    return of(['Kyiv', 'Lviv', 'Odessa']);
  }
}

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;
  let ageField: AbstractControl;
  let phoneField: AbstractControl;
  let genderField: AbstractControl;
  let countryField: AbstractControl;
  let cityField: AbstractControl;
  let weightField: AbstractControl;
  let heightField: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewUserComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
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
          provide: ToastrService,
          useClass: ToastrServiceStub,
        },
        {
          provide: CountryService,
          useClass: CountryServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    ageField = component.newUserForm.controls['age'];
    phoneField = component.newUserForm.controls['phone'];
    genderField = component.newUserForm.controls['gender'];
    countryField = component.newUserForm.controls['country'];
    cityField = component.newUserForm.controls['city'];
    weightField = component.newUserForm.controls['weight'];
    heightField = component.newUserForm.controls['height'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with seven fields: age, phone, gender, country, city, weight and height', () => {
    cityField.enable();
    expect(component.newUserForm.contains('age')).toBeTruthy();
    expect(component.newUserForm.contains('phone')).toBeTruthy();
    expect(component.newUserForm.contains('gender')).toBeTruthy();
    expect(component.newUserForm.contains('country')).toBeTruthy();
    expect(component.newUserForm.contains('city')).toBeTruthy();
    expect(component.newUserForm.contains('weight')).toBeTruthy();
    expect(component.newUserForm.contains('height')).toBeTruthy();
  });

  it('should weight field be required', () => {
    weightField.setValue('');
    expect(weightField.valid).toBeFalsy();
  });

  it('should height field be required', () => {
    heightField.setValue('');
    expect(heightField.valid).toBeFalsy();
  });

  it('should weight field be at least 0', () => {
    weightField.setValue(-1);
    expect(weightField.valid).toBeFalsy();
    weightField.setValue(1);
    expect(weightField.valid).toBeTruthy();
  });

  it('should height field be at least 0', () => {
    heightField.setValue(-1);
    expect(heightField.valid).toBeFalsy();
    heightField.setValue(1);
    expect(heightField.valid).toBeTruthy();
  });

  it('should city field be enable when country field changes', () => {
    expect(cityField.enabled).toBeFalsy();
    countryField.setValue('Ukraine');
    expect(cityField.enabled).toBeTruthy();
  });

  it('should call updateUser method from UserService if form is valid', () => {
    const userService = TestBed.inject(UserService);
    const spy = spyOn(userService, 'updateUser').and.callThrough();

    weightField.setValue(70);
    heightField.setValue(170);

    component.saveUserInfo();

    expect(spy).toHaveBeenCalled();
  });

  it('should not call updateUser method from UserService if form is invalid', () => {
    const userService = TestBed.inject(UserService);
    const spy = spyOn(userService, 'updateUser').and.callThrough();

    weightField.setValue(-1);
    heightField.setValue(-1);

    component.saveUserInfo();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should return false if input is invalid', () => {
    weightField.setValue(-1);
    weightField.markAsTouched();
    expect(component.invalidInput('weight')).toBeTruthy();
  });

  it('should return true if input is valid', () => {
    weightField.setValue(70);
    weightField.markAsTouched();
    expect(component.invalidInput('weight')).toBeFalsy();
  });
});
