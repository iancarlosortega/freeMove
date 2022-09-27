import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unlink-account',
  templateUrl: './unlink-account.component.html',
  styleUrls: ['../confirm-delete/confirm-delete.component.css'],
})
export class UnlinkAccountComponent {
  constructor(private dialogRef: MatDialogRef<UnlinkAccountComponent>) {}

  confirmUnlink() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
