import { createEffect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import * as RecipesActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import { switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipeEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  fetchRecipes = createEffect((): any => {
      this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
          return this.http.get<Recipe[]>
          (
            'https://recipebook-re-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
          )
        }),
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        map(recipes => {
          return new RecipesActions.SetRecipes(recipes);
        })
      );
    });
}