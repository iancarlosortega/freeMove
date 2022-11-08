import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PostService, UserService } from 'src/app/services';

import { CommentComponent } from './comment.component';

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
class PostServiceStub {}

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: PostService, useClass: PostServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    component.comment = {
      idComment: '1',
      idUser: '1',
      createdAt: new Date() as any,
      body: 'Hello world',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
