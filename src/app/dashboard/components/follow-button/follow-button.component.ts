import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FollowService } from 'src/app/services';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.css'],
})
export class FollowButtonComponent {
  @Output() updateFollow: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() user!: User;
  @Input() idCurrentUser!: string;
  @Input() isFollowing: boolean = false;
  isDisabled: boolean = false;

  constructor(private followService: FollowService) {}

  follow() {
    this.isDisabled = true;
    if (this.isFollowing) {
      this.followService
        .unfollow(this.user.idUser, this.idCurrentUser)
        .then(() => {
          this.isFollowing = false;
          this.isDisabled = false;
          this.updateFollow.emit(false);
        });
    } else {
      this.followService
        .follow(this.user.idUser, this.idCurrentUser)
        .then(() => {
          this.isFollowing = true;
          this.isDisabled = false;
          this.updateFollow.emit(true);
        });
    }
  }
}
