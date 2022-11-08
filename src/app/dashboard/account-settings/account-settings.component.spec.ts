import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  AuthService,
  UserService,
  CountryService,
  StorageService,
} from 'src/app/services';

import { AccountSettingsComponent } from './account-settings.component';
import { User } from 'src/app/interfaces';

class ToastrServiceStub {
  success() {}
  error() {}
  info() {}
}
class AuthServiceStub {
  getClaims() {
    return of({
      claims: {
        user_id: '1',
      },
    });
  }
}
class UserServiceStub {
  getUserById() {
    return of({
      idUser: '1',
      email: 'iancarlosortegaleon@gmail.com',
      name: 'Ian Carlos',
      age: 20,
      phone: '+380501234567',
      gender: 'Masculino',
      weight: 70,
      height: 170,
      role: 'ADMIN-ROLE',
      provider: 'email-password',
    });
  }

  setUser(user: User) {}

  updateUser(): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  updateProfile(imageToUpload: File, user: User): Observable<number> {
    return of(100);
  }
}
class CountryServiceStub {
  getCountries() {
    return of(['Ukraine', 'Spain', 'USA']);
  }

  getCitiesByCountry(country: string) {
    return of(['Kyiv', 'Lviv', 'Odessa']);
  }
}
class StorageServiceStub {
  deleteImage() {}
}

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  let nameField: AbstractControl;
  let countryField: AbstractControl;
  let cityField: AbstractControl;
  let ageField: AbstractControl;
  let phoneField: AbstractControl;
  let genderField: AbstractControl;
  let weightField: AbstractControl;
  let heightField: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSettingsComponent],
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
      providers: [
        { provide: ToastrService, useClass: ToastrServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: CountryService, useClass: CountryServiceStub },
        { provide: StorageService, useClass: StorageServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    nameField = component.profileForm.controls['name'];
    countryField = component.profileForm.controls['country'];
    cityField = component.profileForm.controls['city'];
    ageField = component.profileForm.controls['age'];
    phoneField = component.profileForm.controls['phone'];
    genderField = component.profileForm.controls['gender'];
    weightField = component.profileForm.controls['weight'];
    heightField = component.profileForm.controls['height'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with 8 controls', () => {
    cityField.enable();
    expect(component.profileForm.contains('name')).toBeTruthy();
    expect(component.profileForm.contains('country')).toBeTruthy();
    expect(component.profileForm.contains('city')).toBeTruthy();
    expect(component.profileForm.contains('age')).toBeTruthy();
    expect(component.profileForm.contains('gender')).toBeTruthy();
    expect(component.profileForm.contains('phone')).toBeTruthy();
    expect(component.profileForm.contains('weight')).toBeTruthy();
    expect(component.profileForm.contains('height')).toBeTruthy();
    cityField.disable();
  });

  it('should name field be required', () => {
    nameField.setValue('');
    expect(nameField.valid).toBeFalsy();
  });

  it('should name field have at least 6 characters', () => {
    nameField.setValue('12345');
    expect(nameField.valid).toBeFalsy();
    nameField.setValue('123456');
    expect(nameField.valid).toBeTruthy();
  });

  it('should weight field be required', () => {
    weightField.setValue('');
    expect(weightField.valid).toBeFalsy();
  });

  it('should weight field value be greater or equal than 0', () => {
    weightField.setValue(-1);
    expect(weightField.valid).toBeFalsy();
    weightField.setValue(0);
    expect(weightField.valid).toBeTruthy();
  });

  it('should height field be required', () => {
    heightField.setValue('');
    expect(heightField.valid).toBeFalsy();
  });

  it('should height field value be greater or equal than 0', () => {
    heightField.setValue(-1);
    expect(heightField.valid).toBeFalsy();
    heightField.setValue(0);
    expect(heightField.valid).toBeTruthy();
  });

  it('should profileForm have user values on initialization', () => {
    expect(nameField.value).toBe('Ian Carlos');
    expect(ageField.value).toBe(20);
    expect(phoneField.value).toBe('+380501234567');
    expect(genderField.value).toBe('Masculino');
    expect(weightField.value).toBe(70);
    expect(heightField.value).toBe(170);
  });

  it('should city field be disabled until country is selected', () => {
    expect(cityField.disabled).toBeTruthy();
    countryField.setValue('Ecuador');
    expect(cityField.disabled).toBeFalsy();
  });

  it('should return false if input is invalid', () => {
    nameField?.setValue('');
    nameField?.markAsTouched();
    expect(component.invalidInput('name')).toBeTruthy();
  });

  it('should return true if input is valid', () => {
    nameField?.setValue('Ian Carlos');
    nameField?.markAsTouched();
    expect(component.invalidInput('name')).toBeFalsy();
  });

  it('should not call updateUser method from UserService if form is invalid', () => {
    const userService = TestBed.inject(UserService);
    const spy = spyOn(userService, 'updateUser').and.callThrough();

    nameField?.setValue('');
    weightField?.setValue(-1);
    heightField?.setValue(-1);

    component.updateProfile();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call updateUser method from UserService if form is valid', () => {
    const userService = TestBed.inject(UserService);
    const spy = spyOn(userService, 'updateUser').and.callThrough();

    nameField?.setValue('Ian Carlos');
    weightField?.setValue(70);
    heightField?.setValue(170);

    component.updateProfile();

    expect(spy).toHaveBeenCalled();
  });

  it('should not call updateUser if user selected an image', () => {
    component.selectedImage = new File([''], 'test.png');
    const userService = TestBed.inject(UserService);
    const spy = spyOn(userService, 'updateUser').and.callThrough();

    nameField?.setValue('Ian Carlos');
    weightField?.setValue(70);
    heightField?.setValue(170);

    component.updateProfile();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call updateProfile if user selected an image', () => {
    component.selectedImage = new File([''], 'test.png');
    const userService = TestBed.inject(UserService);
    const spy = spyOn(userService, 'updateProfile').and.callThrough();

    nameField?.setValue('Ian Carlos');
    weightField?.setValue(70);
    heightField?.setValue(170);

    component.updateProfile();

    expect(spy).toHaveBeenCalled();
  });

  it('should call deleteImage if user selected a new image and had one before', () => {
    component.selectedImage = new File([''], 'test.png');
    component.user.photoFilename = 'test.png';

    const storageService = TestBed.inject(StorageService);
    const spy = spyOn(storageService, 'deleteImage').and.callThrough();

    nameField?.setValue('Ian Carlos');
    weightField?.setValue(70);
    heightField?.setValue(170);

    component.updateProfile();

    expect(spy).toHaveBeenCalled();
  });
});
