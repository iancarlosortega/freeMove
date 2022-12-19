import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import firebase from '@firebase/app-compat';
import { PostService, LikeService, UserService } from 'src/app/services';

import { PostComponent } from './post.component';
import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebaseConfig);

class PostServiceStub {
  addComment() {}

  getCommentsFromPost() {
    return of([
      {
        idComment: '1',
        idUser: firebase.firestore().doc('users/1'),
        body: 'body',
        createdAt: firebase.firestore.Timestamp.now(),
      },
    ]);
  }
}

class LikeServiceStub {
  getLikesFromPost() {
    return of([]);
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
}

class BsModalServiceStub {}

//TODO: Fix this test

xdescribe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let commentField: AbstractControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: PostService, useClass: PostServiceStub },
        { provide: LikeService, useClass: LikeServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: BsModalService, useClass: BsModalServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    component.post = {
      idPost: '1',
      idUser: firebase.firestore().doc('users/1'),
      createdAt: new Date() as any,
      url: 'https://www.fakeapi.com',
    };
    component.currentUser = {
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
    };
    fixture.detectChanges();
  });

  beforeEach(() => {
    commentField = component.commentForm.controls['comment'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have one field to write a comment', () => {
    expect(component.commentForm.contains('comment')).toBeTruthy();
  });

  it('should have a field to write a comment required', () => {
    commentField.setValue('');
    expect(commentField.valid).toBeFalsy();
  });

  it('should have a field to write a comment with a maximum of 150 characters', () => {
    commentField.setValue('a'.repeat(151));
    expect(commentField.valid).toBeFalsy();
    commentField.setValue('a'.repeat(150));
    expect(commentField.valid).toBeTruthy();
  });

  it('should submit button be disabled if the form is invalid', () => {
    commentField.setValue('');
    const submitButton = fixture.nativeElement.querySelector(
      '.post-footer button'
    );
    expect(component.commentForm.valid).toBeFalsy();
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should submit button be enabled if the form is valid', () => {
    commentField.setValue('a'.repeat(150));
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector(
      '.post-footer button'
    );
    expect(component.commentForm.valid).toBeTruthy();
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should call addComment method from PostService when submit the form', () => {
    const postService = TestBed.inject(PostService);
    const spy = spyOn(postService, 'addComment').and.callThrough();
    commentField.setValue('a'.repeat(150));
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector(
      '.post-footer button'
    );
    submitButton.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should delete button call deleteComment method', () => {
    const deleteButton = fixture.nativeElement.querySelector('mat-menu button');
    const deleteCommentSpy = spyOn(component, 'deletePost');
    deleteButton.click();
    expect(deleteCommentSpy).toHaveBeenCalled();
  });

  it('should like button call likePost method', () => {
    expect(component.isLiked).toBeFalsy();
    const likeButton = fixture.nativeElement.querySelector(
      '.post-likes mat-icon'
    );
    const likePostSpy = spyOn(component, 'addLike');
    likeButton.click();
    expect(likePostSpy).toHaveBeenCalled();
  });

  it('should open modal when click on see the comments', () => {
    const seeCommentsButton =
      fixture.nativeElement.querySelector('.post-comments');
    const openModalSpy = spyOn(component, 'openModal');
    seeCommentsButton.click();
    expect(openModalSpy).toHaveBeenCalled();
  });
});
