import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FollowService } from 'src/app/services';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Input() user!: User;
  @Input() idCurrentUser!: string;
  photoUrl: string = '';
  isCurrentUser = true;
  isFollowing: boolean = false;
  isDisabled: boolean = false;

  constructor(private router: Router, private followService: FollowService) {}

  ngOnInit() {
    this.photoUrl = this.user.photoUrl || 'assets/no-image.png';
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

  goToProfile() {
    this.router.navigate(['/dashboard/usuario', this.user.idUser]);
    this.closeModal.emit(true);
  }
}
