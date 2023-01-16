import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import {Subscription} from "rxjs";
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer'
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit,
                                            OnDestroy
                                            {
  // @Output() recipeOut = new EventEmitter<Recipe>();
  recipes!: Recipe[];
  subscription: Subscription;
  isNull = true;

  constructor(
    private store: Store<fromApp.AppState>,
    ) {
  }

  ngOnInit() {
    this.subscription = this.store.select('recipes')
    .pipe(map(recipesState => recipesState.recipes))
    .subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    )
  }
  // onSelectRecipe(recipe: Recipe) {
  //   this.recipeOut.emit(recipe);
  // }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
