import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';
import { LikeService, PostService, UserService } from 'src/app/services';
import { Comment, Post, User } from 'src/app/interfaces';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  @Input() idPost: string = '';
  @Input() idCurrentUser: string = '';
  user!: User;
  timeAgo: string = '';
  comments: Comment[] = [];
  likes: any[] = [];
  isLiked: boolean = false;
  isDisabled: boolean = false;
  showComments: boolean = false;

  commentForm = this.fb.group({
    comment: ['', [Validators.required, Validators.maxLength(150)]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private postService: PostService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.userService.getUserById(this.post.idUser).subscribe((user) => {
      this.user = user;
      this.getComments();
      this.getLikes();
      this.timeAgo = moment(this.post.createdAt.toDate())
        .locale('es')
        .fromNow();
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

  addComment() {
    const comment = this.commentForm.value.comment;
    this.commentForm.reset();
    this.postService.addComment(this.post.idPost, this.idCurrentUser, comment!);
  }
}
