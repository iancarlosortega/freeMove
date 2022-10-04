import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services';
import { Comment, User } from 'src/app/interfaces';
import moment from 'moment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  user!: User;
  photoUrl: string = '';
  timeAgo: string = '';
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserById(this.comment.idUser).subscribe((user) => {
      this.user = user;
      this.photoUrl = user.photoUrl || 'assets/no-image.png';
      this.timeAgo = moment(this.comment.createdAt.toDate())
        .locale('es')
        .fromNow();
    });
  }
}
