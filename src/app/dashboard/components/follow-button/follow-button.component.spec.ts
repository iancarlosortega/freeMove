import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FollowService } from 'src/app/services';

import { FollowButtonComponent } from './follow-button.component';

class FollowServiceStub {}

describe('FollowButtonComponent', () => {
  let component: FollowButtonComponent;
  let fixture: ComponentFixture<FollowButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FollowButtonComponent],
      providers: [{ provide: FollowService, useClass: FollowServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowButtonComponent);
    component = fixture.componentInstance;
    component.user = {
      idUser: '1',
      email: 'iancarlos@gmail.com',
      name: 'Ian Carlos',
      age: 20,
      phone: '+380501234567',
      role: 'ADMIN-ROLE',
      provider: 'email-password',
      photoUrl: '',
      followers: ['1'],
      following: ['1'],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
