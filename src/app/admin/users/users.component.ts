import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  users: User[] = [];
  isLoading: boolean = true;
  scrollable: boolean = true;
  isDisabled: boolean = false;

  constructor(
    private observer: BreakpointObserver,
    private toastService: ToastrService,
    private userService: UserService
  ) {}

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit(): void {
    this.userService.user$.subscribe((user: User) => {
      const idUser = user.idUser;
      this.userService.getUsers().subscribe((users: User[]) => {
        this.users = users.filter((user) => user.idUser != idUser);
        this.isLoading = false;
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(min-width: 1280px)']).subscribe((res) => {
        if (res.matches) {
          this.scrollable = false;
        } else {
          this.scrollable = true;
        }
      });
    }, 0);
  }

  toggleRole(event: any, idUser: string) {
    this.isDisabled = true;
    const role = event.checked ? 'ADMIN-ROLE' : 'CLIENT-ROLE';
    this.userService.toggleRole(idUser, role).then((_) => {
      this.toastService.info('Rol actualizado');
      this.isDisabled = false;
    });
  }
}
