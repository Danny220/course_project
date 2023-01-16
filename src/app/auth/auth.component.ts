import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { AuthResponseData, AuthService } from './auth.service';
import {Subscription} from 'rxjs';
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/directives/placeholder.directive";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy, OnInit {
    isLoginMode = true;
    isLoading = false;
    error: string | null = null;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
    private closeSub: Subscription;
    private storeSub: Subscription;

    constructor(
      // private authService: AuthService,
      private store: Store<fromApp.AppState>
    ){}

    ngOnInit() {
      this.storeSub = this.store.select('auth').subscribe(
        {
          next: authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if (this.error) {
              this.showErrorALert(this.error);
            }
          }
        }
      )
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
        this.error = null;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        if (this.isLoginMode)
        {
            this.store.dispatch(
              new AuthActions.LoginStart(
                {
                  email: email,
                  password: password,
                }
              )
            );
        } else {
            this.store.dispatch(
              new AuthActions.SignupStart({email: email, password: password})
            );
        }

        form.reset();
    }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  

  private showErrorALert(msg: string){
    const ref = this.alertHost.viewContainerRef.createComponent(AlertComponent);

    ref.instance.message = msg;
    this.closeSub = ref.instance.close.subscribe({
      next: () => {
        this.closeSub.unsubscribe();
        ref.destroy();
      }
    });
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
 