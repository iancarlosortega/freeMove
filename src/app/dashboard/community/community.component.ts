import { Component, OnInit } from '@angular/core';
import { PostService, UserService } from 'src/app/services';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
})
export class CommunityComponent implements OnInit {
  currentUser!: User;
  usersSuggested: User[] = [];

  constructor(
    public postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.currentUser = user;
      this.getPosts();
      this.getSuggestedUsers();
    });
  }

  getPosts() {
    this.postService.init('posts', 'createdAt', {
      reverse: true,
      prepend: false,
    });
    // this.postService.getAllPosts().subscribe((posts) => {
    //   this.posts = posts;
    //   this.isLoading = false;
    // });
  }

  getSuggestedUsers() {
    this.userService.getSuggestedUsers().subscribe((userlist) => {
      this.usersSuggested = userlist.filter(
        (user) => user.idUser !== this.currentUser.idUser
      );
    });
  }

  scrollHandler(e: any) {
    if (e === 'bottom') {
      this.postService.more();
    }
  }
}
