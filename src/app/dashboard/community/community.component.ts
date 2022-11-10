import { Component, OnInit } from '@angular/core';
import { Post, User } from 'src/app/interfaces';
import { PostService, UserService } from 'src/app/services';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
})
export class CommunityComponent implements OnInit {
  currentUser!: User;
  posts: Post[] = [];
  usersSuggested: User[] = [];
  isLoading: boolean = true;
  constructor(
    private postService: PostService,
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
    this.postService.getAllPosts().subscribe((posts) => {
      this.posts = posts;
      this.isLoading = false;
    });
  }

  getSuggestedUsers() {
    this.userService.getSuggestedUsers().subscribe((userlist) => {
      this.usersSuggested = userlist.filter(
        (user) => user.idUser !== this.currentUser.idUser
      );
    });
  }
}
