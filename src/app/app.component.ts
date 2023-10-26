import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { finalize } from 'rxjs';

const COUNTDOWN_VALUE = 60;
const ERROR_TIMER = 5000;
const COUNTDOWN_TIMER = 1000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  public title: string = 'LoginTimeout';
  public loginForm!: FormGroup;
  public user: string = '';
  public error: boolean = false;
  public disableSubmit: boolean = false;
  public counter: number = 0;
  private countdownInterval: number = 0;
  private errorTimeout: number = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.errorTimeout) {
      clearInterval(this.errorTimeout);
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
    });
  }

  submit(): void {
    this.disableSubmit = true;
    const value = this.loginForm.get('user')?.value.trim();
    this.authService.login(value)
      .pipe(finalize(() => this.setButtonCountdown()))
      .subscribe({
        next: (res: string) => {
          res ? this.setUser(res) : this.onError();
        },
        error: err => {
          this.onError();
        }
      })
  }

  onError() {
    this.user = '';
    this.error = true;
    this.errorTimeout = setTimeout(() => this.error = false, ERROR_TIMER);
  }

  setUser(result: string) {
    this.user = result;
  }

  setButtonCountdown() {
    this.counter = COUNTDOWN_VALUE;
    this.countdownInterval = setInterval(() => {
      if (--this.counter === 0) {
        clearInterval(this.countdownInterval);
        this.disableSubmit = false;
      }
    }, COUNTDOWN_TIMER);
  }
}
