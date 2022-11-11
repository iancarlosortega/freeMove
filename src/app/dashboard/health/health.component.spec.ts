import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/interfaces';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { UserService } from 'src/app/services';

import { HealthComponent } from './health.component';

class ToastrServiceStub {
  success() {}
  error() {}
}
class UserServiceStub {
  get user$(): Observable<User> {
    return of({
      idUser: '1',
      email: 'iancarlosortegaleon@gmail.com',
      name: 'Ian Carlos',
      age: 20,
      gender: 'Masculino',
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

  setUser(user: User) {}
}

describe('HealthComponent', () => {
  let component: HealthComponent;
  let fixture: ComponentFixture<HealthComponent>;
  let genderField: AbstractControl;
  let isManField: AbstractControl;
  let isWomanField: AbstractControl;
  let heightField: AbstractControl;
  let weightField: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthComponent],
      imports: [ReactiveFormsModule, PrimeNgModule],
      providers: [
        { provide: ToastrService, useClass: ToastrServiceStub },
        { provide: UserService, useClass: UserServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    genderField = component.healthForm.controls['gender'];
    isManField = component.healthForm.controls['isMan'];
    isWomanField = component.healthForm.controls['isWoman'];
    heightField = component.healthForm.controls['height'];
    weightField = component.healthForm.controls['weight'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with five fields: gender, isMan, isWoman, height, weight', () => {
    expect(component.healthForm.contains('gender')).toBeTruthy();
    expect(component.healthForm.contains('isMan')).toBeTruthy();
    expect(component.healthForm.contains('isWoman')).toBeTruthy();
    expect(component.healthForm.contains('height')).toBeTruthy();
    expect(component.healthForm.contains('weight')).toBeTruthy();
  });

  it('should gender field be required', () => {
    genderField?.setValue('');
    expect(genderField?.valid).toBeFalsy();
    genderField?.setValue('Masculino');
    expect(genderField?.valid).toBeTruthy();
  });

  it('should isMan field be required', () => {
    isManField?.setValue('');
    expect(isManField?.valid).toBeFalsy();
    isManField?.setValue(true);
    expect(isManField?.valid).toBeTruthy();
  });

  it('should isWoman field be required', () => {
    isWomanField?.setValue('');
    expect(isWomanField?.valid).toBeFalsy();
    isWomanField?.setValue(true);
    expect(isWomanField?.valid).toBeTruthy();
  });

  it('should height field be required', () => {
    heightField?.setValue('');
    expect(heightField?.valid).toBeFalsy();
    heightField?.setValue(180);
    expect(heightField?.valid).toBeTruthy();
  });

  it('should height field be a number between 80 and 250 cm', () => {
    heightField?.setValue(79);
    expect(heightField?.valid).toBeFalsy();
    heightField?.setValue(251);
    expect(heightField?.valid).toBeFalsy();
    heightField?.setValue(180);
    expect(heightField?.valid).toBeTruthy();
  });

  it('should weight field be required', () => {
    weightField?.setValue('');
    expect(weightField?.valid).toBeFalsy();
    weightField?.setValue(80);
    expect(weightField?.valid).toBeTruthy();
  });

  it('should weight field be a number between 20 and 250 kg', () => {
    weightField?.setValue(19);
    expect(weightField?.valid).toBeFalsy();
    weightField?.setValue(251);
    expect(weightField?.valid).toBeFalsy();
    weightField?.setValue(80);
    expect(weightField?.valid).toBeTruthy();
  });

  it('should call updateUser method from UserService if form is valid', () => {
    const userService = TestBed.inject(UserService);
    const spy = spyOn(userService, 'updateUser').and.callThrough();

    genderField?.setValue('Masculino');
    isManField?.setValue(true);
    isWomanField?.setValue(false);
    heightField?.setValue(180);
    weightField?.setValue(80);

    component.calculateWeight();

    expect(spy).toHaveBeenCalled();
  });

  it('should not call updateUser method from UserService if form is invalid', () => {
    const userService = TestBed.inject(UserService);
    const spy = spyOn(userService, 'updateUser').and.callThrough();

    genderField?.setValue('');
    isManField?.setValue(true);
    isWomanField?.setValue(false);
    heightField?.setValue('');
    weightField?.setValue('');

    component.calculateWeight();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should return false if input is invalid', () => {
    genderField?.setValue('');
    genderField?.markAsTouched();
    expect(component.invalidInput('gender')).toBeTruthy();
  });

  it('should return true if input is valid', () => {
    genderField?.setValue('Massculino');
    genderField?.markAsTouched();
    expect(component.invalidInput('gender')).toBeFalsy();
  });

  it('should isMan field be true if user has gender Masculino', () => {
    expect(isWomanField?.value).toBeFalsy();
    expect(isManField?.value).toBeTruthy();
  });

  it('should not call getIdealWeith on ngOnInit if user does not have gender', () => {
    const spy = spyOn(component, 'getIdealWeight').and.callThrough();
    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should set man gender if user clicks gender man button', () => {
    spyOn(component, 'setManGender');
    const elements = fixture.debugElement.queryAll(By.css('p-togglebutton'));
    elements[0].triggerEventHandler('click', null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(isManField?.value).toBeTruthy();
      expect(isWomanField?.value).toBeFalsy();
      expect(genderField?.value).toBe('Masculino');
      expect(component.setManGender).toHaveBeenCalled();
    });
  });

  it('should return ranges from ideal weight when getIdealWeight is called', () => {
    component.getIdealWeight('Masculino', 180);
    expect(component.firstRange).toEqual(66.3);
    expect(component.secondRange).toEqual(79.8);
    expect(component.thirdRange).toEqual(92.7);
    expect(component.fourthRange).toEqual(112.9);
  });
});
