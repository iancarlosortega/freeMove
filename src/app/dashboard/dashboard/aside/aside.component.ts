import { Component, Input, OnInit } from '@angular/core';
import { Route, User } from 'src/app/interfaces';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
})
export class AsideComponent implements OnInit {
  @Input() routes: Route[] = [];
  @Input() user!: User;

  constructor() {}

  ngOnInit(): void {}
}
