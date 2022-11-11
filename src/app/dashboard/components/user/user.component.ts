import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.photoUrl = this.user.photoUrl || 'assets/no-image.png';
  }

  goToProfile() {
    this.router.navigate(['/dashboard/usuario', this.user.idUser]);
    this.closeModal.emit(true);
  }
}
