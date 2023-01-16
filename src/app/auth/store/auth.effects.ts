import { HttpClient } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, tap } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import * as AuthActions from './auth.actions';
import { catchError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  id: string;
  email: string;
  idToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}



const handleAuth = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate
  });       
};

const handleError = (err: any) => {
  console.log('catch: ' + err.error.error.message);
  let errorMessage = 'Errore inaspettato! Codice: '
    + err.error.error.message;
  if (!err.error || !err.error.error) {
    console.log('catch: if');
    return of (new AuthActions.AuthenticateFail(errorMessage))
  }
  console.log('catch: switch');
  switch(err.error.error.message) {
    case 'EMAIL_EXISTS':
      console.log('catch: switch -> EMAIL_EXISTS');
      errorMessage = 'Indirizzo email già in uso';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = "Questa mail non esiste!";
      console.log('catch: switch -> EMAIL_NOT_FOUND');
      break;
    case 'INVALID_PASSWORD':
      errorMessage = "Password errata!";
      console.log('catch: switch -> INVALID_PASSWORD');
      break;
    case 'USER_DISABLED':
      errorMessage = "Account disabilitato!";
      console.log('catch: switch -> USER_DISABLED');
      break;
    case 'PASSWORD_LOGIN_DISABLED':
      errorMessage = "Temporaneamente fuori servizio!";
      console.log('catch: switch -> PASSWORD_LOGIN_DISABLED');
      break;
    case 'INVALID_EMAIL':
      errorMessage = "Email invalido! Riprova.";
      console.log('catch: switch -> INVALID_EMAIL');
      break;
    case 'INVALID_PASSWORD':
      errorMessage = "Password invalida! Riprova.";
      console.log('catch: switch -> INVALID_PASSWORD');
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = "Operazione non autorizzata!";
      console.log('catch: switch -> OPERATION_NOT_ALLOWED');
      break;
  }
  console.log('catch: return ' + errorMessage);
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  saveUser = 
  (
    email: string,
    id: string,
    token: string,
    expire: Date,
  ) => {
    this.authService.user = new User(
      email,
      id,
      token,
      expire,
    )
  }
  authSignup = createEffect((): any => this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
        + environment.firebaseAPIKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true,
        }
      )      
      .pipe(
        tap((response => {
          this.authService.setLogoutTimer(+response.expiresIn * 1000);
        })),
        map(resData => {
          this.saveUser(
            resData.email,
            resData.id,
            resData.idToken,
            new Date(resData.expiresIn),
          )
          return handleAuth(
            +resData.expiresIn, 
            resData.email, 
            resData.localId, 
            resData.idToken
          );
        }),
        catchError(err => {
          return handleError(err);
        }),
      )
    })
  ))

  authLogin$ = createEffect((): any => this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + 
        environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        }
      )
      .pipe(
        tap((response => {
          this.authService.setLogoutTimer(+response.expiresIn * 1000);
        })),
        map(resData => {
          this.saveUser(
            resData.email,
            resData.id,
            resData.idToken,
            new Date(resData.expiresIn)
          )
          return handleAuth(
            +resData.expiresIn, 
            resData.email, 
            resData.localId, 
            resData.idToken
          );
        }),
        catchError(err => {
          return handleError(err);
        }),
      )
    }),
  ));

  authRedirect = createEffect((): any => this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS), 
    tap(() => {
      this.router.navigate(['/']);
    }),
  ), {dispatch: false});

  authLogout = createEffect((): any => this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  ), {dispatch: false});

  autologin = createEffect((): any => this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      console.log('Auto Login!');
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpireDate: string;
      } = JSON
        .parse(localStorage.getItem('userData')!);
  
      console.log(userData);
  
      if (!userData) {
        console.log('no userData in memoria');
        return {type: 'DUMMY'};
      }
      this.saveUser(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpireDate),
      )
      const loadedUser = new User(userData.email,
                                  userData.id,
                                  userData._token,
                                  new Date(
                                    userData
                                      ._tokenExpireDate
                                  ));
      console.log(loadedUser);
      if (loadedUser.token) {
        const expirationDuration = new Date(
          userData._tokenExpireDate
        ).getTime() - new Date().getTime();
          
        this.authService.setLogoutTimer(expirationDuration);
        // this.user.next(this.loadedUser);
        return new AuthActions.AuthenticateSuccess(
          {
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpireDate),
          }
        )
      }
      return {type: 'DUMMY'};
      })
  ));

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {}
}