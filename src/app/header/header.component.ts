import {Component, OnInit, OnDestroy} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) {}

  isFetching = false;

  private fetchSub: Subscription;
  private userSub: Subscription;
  public isAuthenticated = false;
  public userMail = '';
  loginSuccess = false;

  ngOnInit(): void {
    this.fetchSub =
      this.dataStorageService.isFetching.subscribe({
      next: (isFetching) => {
        this.isFetching = isFetching;
      },
      error: (err) => {
        this.isFetching = false;
        console.log(err);
      }
    });

    this.userSub = this.store.select('auth').pipe(
      map(authState => authState.user)
    ).subscribe({
      next: user => {
        this.isAuthenticated = !!user;
        if (user) {
          this.userMail = user.email;
        }
      }
    })
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.store.dispatch(
      new RecipesActions.FetchRecipes()
    );
  }

  isOpened = false;

  onClickToggle() {
    if (!this.isOpened) {
      this.isOpened = true;
    } else this.isOpened = false;
  }

  ngOnDestroy() {
    this.fetchSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
