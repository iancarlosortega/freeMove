import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-link-account',
  templateUrl: './link-account.component.html',
  styleUrls: ['./link-account.component.css'],
})
export class LinkAccountComponent implements OnInit {
  isLoading: boolean = false;
  isDisabled: boolean = false;
  isErrorEmail: boolean = false;

  linkAccountForm: FormGroup = this.fb.group({
    linkedEmail: ['', [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  invalidInput(campo: string) {
    return (
      this.linkAccountForm.get(campo)?.invalid &&
      this.linkAccountForm.get(campo)?.touched
    );
  }

  linkAccount() {
    if (this.linkAccountForm.invalid) {
      this.linkAccountForm.markAllAsTouched();
      return;
    }

    console.log('Link Account');
  }
}
