import { Component, Input } from '@angular/core';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-suggested',
  templateUrl: './suggested.component.html',
  styleUrls: ['./suggested.component.css'],
})
export class SuggestedComponent {
  @Input() users: User[] = [];
}
