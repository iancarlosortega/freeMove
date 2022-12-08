import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() deleteComment: EventEmitter<string> = new EventEmitter();
  @Input() comment!: Comment;
  @Input() idPost: string = '';
  @Input() canDelete: boolean = false;
  user!: User;
  photoUrl: string = '';
  timeAgo: string = '';
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.comment.idUser.get().then((doc: any) => {
      const user = doc.data();
      this.user = user;
      this.photoUrl = user.photoUrl || 'assets/no-image.png';
      this.timeAgo = moment(this.comment.createdAt.toDate())
        .locale('es')
        .fromNow();
    });
  }

  goToProfile() {
    this.router.navigate(['/dashboard/usuario', this.comment.idUser]);
    this.closeModal.emit(true);
  }
}
