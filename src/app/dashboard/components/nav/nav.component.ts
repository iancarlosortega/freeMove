import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces';
import { AuthService, UserService } from 'src/app/services';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  user!: User;
  userObs!: Subscription;
  url: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$.subscribe((user) => {
      this.user = user;
      this.url = user.photoUrl || 'assets/no-image.png';
    });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  search() {}

  logout() {
    this.authService.logout();
  }
}
