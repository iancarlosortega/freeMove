import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCardComponent } from './health-card.component';

describe('HealthCardComponent', () => {
  let component: HealthCardComponent;
  let fixture: ComponentFixture<HealthCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthCardComponent);
    component = fixture.componentInstance;
    component.user = {
      idUser: '1',
      email: 'iancarlosortegaleon@gmail.com',
      name: 'Ian Carlos',
      age: 20,
      gender: 'Masculino',
      phone: '+380501234567',
      role: 'ADMIN-ROLE',
      provider: 'email-password',
      height: 180,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate ideal weight', () => {
    expect(component.idealWeight).toBe(72.5);
  });
});
