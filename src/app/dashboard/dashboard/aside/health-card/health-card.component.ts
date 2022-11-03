import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces';

@Component({
  selector: 'app-health-card',
  templateUrl: './health-card.component.html',
  styleUrls: [
    '../stadistics-card/stadistics-card.component.css',
    './health-card.component.css',
  ],
})
export class HealthCardComponent implements OnInit {
  @Input() user!: User;

  idealWeight: number = 0;
  firstRange: number = 0;
  secondRange: number = 0;

  constructor() {}

  ngOnInit(): void {
    const gender = this.user.gender;

    if (gender !== 'Otro' && gender) {
      const height = this.user.height!;

      if (gender === 'Masculino') {
        this.idealWeight = height - 100 - (height - 150) / 4;
      } else {
        this.idealWeight = height - 100 - (height - 150) / 2.5;
      }

      this.firstRange = this.idealWeight - 6.2;
      this.secondRange = this.idealWeight + 7.3;
    }
  }
}
