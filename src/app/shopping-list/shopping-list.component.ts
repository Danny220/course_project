import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from "../shared/Ingredient.model";
import {Observable} from "rxjs";
import {LoggingService} from "../logging.service";
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as shoppingListActions from "./store/shopping-list.actions";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy{
  ingredient!: Ingredient;
  ingredients!: Observable<{ingredients: Ingredient[]}>;

  // private igChangeSub: Subscription = new Subscription();
  // private igSelectedSub: Subscription = new Subscription();

  constructor(
    private loggingService: LoggingService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.igChangeSub = this.slService.ingredientsChanged
    //   .subscribe(
    //     (ingredients: Ingredient[]) => {
    //       this.ingredients = ingredients;
    //     }
    //   );
    // this.igSelectedSub = this.slService.ingredientSelected.subscribe(
    //   (ingredient: Ingredient) => {
    //     this.ingredient = ingredient;
    //   }
    // );
    this.loggingService
      .printLog('Ciao da ShoppingListComponent OnInit')
  }

  ngOnDestroy() {
    // this.igSelectedSub.unsubscribe();
    // this.igChangeSub.unsubscribe();
  }

  onSelect(i: number) {
    // this.slService.startedEditing.next(i);
    this.store.dispatch(
      new shoppingListActions.StartEdit(i)
    );
  }
}
