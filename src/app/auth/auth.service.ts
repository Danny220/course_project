import { Injectable } from '@angular/core';
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions'
import { User } from './user.model';

@Injectable({providedIn: 'root'})
export class AuthService {
  // user = new BehaviorSubject<User>(null);
  private tokenTimer: any;
  loginSuccess = false;

  public user: User;

  constructor(private store: Store<fromApp.AppState>) {}

  debug = true;
  
  setLogoutTimer(expirationDuration:number) {
    console.log(this.user);
    this.tokenTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
      this.tokenTimer = null;
    }
  }
}
