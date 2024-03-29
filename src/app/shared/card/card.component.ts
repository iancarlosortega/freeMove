import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() title: string = '';
  @Input() description: any = '';
  @Input() iconSrc: string = '';
  @Input() measurement: string = '';
  @Input() isDate: boolean = false;
  @Input() isNumber: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
