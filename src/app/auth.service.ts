import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

const correctUser: string = 'Вася';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(user: string): Observable<string> {
    return of(user === correctUser ? 'Вася' : '').pipe(delay(500));
  }
}
