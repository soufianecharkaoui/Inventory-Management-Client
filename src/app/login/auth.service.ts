import {Injectable} from '@angular/core';
import {GC_AUTH_TOKEN, GC_USER_ID} from './constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AuthService {

  private userId: string = null;

  private _isAuthenticated = new BehaviorSubject(false);

  constructor() {
  }

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }
 
  saveUserData(userId: string, token: string) {

    localStorage.setItem(GC_USER_ID, userId);
    localStorage.setItem(GC_AUTH_TOKEN, token);
    this.setUserId(userId);
  }

  setUserId(userId: string) {
    this.userId = userId;

    this._isAuthenticated.next(true);
  }

  logout() {
    localStorage.removeItem(GC_USER_ID);
    localStorage.removeItem(GC_AUTH_TOKEN);
    this.userId = null;

    this._isAuthenticated.next(false);
  }

  autoLogin() {
    const userId = localStorage.getItem(GC_USER_ID);

    if (userId) {
      this.setUserId(userId);
    }
  }
}