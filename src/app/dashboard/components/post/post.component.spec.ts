import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { PostService, LikeService, UserService } from 'src/app/services';

import { PostComponent } from './post.component';

class PostServiceStub {}

class LikeServiceStub {}

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

class BsModalServiceStub {}

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PostService, useClass: PostServiceStub },
        { provide: LikeService, useClass: LikeServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: BsModalService, useClass: BsModalServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    component.post = {
      idPost: '1',
      idUser: '1',
      createdAt: new Date() as any,
      url: 'https://www.fakeapi.com',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
