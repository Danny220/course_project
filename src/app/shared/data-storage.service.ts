import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import {Subject, Observable} from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { User } from '../auth/user.model';
@Injectable({providedIn: 'root'})
export class DataStorageService {
  public id: string | null;
    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private store: Store<fromApp.AppState>) {
      store.select("auth").pipe(
        map(data => data.user)
      ).subscribe({
        next: (user: User | null) => {
          this.id = user ? user.id : '';
        }
      })
    }

    isFetching = new Subject<boolean>();

    storeRecipes() {
      const recipes = this.recipeService.getRecipes();
      this.isFetching.next(true);
      var user =
      this.http
        .put('https://recipebook-re-default-rtdb.europe-west1.firebasedatabase.app/' + this.id + '/recipes.json',
          recipes
        )
        .subscribe({
          next: (response) => {
            console.log(response);
            this.isFetching.next(true);
          },
          error: (error) => {
            console.log(error)
            this.isFetching.next(false);
          },
          complete: () => {this.isFetching.next(false);}
        })
    }

    fetchRecipes(): Observable<Recipe[]> {
      return this.http.
      get<Recipe[]>(
        'https://recipebook-re-default-rtdb.europe-west1.firebasedatabase.app/' + this.id + '/recipes.json',
      ).pipe(
        map(recipes => {
          return recipes.map(recipe =>
            {
              if (recipe)
              {
                return {
                  ...recipe,
                  ingredients: recipe.ingredients ?
                    recipe.ingredients : []
                }
              } else return null;
            },
          )
        }),
        tap(
          recipes =>
          {
            // this.recipeService.setRecipes(recipes);
            this.store.dispatch(
              new RecipesActions.SetRecipes(recipes)
            );
          }
        )
      );
    }
}
