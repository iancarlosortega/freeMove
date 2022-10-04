import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { LikeService, PostService, UserService } from 'src/app/services';
import { Comment, Post, User } from 'src/app/interfaces';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css'],
})
export class LikesComponent implements OnInit {
  @Input() idPost: string = '';
  @Input() idCurrentUser: string = '';
  user!: User;
  post!: Post;
  timeAgo: string = '';
  comments: Comment[] = [];
  likes: any[] = [];
  isLiked: boolean = false;
  showComments: boolean = false;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.postService.getPostById(this.idPost).subscribe((post) => {
      this.post = post;
      this.userService.getUserById(this.post.idUser).subscribe((user) => {
        this.user = user;
        this.getComments();
        this.getLikes();
        this.timeAgo = moment(this.post.createdAt.toDate())
          .locale('es')
          .fromNow();
      });
    });
  }

  getComments() {
    this.postService
      .getCommentsFromPost(this.post.idPost)
      .subscribe((comments) => {
        this.comments = comments;
      });
  }

  getLikes() {
    this.likeService.getLikesFromPost(this.post.idPost).subscribe((likes) => {
      this.likes = likes;
      this.isLiked = this.likes.some(
        (like) => like.idUser === this.idCurrentUser
      );
    });
  }

  addLike() {
    this.likeService.addLike(this.post.idPost, this.idCurrentUser);
    this.isLiked = true;
  }

  removeLike() {
    this.likeService.removeLike(this.post.idPost, this.idCurrentUser);
    this.isLiked = false;
  }
}
