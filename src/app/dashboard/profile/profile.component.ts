import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { User } from 'src/app/interfaces';
import {
  FollowService,
  LikeService,
  PostService,
  UserService,
} from 'src/app/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  photoUrl: string = '';
  bannerUrl: string = '';
  userFollowers: any[] = [];
  userFollowing: any[] = [];
  userLikes: any[] = [];
  usersSuggested: User[] = [];

  idCurrentUser: string = '';
  isLoaded: boolean = false;
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

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private followService: FollowService,
    private likeService: LikeService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.showTab('posts');
    this.isLoaded = false;
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.userService.getUserByIdNoRealtime(id)))
      .subscribe((user) => {
        this.user = user;
        this.isLoaded = true;
        this.photoUrl = user.photoUrl || 'assets/no-image.png';
        this.checkCurrentUser();
        this.getSuggestedUsers();
        this.getFollowers();
        this.getFollowing();
        this.getLikes();
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
    this.userService
      .getUsersByIds(this.user.followers || [])
      .subscribe((users) => {
        this.userFollowers = users;
      });
  }

  getFollowing() {
    this.userService
      .getUsersByIds(this.user.following || [])
      .subscribe((users) => {
        this.userFollowing = users;
      });
  }

  followUser() {
    if (this.isFollowing) {
      this.isFollowing = false;
      this.userFollowers = this.userFollowers.filter(
        (user) => user.idUser !== this.idCurrentUser
      );
      console.log(this.userFollowers);
      this.followService.unfollow(this.user.idUser, this.idCurrentUser);
    } else {
      this.isFollowing = true;
      this.userFollowers = this.userFollowers.concat(this.currentUser);
      console.log(this.userFollowing);
      this.followService.follow(this.user.idUser, this.idCurrentUser);
    }
  }

  checkCurrentUser() {
    this.userObs = this.userService.user$.subscribe((user) => {
      this.currentUser = user;
      this.idCurrentUser = user.idUser;
      if (user.idUser === this.user.idUser) {
        this.isCurrentUser = true;
      } else {
        this.isCurrentUser = false;
        this.isFollowing =
          this.user.followers?.includes(this.idCurrentUser) || false;
      }
    });
  }

  getSuggestedUsers() {
    this.userService.getUsers().subscribe((userlist) => {
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

  getLikes() {
    this.likeService.getUserLikes(this.user.idUser).subscribe((likes) => {
      this.userLikes = likes;
    });
  }

  processImage(event: any) {
    const file = event.target.files[0];
    if (file.size > 2000000) {
      this.filename = 'Max Filesize 2Mb!';
    } else {
      this.filename = 'Edit Banner';
      // this.uploadService.pushUpload(file, 'banner', this.userid);
    }
  }

  //TODO: Abrir mensajería
  openChatRoom() {
    console.log('open chat room');
  }
}
