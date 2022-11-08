import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LikeService, PostService, UserService } from 'src/app/services';

import { LikesComponent } from './likes.component';

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
}
class PostServiceStub {
  getPostById() {
    return of({
      idPost: '1',
      idUser: '1',
      createdAt: new Date(),
    });
  }
}
class LikeServiceStub {}

describe('LikesComponent', () => {
  let component: LikesComponent;
  let fixture: ComponentFixture<LikesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LikesComponent],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: PostService, useClass: PostServiceStub },
        { provide: LikeService, useClass: LikeServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
