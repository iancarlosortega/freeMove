import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-alert',
  templateUrl: './stop-alert.component.html',
  styleUrls: ['../confirm-delete/confirm-delete.component.css'],
})
export class StopAlertComponent {
  constructor(private dialogRef: MatDialogRef<StopAlertComponent>) {}

  stopAlert() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
