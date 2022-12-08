import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, switchMap } from 'rxjs';
import { PostService, StorageService, UserService } from 'src/app/services';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { FileUpload } from 'src/app/models';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ProfileComponent implements OnInit, OnDestroy {
  photoUrl: string = '';
  bannerUrl?: string = '';
  userFollowers: any[] = [];
  userFollowing: any[] = [];
  userLikes: any[] = [];
  usersSuggested: User[] = [];

  idCurrentUser: string = '';
  isLoading: boolean = true;
  isCurrentUser!: boolean;
  isFollowing: boolean = false;
  showPosts!: boolean;
  showFollowers!: boolean;
  showFollowing!: boolean;
  showLikes!: boolean;
  user!: User;
  currentUser!: User;
  userObs!: Subscription;
  filename!: any;
  posts: any[] = [];

  currentImageToUpload?: FileUpload;
  uploadPercentage: number = 0;
  isUploading: boolean = false;
  isDisabled: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService,
    private postService: PostService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.showTab('posts');
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.userService.getUserByIdNoRealtime(id)))
      .subscribe((user) => {
        this.user = user;
        this.photoUrl = user.photoUrl || 'assets/no-image.png';
        this.bannerUrl = user.bannerUrl;
        this.checkCurrentUser();
        this.getSuggestedUsers();
        this.getFollowers();
        this.getFollowing();
        this.getLikes();
        this.isLoading = false;
        this.postService
          .getProfilePosts(this.user.idUser)
          .subscribe((posts) => {
            this.posts = posts;
          });
      });
  }

  ngOnDestroy() {
    this.userObs.unsubscribe();
  }

  showTab(type: string) {
    if (type === 'posts') {
      this.showPosts = true;
      this.showFollowers = false;
      this.showFollowing = false;
      this.showLikes = false;
    }
    if (type === 'followers') {
      this.showPosts = false;
      this.showFollowers = true;
      this.showFollowing = false;
      this.showLikes = false;
    }
    if (type === 'following') {
      this.showPosts = false;
      this.showFollowers = false;
      this.showFollowing = true;
      this.showLikes = false;
    }
    if (type === 'likes') {
      this.showPosts = false;
      this.showFollowers = false;
      this.showFollowing = false;
      this.showLikes = true;
    }
  }

  getFollowers() {
    this.userFollowers = [];
    this.user.followers?.forEach((doc: DocumentReference) => {
      doc.get().then((user: any) => {
        console.log('a');
        this.userFollowers.push(user.data());
      });
    });
  }

  getFollowing() {
    this.userFollowing = [];
    this.user.following?.forEach((doc: DocumentReference) => {
      doc.get().then((user: any) => {
        this.userFollowing.push(user.data());
      });
    });
  }

  getLikes() {
    this.userLikes = [];
    this.user.likes?.forEach((doc: DocumentReference) => {
      doc.get().then((user: any) => {
        this.userLikes.push(user.data());
      });
    });
  }

  checkCurrentUser() {
    this.isFollowing = false;
    this.userObs = this.userService.user$.subscribe((user) => {
      this.currentUser = user;
      this.idCurrentUser = user.idUser;
      if (this.idCurrentUser === this.user.idUser) {
        this.isCurrentUser = true;
      } else {
        this.isCurrentUser = false;
        this.user.followers?.forEach((user) =>
          user.get().then((doc) => {
            if (this.idCurrentUser === doc.id) {
              this.isFollowing = true;
              return;
            }
          })
        );
      }
    });
  }

  getSuggestedUsers() {
    this.userService.getSuggestedUsers().subscribe((userlist) => {
      this.usersSuggested = userlist.filter(
        (user) =>
          user.idUser !== this.user.idUser && user.idUser !== this.idCurrentUser
      );
    });
  }

  getActiveTabStyle(tabName: string) {
    const style = 'col-2 p-1 px-3 my-0 align-self-center';
    if (this.showPosts && tabName === 'posts') {
      return style + ' current';
    }
    if (this.showFollowing && tabName === 'following') {
      return style + ' current';
    }
    if (this.showFollowers && tabName === 'followers') {
      return style + ' current';
    }
    if (this.showLikes && tabName === 'likes') {
      return style + ' current';
    }
    return style;
  }

  changeBanner(event: any) {
    this.isDisabled = true;
    const file = event.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(file);

    if (!file.type.includes('image')) {
      this.isDisabled = false;
      this.bannerUrl = this.user.bannerUrl || 'assets/no-image.png';
      this.toastr.error('Por favor, solo subir imágenes.', 'Error');
      return;
    }

    if (file.size > 2000000) {
      this.isDisabled = false;
      this.toastr.error('La imagen debe pesar menos de 2MB');
      return;
    }

    if (this.user.bannerFilename) {
      this.storageService.deleteImage('/userBanners', this.user.bannerFilename);
    }

    this.user.bannerFilename = this.createUniqueFilename(file.name);

    this.currentImageToUpload = new FileUpload(file);
    this.isUploading = true;
    reader.onload = (event) => {
      this.bannerUrl = (<FileReader>event.target).result!.toString();
    };
    this.userService
      .updateBanner(this.currentImageToUpload, this.user)
      .subscribe((percentage) => {
        this.userService.setUser(this.user);
        this.uploadPercentage = Math.round(percentage ? percentage : 0);
        if (this.uploadPercentage == 100) {
          this.isUploading = false;
          this.isDisabled = false;
          this.uploadPercentage = 0;
        }
      });
  }

  createUniqueFilename(filename: string): string {
    const id = new Date().getTime();
    return `${id}-${filename.split('\\').slice(-1)[0]}`;
  }

  getStyle() {
    if (this.bannerUrl) {
      return this.sanitizer.bypassSecurityTrustStyle(
        `background-image: url(${this.bannerUrl})`
      );
    }
    return;
  }
}
