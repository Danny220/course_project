import {Component, EventEmitter, Output, OnInit} from '@angular/core';
import { Recipe } from '../recipe.model';
import {Ingredient} from "../../shared/Ingredient.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;

  mouseOvered = false;
  @Output() showDropdown = new EventEmitter<Boolean>();
  constructor(private rService: RecipeService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  id = 0;
  ngOnInit() {
    this.activeRoute.params.pipe
    (
      map(
        params => {
          return +params['id'];
        }
      ), 
      switchMap(
        id => { 
          this.id = id;
          return this.store.select('recipes')
        }
      ),
      map(recipesState => {
        return recipesState.recipes.find(
          (recipe, index) => {
            return index === this.id;
          }
        )
      })
    ).subscribe(recipe => this.recipe = recipe);
  }

  log(value: any) {
    console.log(value);
  }
  toShopList() {
    // console.log("aggiungo...");
    // for (let ingredient of ingredients) {
    //   console.log(" -> " + ingredient.name);
    //   this.slService.addIngredient(ingredient);
    // }
    this.rService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['../../', 'edit', this.id], {relativeTo: this.activeRoute});
  }

  onDeleteRecipe() {
    this.rService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
