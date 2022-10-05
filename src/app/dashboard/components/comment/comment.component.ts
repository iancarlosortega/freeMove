import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostService, UserService } from 'src/app/services';
import { Comment, User } from 'src/app/interfaces';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Input() comment!: Comment;
  @Input() idCurrentUser: string = '';
  @Input() idPostUser: string = '';
  @Input() idPost: string = '';
  user!: User;
  photoUrl: string = '';
  timeAgo: string = '';
  constructor(
    private router: Router,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.userService.getUserById(this.comment.idUser).subscribe((user) => {
      this.user = user;
      this.photoUrl = user.photoUrl || 'assets/no-image.png';
      this.timeAgo = moment(this.comment.createdAt.toDate())
        .locale('es')
        .fromNow();
    });
  }

  deleteComment() {
    this.postService.deleteComment(this.idPost, this.comment.idComment);
  }

  goToProfile() {
    this.router.navigate(['/dashboard/usuario', this.comment.idUser]);
    this.closeModal.emit(true);
  }
}
