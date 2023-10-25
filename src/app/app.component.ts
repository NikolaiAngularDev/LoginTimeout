import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { finalize } from 'rxjs';

const countdownValue = 60;
const errorTimer = 5000;
const countdownTimer = 1000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  public title: string = 'LoginTimeout';
  public loginForm: FormGroup = this.fb.group({
    user: ['', [Validators.required]],
  });
  public user: string = '';
  public error: boolean = false;
  public disableSubmit: boolean = false;
  public counter: number = 0;
  private _countdownInterval: number = 0;
  private _errorTimeout: number = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnDestroy() {
    if (this._countdownInterval) {
      clearInterval(this._countdownInterval);
    }
    if (this._errorTimeout) {
      clearInterval(this._errorTimeout);
    }
  }

  submit(): void {
    this.disableSubmit = true;
    this.authService.login(this.loginForm.get('user')?.value)
      .pipe(finalize(() => this.setButtonCountdown()))
      .subscribe({
      next: (res: string) => {
        if (res) {
          this.onSuccess(res);
        } else {
          this.onError();
        }
      },
      error: err => {
        this.onError();
      }
    })
  }

  onError() {
    this.user = '';
    this.error = true;
    this._errorTimeout = setTimeout(() => this.error = false, errorTimer);
  }

  onSuccess(result: string) {
    this.user = result;
  }

  setButtonCountdown() {
    this.counter = countdownValue;
    this._countdownInterval = setInterval(() => {
      if (--this.counter === 0) {
        clearInterval(this._countdownInterval);
        this.disableSubmit = false;
      }
    }, countdownTimer);
  }
}
