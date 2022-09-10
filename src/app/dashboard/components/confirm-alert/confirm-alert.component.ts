import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-alert',
  templateUrl: './confirm-alert.component.html',
  styleUrls: ['../confirm-delete/confirm-delete.component.css'],
})
export class ConfirmAlertComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmAlertComponent>) {}

  confirmAlert() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
