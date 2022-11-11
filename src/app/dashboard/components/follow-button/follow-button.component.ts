import { Component, Input, OnInit } from '@angular/core';
import { FollowService } from 'src/app/services';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.css'],
})
export class FollowButtonComponent implements OnInit {
  @Input() user!: User;
  @Input() idCurrentUser!: string;
  isCurrentUser = true;
  isFollowing: boolean = false;
  isDisabled: boolean = false;

  constructor(private followService: FollowService) {}

  ngOnInit() {
    this.isFollowing =
      this.user.followers?.includes(this.idCurrentUser) || false;
    this.checkCurrentUser();
  }

  checkCurrentUser() {
    if (this.idCurrentUser === this.user.idUser) {
      this.isCurrentUser = true;
    } else {
      this.isCurrentUser = false;
    }
  }

  follow() {
    this.isDisabled = true;
    this.followService
      .unfollow(this.user.idUser, this.idCurrentUser)
      .then(() => {
        this.isFollowing = true;
        this.isDisabled = false;
      });
  }

  unfollow() {
    this.isDisabled = true;
    this.followService.follow(this.user.idUser, this.idCurrentUser).then(() => {
      this.isFollowing = false;
      this.isDisabled = false;
    });
  }
}
