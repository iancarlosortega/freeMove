import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/interfaces';
import {
  UserService,
  FollowService,
  LikeService,
  PostService,
  StorageService,
} from 'src/app/services';

import { ProfileComponent } from './profile.component';

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
    });
  }

  getUserByIdNoRealtime(idUser: string): Observable<User> {
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

  getUsers(): Observable<User[]> {
    return of([]);
  }
}

class ActivatedRouteStub {
  params: Observable<any> = of({ id: '1' });
}

class ToastrServiceStub {}

class FollowServiceStub {}

class LikeServiceStub {
  getUserLikes(idUser: string): Observable<any[]> {
    return of([]);
  }
}

class PostServiceStub {
  getProfilePosts(idUser: string) {
    return of([]);
  }
}

class StorageServiceStub {}

class DomSanitizerStub {}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ToastrService, useClass: ToastrServiceStub },
        { provide: FollowService, useClass: FollowServiceStub },
        { provide: LikeService, useClass: LikeServiceStub },
        { provide: PostService, useClass: PostServiceStub },
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: DomSanitizer, useClass: DomSanitizerStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
